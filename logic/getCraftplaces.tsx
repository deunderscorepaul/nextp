import { Truck } from "./craftType";
import { mockTrucks, generateMockTrucksForWeek } from "./mockData";

// Debug mode - set to true for development
const DEBUG_MODE = process.env.NODE_ENV === 'development';

export async function fetchCraftToday(): Promise<Truck[]> {
  // Return mock data in debug mode
  if (DEBUG_MODE) {
    console.log('🚛 DEBUG MODE: Using mock truck data');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate trucks for current and next week
    const currentWeekTrucks = generateMockTrucksForWeek(0);
    const nextWeekTrucks = generateMockTrucksForWeek(1);
    
    return [...currentWeekTrucks, ...nextWeekTrucks];
  }

  try {
    const response = await fetch('/result.json'); // Fetch the JSON file from the public directory
    const responseData = await response.json();

    if (!Array.isArray(responseData.result)) {
      throw new Error("Invalid response format. Expected an array in the 'result' property.");
    }

    const trucks: Truck[] = responseData.result.map((truckData: any) => ({
      id: truckData.id,
      lat: truckData.location.position.latitude,
      long: truckData.location.position.longitude,
      name: truckData.vendor.company,
      offering: truckData.vendor.offer,
      payment: truckData.vendor.payments,
      describtion: truckData.description,
      weekday: truckData.date.start.date,
      imageURL: truckData.logo.url.europe || ''
    })); 
    return trucks;
  } catch (error) {
    console.error("Error fetching craft data:", error);
    throw error;
  }
}
