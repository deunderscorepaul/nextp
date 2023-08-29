import { Offering } from "./interfaceOffering";

export async function fetchOffering(): Promise<Offering[]> {
  try {
    const response = await fetch('/offering.json'); // Fetch the JSON file from the public directory
    const responseData = await response.json();

    if (!Array.isArray(responseData.result)) {
      throw new Error("Invalid response format. Expected an array in the 'result' property.");
    }

    const offerings: Offering[] = responseData.result.map((offer: any) => ({
      id: offer.id,
      menu: offer.offering 
    }));

    console.log(offerings); 
    return offerings;
  } catch (error) {
    console.error("Error fetching offering data:", error);
    throw error;
  }
}
