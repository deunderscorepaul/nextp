import { Truck } from "./craftType";

export const mockTrucks: Truck[] = [
  {
    id: "1",
    lat: "49.5734",
    long: "11.0278",
    name: "Burger Paradise",
    offering: ["Classic Burger", "Cheeseburger", "Veggie Burger", "Sweet Potato Fries", "Milkshakes"],
    payment: ["pay_creditcard", "pay_debitcard", "pay_cash", "pay_apple"],
    describtion: "Gourmet burgers made with locally sourced ingredients. Our signature beef patties are grilled to perfection and served with artisanal buns.",
    weekday: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Today
    imageURL: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "2",
    lat: "49.5734",
    long: "11.0278",
    name: "Taco Fiesta",
    offering: ["Fish Tacos", "Carnitas", "Vegetarian Tacos", "Quesadillas", "Nachos"],
    payment: ["pay_creditcard", "pay_cash", "pay_paypal"],
    describtion: "Authentic Mexican street food with fresh ingredients and traditional recipes passed down through generations.",
    weekday: new Date(Date.now() + 0 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Today
    imageURL: "https://images.pexels.com/photos/4958792/pexels-photo-4958792.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "3",
    lat: "49.5734",
    long: "11.0278",
    name: "Pizza Mobile",
    offering: ["Margherita Pizza", "Pepperoni", "Quattro Stagioni", "Calzone", "Garlic Bread"],
    payment: ["pay_creditcard", "pay_debitcard", "pay_google", "coupon_foodschein"],
    describtion: "Wood-fired pizza made fresh to order. Our mobile oven brings authentic Italian flavors to your neighborhood.",
    weekday: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    imageURL: "https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "4",
    lat: "49.5734",
    long: "11.0278",
    name: "Asian Fusion Express",
    offering: ["Pad Thai", "Sushi Rolls", "Ramen", "Dumplings", "Boba Tea"],
    payment: ["pay_creditcard", "pay_apple", "pay_google"],
    describtion: "A fusion of Asian cuisines bringing you the best flavors from Thailand, Japan, and China in one convenient location.",
    weekday: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    imageURL: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "5",
    lat: "49.5734",
    long: "11.0278",
    name: "Sweet Treats Truck",
    offering: ["Ice Cream", "Waffles", "Crepes", "Cookies", "Hot Chocolate"],
    payment: ["pay_cash", "pay_creditcard", "pay_paypal"],
    describtion: "Delicious desserts and sweet treats perfect for any time of day. Made fresh with premium ingredients.",
    weekday: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    imageURL: "https://images.pexels.com/photos/1352278/pexels-photo-1352278.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "6",
    lat: "49.5734",
    long: "11.0278",
    name: "BBQ Smokehouse",
    offering: ["Pulled Pork", "Brisket", "Ribs", "Coleslaw", "Cornbread"],
    payment: ["pay_creditcard", "pay_debitcard", "pay_cash"],
    describtion: "Slow-smoked BBQ with our secret dry rub and homemade sauces. Real pit BBQ that melts in your mouth.",
    weekday: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    imageURL: "https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "7",
    lat: "49.5734",
    long: "11.0278",
    name: "Healthy Bowls Co.",
    offering: ["Acai Bowls", "Quinoa Salad", "Green Smoothies", "Protein Bowls", "Fresh Juices"],
    payment: ["pay_creditcard", "pay_apple", "pay_google", "coupon_foodschein"],
    describtion: "Fresh, healthy, and delicious bowls packed with superfoods and nutrients to fuel your day.",
    weekday: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days from now
    imageURL: "https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "8",
    lat: "49.5734",
    long: "11.0278",
    name: "Coffee & Pastries",
    offering: ["Espresso", "Cappuccino", "Croissants", "Muffins", "Bagels"],
    payment: ["pay_creditcard", "pay_debitcard", "pay_apple", "pay_cash"],
    describtion: "Artisan coffee and fresh pastries to start your morning right. Premium beans roasted to perfection.",
    weekday: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days from now
    imageURL: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "9",
    lat: "49.5734",
    long: "11.0278",
    name: "Mediterranean Delights",
    offering: ["Gyros", "Falafel", "Hummus", "Greek Salad", "Baklava"],
    payment: ["pay_creditcard", "pay_paypal", "pay_cash"],
    describtion: "Authentic Mediterranean cuisine with fresh herbs, olive oil, and traditional recipes from the Greek islands.",
    weekday: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 days from now
    imageURL: "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "10",
    lat: "49.5734",
    long: "11.0278",
    name: "Gourmet Grilled Cheese",
    offering: ["Classic Grilled Cheese", "Truffle Mac & Cheese", "Tomato Soup", "Loaded Fries", "Craft Sodas"],
    payment: ["pay_creditcard", "pay_debitcard", "pay_google", "pay_cash"],
    describtion: "Elevated comfort food featuring gourmet grilled cheese sandwiches with artisanal cheeses and premium ingredients.",
    weekday: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Next week
    imageURL: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400"
  }
];

// Generate additional trucks for next week
export const generateMockTrucksForWeek = (weekOffset: number = 0): Truck[] => {
  const baseDate = new Date();
  const startOfWeek = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() - baseDate.getDay() + (weekOffset * 7));
  
  return mockTrucks.map((truck, index) => ({
    ...truck,
    id: `${truck.id}-week-${weekOffset}`,
    weekday: new Date(startOfWeek.getTime() + (index % 7) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  }));
};