'use client'
import Image from 'next/image'
import { Truck } from '@/logic/craftType';
import { fetchCraftToday } from '@/logic/getCraftplaces';
import { useEffect, useState } from 'react';
import './page.module.css'
import Eee from './ee';
import { fetchOffering } from '@/logic/getOffering';

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
  const offering = () =>fetchOffering()

  const fetchTrucks = async () => {
    try {
      const fetchedTrucks = await fetchCraftToday();

      const groupedTrucks = fetchedTrucks.reduce((acc, truck) => {
        const truckDate = new Date(truck.weekday);

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
    }
  };

  const toggleWeek = () => {
    setShowNextWeek(!showNextWeek);
  };
  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
      <Button onClick={offering}>Test offering</Button>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {weekdays.map((weekday) => (
          <div key={weekday} style={{ flexBasis: '20%', marginBottom: '1rem' }}>
            <h2>{weekday}</h2>
            {trucks[weekday]?.map((truck) => (
             <Card  key={truck.name} style={{ backgroundColor: '#636363', color: ' black' }}>
                <SUIImage
                          key={truck.name}
                          style={{width: '100px', height: '70px', backgroundColor: '#636363'}}
                          verticalAlign='middle'
                          circular
                          centered
                          src={truck.imageURL}
                          alt={``}
                        />
                <Card.Content>
                  <Card.Header color= 'white' textAlign='center'>{truck.name}</Card.Header>
                  <Card.Description color='white'>{truck.describtion}</Card.Description>
                  <Card.Description color = "white">
                    Location: <a href={`https://maps.google.com/?q=${truck.lat},${truck.long}`} target='_blank'>View on Map</a>
                  </Card.Description>
                  <Card.Description color = "white">
                   <p>{truck.weekday}</p>
                  </Card.Description>
                  {truck.offering && truck.offering.length > 0 && (
                    <Card.Description>Offering: {truck.offering}</Card.Description>
                  )}
                  {truck.payment && truck.payment.length > 0 && (
                    <div>
                      {truck.payment.map((paymentOption, index) => (
                        <SUIImage
                          key={index}
                          style={{width: '40px', height: '40px', rounded: true}}
                          circular
                          src={paymentIcons[paymentOption] || ''}
                          alt={`Payment Icon: ${paymentOption}`}
                        />
                      ))}
                    </div>
                  )}
                  <Eee  truck={truck}/>
                </Card.Content>
              </Card>
            ))}

          </div>
        ))}
      </div>
      <Button onClick={toggleWeek}>{showNextWeek ? 'Show this Week' : 'Show Next Week'}</Button>
    </div>
    
  )}  