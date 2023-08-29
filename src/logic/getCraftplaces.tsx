import { Truck } from "./craftType";

export async function fetchCraftToday(): Promise<Truck[]> {
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

    console.log(trucks); 
    return trucks;
  } catch (error) {
    console.error("Error fetching craft data:", error);
    throw error;
  }
}
