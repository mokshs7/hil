import axios from 'axios';
import { AddressSuggestion , SimplifiedAddressSuggestion } from './types';
import * as dotenv from 'dotenv';
dotenv.config();
class QuickRouteAddress {
  private apiKey: string;
  private baseUrl: string = 'https://api.tomtom.com/search/2/search/';

  constructor(apiKey:string) {
    this.apiKey = apiKey;
    console.log('API Key:', this.apiKey);
  }
  
  public async getSuggestions(partialAddress: string): Promise<SimplifiedAddressSuggestion[]> {
    try {
      const response = await axios.get(`${this.baseUrl}${encodeURIComponent(partialAddress)}.json`, {
        params: {
          key: this.apiKey,
          countrySet: 'AU', // Limit to Australian addresses
        },
      });
      
      // Handle cases where response.data.results is null or not an array
      if (!Array.isArray(response.data.results)) {
        return [];
      }


      let suggestions: SimplifiedAddressSuggestion[] = response.data.results.map((result: any) => ({
        id: result.id,
        type: result.type,
        score: result.score,
        address: {
          municipality: result.address.municipality,
          countrySubdivision: result.address.countrySubdivision,
          countryCode: result.address.countryCode,
          country: result.address.country,
          freeformAddress: result.address.freeformAddress,
          postalCode: result.address.postalCode,
        },
        position: result.position,
        poi: result.poi ? {
          name: result.poi.name,
          phone: result.poi.phone,
          url: result.poi.url,
        } : undefined,
      }));

      // Filter the results to include only those from Australia
      suggestions= suggestions.filter((suggestion: SimplifiedAddressSuggestion) => suggestion.address.countryCode === 'AU');
      suggestions.sort((a, b) => b.score - a.score); // Sort by score in descending order
      suggestions = suggestions.slice(0, 5); 
      return suggestions;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw error;
    }
  }
}

export default QuickRouteAddress;