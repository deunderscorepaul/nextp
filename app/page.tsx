"use client";
import NextLink from "next/link";
import { Link } from "@nextui-org/link";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Image } from "@nextui-org/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Truck } from "@/logic/craftType";
import { fetchCraftToday } from "@/logic/getCraftplaces";

interface GroupedTrucks {
  [weekLabel: string]: Truck[];
}

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function Home() {
  const [trucks, setTrucks] = useState<GroupedTrucks>({});
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, 1 = next week
  const { resolvedTheme } = useTheme();
  const [textColor, setTextColor] = useState("white");

  const paymentIcons: { [key: string]: string } = {
    pay_creditcard:
      "https://images.freeimages.com/fic/images/icons/2034/large_toolbar/256/credit_card.png",
    pay_debitcard: "https://cdn-icons-png.flaticon.com/512/5566/5566931.png",
    pay_apple: "https://cdn-icons-png.flaticon.com/512/5968/5968500.png",
    pay_google: "https://cdn-icons-png.flaticon.com/512/6124/6124998.png",
    pay_paypal: "https://cdn.icon-icons.com/icons2/1195/PNG/512/1490889684-paypal_82515.png",
    pay_cash:
      "https://w7.pngwing.com/pngs/1017/516/png-transparent-advance-payment-computer-icons-money-cash-payment-icon-dollar-bill-illustration-miscellaneous-angle-text.png",
    coupon_foodschein: "https://cdn-icons-png.flaticon.com/512/590/590461.png",
  };

  const currentDate = new Date();

  // Automatically show next week on weekends (Saturday/Sunday)
  useEffect(() => {
    if (currentDate.getDay() === 6 || currentDate.getDay() === 0) {
      setWeekOffset(1);
    }
    fetchTrucks();
  }, [weekOffset]);

  // Adjust text color based on the theme
  useEffect(() => {
    setTextColor(resolvedTheme === "dark" ? "white" : "black");
  }, [resolvedTheme]);

  // Fetch trucks based on the current week offset
  const fetchTrucks = async () => {
    try {
      const fetchedTrucks = await fetchCraftToday();

      const groupedTrucks = fetchedTrucks.reduce((acc, truck) => {
        const truckDate = new Date(truck.weekday);

        // Calculate the first day of the target week
        const firstDayOfTargetWeek = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - currentDate.getDay() + weekOffset * 7
        );

        // Assign trucks to their weekday if they fall within the target week
        const weekLabel = truckDate.toLocaleDateString("en-US", { weekday: "long" });

        if (
          truckDate >= firstDayOfTargetWeek &&
          truckDate <
            new Date(
              firstDayOfTargetWeek.getFullYear(),
              firstDayOfTargetWeek.getMonth(),
              firstDayOfTargetWeek.getDate() + 7
            )
        ) {
          if (!acc[weekLabel]) {
            acc[weekLabel] = [];
          }
          acc[weekLabel].push(truck);
        }

        return acc;
      }, {} as GroupedTrucks);

      setTrucks(groupedTrucks);
    } catch (error) {
      console.error("Error fetching trucks:", error);
    }
  };

  // Toggle weekOffset between 0 (current week) and 1 (next week)
  const toggleWeek = () => {
    setWeekOffset((prevOffset) => (prevOffset === 1 ? 0 : 1));
  };

  return (
    <div style={{ minHeight: "100vh", color: "white" }}>
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {weekdays.map((weekday) => (
          <div key={weekday} style={{ flexBasis: "20%", marginBottom: "1rem", color: textColor }}>
            <h2>{weekday}</h2>
            {trucks[weekday]?.map((truck, index) => (
              <Card
                isBlurred
                key={truck.name + index}
                className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px] mb-4 mr-2"
                shadow="sm"
              >
                <div className="flex justify-center items-center">
                  <CardHeader className="mx-auto">{truck.name}</CardHeader>
                </div>
                <div className="flex justify-center items-center mb-2">
                  <Image
                    className="mx-auto"
                    radius="lg"
                    style={{ width: "100px", height: "70px" }}
                    src={truck.imageURL}
                    alt={truck.name}
                    shadow="sm"
                  />
                </div>
                <Divider />
                <CardBody>
                  <p>{truck.describtion}</p>
                  <p>
                    Location:{" "}
                    <Link
                      href={`https://maps.google.com/?q=${truck.lat},${truck.long}`}
                      target="_blank"
                    >
                      View on Map
                    </Link>
                  </p>
                  <p>{truck.weekday}</p>
                </CardBody>
				{truck.offering && truck.offering.length > 0 && (
					  <CardBody>Offering: {truck.offering}</CardBody>
					)}
                <div className="content-center">
                  {truck.payment && (
                    <div className="flex flex-wrap content-center">
                      {truck.payment.map((paymentOption, index) => (
                        <Image
                          key={index}
                          style={{ width: "40px", height: "40px" }}
                          src={paymentIcons[paymentOption] || ""}
                          alt={`Payment Icon: ${paymentOption}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ))}
      </div>
      <Button onClick={toggleWeek}>
        {weekOffset === 1 ? "Show This Week" : "Show Next Week"}
      </Button>
    </div>
  );
}
