"use client"
import NextLink from "next/link";
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { Truck } from "@/logic/craftType";
import { fetchCraftToday } from "@/logic/getCraftplaces";
import { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Image } from '@nextui-org/image'
import { Divider } from "@nextui-org/divider";
import { Chip } from "@nextui-org/chip";
import { useTheme } from 'next-themes';
import { CalendarDays, MapPin, Clock, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { DebugPanel } from '@/components/DebugPanel';

// Debug mode indicator
const DEBUG_MODE = false; // Set to true to show debug panel

interface GroupedTrucks {
  [weekLabel: string]: Truck[];
}

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function Home() {
  const [trucks, setTrucks] = useState<GroupedTrucks>({});
  const [showNextWeek, setShowNextWeek] = useState(false);
  const [loading, setLoading] = useState(true);
  const [debugPanelVisible, setDebugPanelVisible] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const paymentIcons: { [key: string]: string } = {
    pay_creditcard: 'https://images.freeimages.com/fic/images/icons/2034/large_toolbar/256/credit_card.png',
    pay_debitcard: 'https://cdn-icons-png.flaticon.com/512/5566/5566931.png',
    pay_apple: 'https://cdn-icons-png.flaticon.com/512/5968/5968500.png',
    pay_google: 'https://cdn-icons-png.flaticon.com/512/6124/6124998.png',
    pay_paypal: 'https://cdn.icon-icons.com/icons2/1195/PNG/512/1490889684-paypal_82515.png',
    pay_cash: 'https://w7.pngwing.com/pngs/1017/516/png-transparent-advance-payment-computer-icons-money-cash-payment-icon-dollar-bill-illustration-miscellaneous-angle-text.png',
    coupon_foodschein: 'https://cdn-icons-png.flaticon.com/512/590/590461.png'
  };

  useEffect(() => {
    fetchTrucks();
  }, [showNextWeek]);

  const fetchTrucks = async () => {
    setLoading(true);
    try {
      const fetchedTrucks = await fetchCraftToday();
      setLastFetch(new Date());

      const groupedTrucks = fetchedTrucks.reduce((acc, truck) => {
        const truckDate = new Date(truck.weekday);
        const formattedDate = truckDate.toLocaleDateString('en-US');
        truck.weekday = formattedDate;

        const currentDate = new Date();
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
    } catch (error) {
      console.error('Error fetching trucks:', error);
    } finally {
      setLoading(false);
    }
  };

  const { resolvedTheme } = useTheme();

  const toggleWeek = () => {
    setShowNextWeek(!showNextWeek);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-default-600">Loading food trucks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-default-50">
      {/* Hero Section */}
      <div className="text-center py-12 px-4">
        {DEBUG_MODE && (
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-warning/10 border border-warning/20 rounded-full text-warning-600 text-sm font-medium">
              🐛 Debug Mode Active - Using Mock Data
            </div>
          </div>
        )}
        <h1 className={title({ size: "lg", color: "foreground" })}>

      {/* Debug Panel - Only in development */}
      {DEBUG_MODE && (
        <DebugPanel
          isVisible={debugPanelVisible}
          onToggle={() => setDebugPanelVisible(!debugPanelVisible)}
          trucksCount={Object.values(trucks).flat().length}
          lastFetch={lastFetch}
        />
      )}
          🚚 Food Truck Finder
        </h1>
        <p className={subtitle({ class: "mt-4 max-w-2xl mx-auto" })}>
          Discover delicious food trucks in your area. Fresh meals on wheels, updated daily.
        </p>
        
        {/* Week Toggle */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={toggleWeek}
            variant="flat"
            size="lg"
            startContent={showNextWeek ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            className="bg-primary/10 hover:bg-primary/20 transition-all duration-300"
          >
            {showNextWeek ? 'Show This Week' : 'Show Next Week'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {weekdays.map((weekday) => (
            <div key={weekday} className="space-y-4">
              {/* Day Header */}
              <div className="sticky top-20 z-30 bg-background/90 backdrop-blur-md rounded-lg p-3 border border-divider shadow-lg">
                <h2 className="text-xl font-bold text-center flex items-center justify-center gap-2">
                  <CalendarDays size={20} className="text-primary" />
                  {weekday}
                </h2>
                <p className="text-sm text-default-500 text-center mt-1">
                  {trucks[weekday]?.length || 0} truck{trucks[weekday]?.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Trucks for this day */}
              <div className="space-y-4">
                {trucks[weekday]?.length > 0 ? (
                  trucks[weekday].map((truck) => (
                    <Card
                      key={truck.name}
                      className="group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border-0 bg-gradient-to-br from-white to-default-50 dark:from-default-100 dark:to-default-200 overflow-hidden"
                      isPressable
                    >
                      {/* Truck Image */}
                      <div className="relative overflow-hidden h-40">
                        <Image
                          src={truck.imageURL}
                          alt={truck.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          radius="none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Truck Name Badge */}
                        <div className="absolute bottom-3 left-3 right-3 z-10">
                          <div className="bg-black/40 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20">
                            <h3 className="text-white font-bold text-lg truncate drop-shadow-sm">
                            {truck.name}
                          </h3>
                          </div>
                        </div>
                      </div>

                      <CardBody className="p-4 space-y-3">
                        {/* Description */}
                        <p className="text-sm text-default-600 line-clamp-2">
                          {truck.describtion}
                        </p>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-sm text-default-500">
                          <Clock size={16} />
                          <span>{truck.weekday}</span>
                        </div>

                        {/* Location */}
                        <Link
                          href={`https://maps.google.com/?q=${truck.lat},${truck.long}`}
                          target="_blank"
                          className="flex items-center gap-2 text-sm text-primary hover:text-primary-600 transition-colors"
                        >
                          <MapPin size={16} />
                          <span>View on Map</span>
                        </Link>

                        {/* Offerings */}
                        {truck.offering && truck.offering.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-default-700">Offerings:</p>
                            <div className="flex flex-wrap gap-1">
                              {truck.offering.slice(0, 3).map((offer, index) => (
                                <Chip
                                  key={index}
                                  size="sm"
                                  variant="flat"
                                  color="secondary"
                                  className="text-xs"
                                >
                                  {offer}
                                </Chip>
                              ))}
                              {truck.offering.length > 3 && (
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  color="default"
                                  className="text-xs"
                                >
                                  +{truck.offering.length - 3} more
                                </Chip>
                              )}
                            </div>
                          </div>
                        )}
                      </CardBody>

                      {/* Payment Methods */}
                      {truck.payment && truck.payment.length > 0 && (
                        <CardFooter className="pt-0 pb-4 px-4">
                          <div className="w-full">
                            <div className="flex items-center gap-2 mb-2">
                              <CreditCard size={16} className="text-default-500" />
                              <span className="text-sm font-medium text-default-700">Payment:</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {truck.payment.map((paymentOption, index) => (
                                <div
                                  key={index}
                                  className="w-8 h-8 rounded-md overflow-hidden border border-divider bg-white p-1 hover:scale-110 transition-transform duration-200"
                                >
                                  <Image
                                    src={paymentIcons[paymentOption]}
                                    alt={`Payment: ${paymentOption}`}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardFooter>
                      )}
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 px-4 bg-default-100/50 rounded-lg border-2 border-dashed border-default-300 backdrop-blur-sm">
                    <p className="text-default-500">No trucks scheduled</p>
                    <p className="text-xs text-default-400 mt-1">Check back later for updates</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-default-100 border-t border-divider mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-default-600">
            <p className="mb-2">
              <strong>Impressum:</strong> Paul Drescher, Dompfaffstr 32, 91088 Bubenreuth
            </p>
            <p>
              Email: <Link href="mailto:contact@deunderscorepaul.de" className="text-primary">contact@deunderscorepaul.de</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}