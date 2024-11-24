"use client"
import NextLink from "next/link";
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code"
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { Truck } from "@/logic/craftType";
import { fetchCraftToday } from "@/logic/getCraftplaces";
import { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, CardHeader, CardProps,CardProvider } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import {Image } from '@nextui-org/image'
import {Divider} from "@nextui-org/divider";
import { ThemeProvider } from "next-themes";
import { useTheme } from 'next-themes';

interface GroupedTrucks {
	[weekLabel: string]: Truck[];
  }
  
  
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function Home() {

	const [trucks, setTrucks] = useState<GroupedTrucks>({});
  const [showNextWeek, setShowNextWeek] = useState(false);

  const paymentIcons: { [key: string]: any } = {
    pay_creditcard: ('https://images.freeimages.com/fic/images/icons/2034/large_toolbar/256/credit_card.png'),
    pay_debitcard: ('https://cdn-icons-png.flaticon.com/512/5566/5566931.png'),
    pay_apple: ('https://cdn-icons-png.flaticon.com/512/5968/5968500.png'),
    pay_google: ('https://cdn-icons-png.flaticon.com/512/6124/6124998.png'),
    pay_paypal: ('https://cdn.icon-icons.com/icons2/1195/PNG/512/1490889684-paypal_82515.png'),
    pay_cash: ('https://w7.pngwing.com/pngs/1017/516/png-transparent-advance-payment-computer-icons-money-cash-payment-icon-dollar-bill-illustration-miscellaneous-angle-text.png'),
    coupon_foodschein: ('https://cdn-icons-png.flaticon.com/512/590/590461.png')
    
  };
  useEffect(() => {
    fetchTrucks();
  }, [showNextWeek]);



  const fetchTrucks = async () => {
    try {
      const fetchedTrucks = await fetchCraftToday();

      const groupedTrucks = fetchedTrucks.reduce((acc, truck) => {
        const truckDate = new Date(truck.weekday);

        const currentDate = new Date();
		const formattedDate = truckDate.toLocaleDateString('en-US');
		truck.weekday = formattedDate;

        const firstDayOfWeek = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - currentDate.getDay() + (showNextWeek ? 7 : 0)
        );

        const weekLabel = truckDate.toLocaleDateString('en-US', { weekday: 'long' });

        if (truckDate >= firstDayOfWeek && truckDate < new Date(firstDayOfWeek.getFullYear(), firstDayOfWeek.getMonth(), firstDayOfWeek.getDate() + 7)) {
          if (!acc[weekLabel]) {
            acc[weekLabel] = [];
          }
          acc[weekLabel].push(truck);
        }

        return acc;
      }, {} as GroupedTrucks);

      setTrucks(groupedTrucks);
      console.log(groupedTrucks)
    } catch (error) {
      console.error('Error fetching trucks:', error);
    }
  };

  const { resolvedTheme } = useTheme();
  const [textColor, setTextColor] = useState('white'); // Set initial text color to white for dark mode


  useEffect(() => {
    // Update text color when the theme changes
    setTextColor(resolvedTheme === 'dark' ? 'white' : 'black');
  }, [resolvedTheme]);


  const toggleWeek = () => {
    setShowNextWeek(!showNextWeek);
  };
	return (
		<div style={{ minHeight: '100vh', color: 'white' }}>
		<div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
		  {weekdays.map((weekday) => (
			<div key={weekday} style={{ flexBasis: '20%', marginBottom: '1rem', color: textColor}}>
			  <h2>{weekday}</h2>
			  {trucks[weekday]?.map((truck) => (
			   <Card isBlurred key={truck.name}  className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px] mb-4 mr-2"
			   shadow="sm" >
				<div  className="flex justify-center items-center">
				<CardHeader className="mx-auto">{truck.name}</CardHeader>
				</div>
				<div className="flex justify-center items-center mb-2">
				  <Image
				  			className="mx-auto"
				  			radius="lg"
							key={truck.name}
							style={{width: '100px', height: '70px'}}
							src={truck.imageURL}
							alt={``}
							shadow="sm"
						  />
						  </div>
					<Divider></Divider>
					<CardBody ><p>{truck.describtion}</p>
					<p>
					  Location: <Link href={`https://maps.google.com/?q=${truck.lat},${truck.long}`} target='_blank'>View on Map</Link>
					</p>

					 <p>{truck.weekday}</p>
					</CardBody>
					{truck.offering && truck.offering.length > 0 && (
					  <CardBody>Offering: {truck.offering}</CardBody>
					)}
					<div className="content-center">
					{truck.payment && truck.payment.length > 0 && (
					  <div className="flex flex-wrap content-center">
						{truck.payment.map((paymentOption, index) => (
						  <Image
							key={index}
							style={{width: '40px', height: '40px'}}
							src={paymentIcons[paymentOption] || ''}
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
		<Button onClick={toggleWeek}>{showNextWeek ? 'Show this Week' : 'Show Next Week'}</Button>
	  </div>
	);
}