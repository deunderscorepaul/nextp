export interface ImpressumConfig {
  name: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
    country: string;
  };
  contact: {
    email: string;
    phone?: string;
    website?: string;
  };
  legal: {
    vatId?: string;
    commercialRegister?: string;
    responsibleForContent?: string;
  };
}

export const impressumConfig: ImpressumConfig = {
  name: "Your Company Name",
  address: {
    street: "Your Street 123",
    postalCode: "12345",
    city: "Your City",
    country: "Germany"
  },
  contact: {
    email: "contact@yourcompany.com",
    phone: "+49 123 456789",
    website: "https://yourcompany.com"
  },
  legal: {
    vatId: "DE123456789",
    commercialRegister: "HRB 12345",
    responsibleForContent: "Your Name"
  }
};

// Helper function to format address
export const formatAddress = (config: ImpressumConfig): string => {
  const { address } = config;
  return `${address.street}, ${address.postalCode} ${address.city}, ${address.country}`;
};

// Helper function to get contact info
export const getContactInfo = (config: ImpressumConfig) => {
  return {
    email: config.contact.email,
    phone: config.contact.phone,
    website: config.contact.website
  };
};