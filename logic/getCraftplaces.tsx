import { Truck } from "./craftType";
import { mockTrucks, generateMockTrucksForWeek } from "./mockData";

// Debug mode - set to true for development
const DEBUG_MODE = process.env.NODE_ENV === 'development';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

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
    // Try to fetch from backend first
    const response = await fetch(`${BACKEND_URL}/api/trucks`);
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    const responseData = await response.json();

    if (!responseData.success || !Array.isArray(responseData.data)) {
      throw new Error("Invalid response format from backend API");
    }

    console.log(`🚛 Fetched ${responseData.data.length} trucks from backend (cached: ${responseData.cached})`);
    return responseData.data;
  } catch (error) {
    console.error("Error fetching from backend, falling back to static data:", error);
    
    // Fallback to static JSON file if backend is unavailable
    try {
      const fallbackResponse = await fetch('/result.json');
      const fallbackData = await fallbackResponse.json();
      
      if (!Array.isArray(fallbackData.result)) {
        throw new Error("Invalid fallback data format");
      }
      
      const trucks: Truck[] = fallbackData.result.map((truckData: any) => ({
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
      
      console.log(`🚛 Using fallback data: ${trucks.length} trucks`);
      return trucks;
    } catch (fallbackError) {
      console.error("Fallback data also failed:", fallbackError);
      throw new Error("Both backend and fallback data sources failed");
    }
  }
}
