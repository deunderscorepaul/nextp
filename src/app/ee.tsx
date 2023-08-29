import React, { useState } from 'react';
import { Truck } from '@/logic/craftType';
import styles from './ee.module.css'; // Correct the path to your CSS module

interface EeeProps {
  truck: Truck;
}

const Eee: React.FC<EeeProps> = ({ truck }) => {
    const [open, setOpen] = useState(false); // Use useState from 'react'

    const foodOffer: { [key: string]: string } = {
        '437ee8943a07512181b407d8fbeda26b': 'https://images.freeimages.com/fic/images/icons/2034/large_toolbar/256/credit_card.png',
        'pay_debitcard': 'https://cdn-icons-png.flaticon.com/512/5566/5566931.png',
        'pay_apple': 'https://cdn-icons-png.flaticon.com/512/5968/5968500.png',
        'pay_google': 'https://cdn-icons-png.flaticon.com/512/6124/6124998.png',
        'pay_paypal': 'https://cdn.icon-icons.com/icons2/1195/PNG/512/1490889684-paypal_82515.png',
        'pay_cash': 'https://w7.pngwing.com/pngs/1017/516/png-transparent-advance-payment-computer-icons-money-cash-payment-icon-dollar-bill-illustration-miscellaneous-angle-text.png',
        'coupon_foodschein': 'https://cdn-icons-png.flaticon.com/512/590/590461.png'
      };
    return (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          trigger={<Button color='grey'>Show Menu</Button>}
        >
          <Modal.Header>Menu</Modal.Header>
          <Modal.Content image scrolling>
            <Image size='medium'src={truck.imageURL}  wrapped />
    
            <Modal.Description>
              <p>
                Offering will be here soon™
              </p>
    
              <Image
                src='https://react.semantic-ui.com/images/wireframe/paragraph.png'
                style={{ marginBottom: 10 }}
              />
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setOpen(false)} primary>
              Exit <Icon name='chevron right' />
            </Button>
          </Modal.Actions>
        </Modal>
    );
};

export default Eee;