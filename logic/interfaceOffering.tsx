export interface Offering {
  name: string;
  description: string;
  optionals: string;
  price: string;
  category: string;
}

export interface MenuItem {
  id: string;
  offering: Offering[];
}

export interface RestaurantData {
  results: MenuItem[];
}