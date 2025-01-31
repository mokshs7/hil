export interface AddressSuggestion {
    id: string;
    type: string;
    score: number;
    entityType?: string;
    address: {
      municipality: string;
      countrySecondarySubdivision?: string;
      countrySubdivision?: string;
      countrySubdivisionName?: string;
      countrySubdivisionCode?: string;
      countryCode: string;
      country: string;
      countryCodeISO3?: string;
      freeformAddress?: string;
      localName?: string;
      streetNumber?: string;
      streetName?: string;
      municipalitySubdivision?: string;
      postalCode?: string;
    };
    position?: {
      lat: number;
      lon: number;
    };
    viewport?: {
      topLeftPoint: {
        lat: number;
        lon: number;
      };
      btmRightPoint: {
        lat: number;
        lon: number;
      };
    };
    boundingBox?: {
      topLeftPoint: {
        lat: number;
        lon: number;
      };
      btmRightPoint: {
        lat: number;
        lon: number;
      };
    };
    dataSources?: {
      geometry?: {
        id: string;
      };
    };
    poi?: {
      name?: string;
      phone?: string;
      categorySet?: Array<{
        id: number;
      }>;
      url?: string;
      categories?: string[];
      classifications?: Array<{
        code: string;
        names: Array<{
          nameLocale: string;
          name: string;
        }>;
      }>;
    };
  }
export interface SimplifiedAddressSuggestion {
  id: string;
  type: string;
  score: number;
  address: {
    municipality: string;
    countrySubdivision?: string;
    countryCode: string;
    country: string;
    freeformAddress?: string;
    postalCode?: string;
  };
  position?: {
    lat: number;
    lon: number;
  };
  poi?: {
    name?: string;
    phone?: string;
    url?: string;
  };
}