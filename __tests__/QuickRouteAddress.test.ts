import QuickRouteAddress from '../src/QuickRouteAddress';
import axios from 'axios';
import { SimplifiedAddressSuggestion } from '../src/types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockResponse = {
  data: {
    results: [
      {
        id: '1',
        type: 'Point Address',
        score: 9.8,
        address: {
          municipality: 'Sydney',
          countrySubdivision: 'NSW',
          countryCode: 'AU',
          country: 'Australia',
          freeformAddress: '1 Sydney St, Sydney, NSW, Australia',
          postalCode: '2000',
        },
        position: { lat: -33.865, lon: 151.209 },
        poi: {
          name: 'Sydney Opera House',
          phone: '+61 2 9250 7111',
          url: 'https://www.sydneyoperahouse.com',
        },
      },
      {
        id: '2',
        type: 'Street',
        score: 8.5,
        address: {
          municipality: 'Sydney',
          countrySubdivision: 'NSW',
          countryCode: 'AU',
          country: 'Australia',
          freeformAddress: 'Sydney Rd, Sydney, NSW, Australia',
          postalCode: '2000',
        },
        position: { lat: -33.868, lon: 151.207 },
        poi: null,
      },
    ],
  },
};

const expectedSuggestions: SimplifiedAddressSuggestion[] = [
  {
    id: '1',
    type: 'Point Address',
    score: 9.8,
    address: {
      municipality: 'Sydney',
      countrySubdivision: 'NSW',
      countryCode: 'AU',
      country: 'Australia',
      freeformAddress: '1 Sydney St, Sydney, NSW, Australia',
      postalCode: '2000',
    },
    position: { lat: -33.865, lon: 151.209 },
    poi: {
      name: 'Sydney Opera House',
      phone: '+61 2 9250 7111',
      url: 'https://www.sydneyoperahouse.com',
    },
  },
  {
    id: '2',
    type: 'Street',
    score: 8.5,
    address: {
      municipality: 'Sydney',
      countrySubdivision: 'NSW',
      countryCode: 'AU',
      country: 'Australia',
      freeformAddress: 'Sydney Rd, Sydney, NSW, Australia',
      postalCode: '2000',
    },
    position: { lat: -33.868, lon: 151.207 },
    poi: undefined,
  },
];

describe('QuickRouteAddress', () => {
  const apiKey = 'test_api_key';
  let quickRouteAddress: QuickRouteAddress;

  beforeEach(() => {
    quickRouteAddress = new QuickRouteAddress(apiKey);
    mockedAxios.get.mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch address suggestions', async () => {
    const partialAddress = 'sydney';
    const suggestions = await quickRouteAddress.getSuggestions(partialAddress);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining(`${encodeURIComponent(partialAddress)}.json`),
      expect.objectContaining({
        params: {
          key: apiKey,
          countrySet: 'AU',
        },
      })
    );
    expect(suggestions).toEqual(expectedSuggestions);
  });

  it('should handle errors when fetching address suggestions', async () => {
    const errorMessage = 'Network Error';
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    const partialAddress = 'sydney';
    await expect(quickRouteAddress.getSuggestions(partialAddress)).rejects.toThrow(errorMessage);
  });

  it('should return an empty array if no suggestions are found', async () => {
    mockedAxios.get.mockResolvedValue({ data: { results: [] } });
    const partialAddress = 'nonexistentlocation';
    const suggestions = await quickRouteAddress.getSuggestions(partialAddress);

    expect(suggestions).toEqual([]);
  });

  it('should only return suggestions for the specified country', async () => {
    const partialAddress = 'sydney';
    const suggestions = await quickRouteAddress.getSuggestions(partialAddress);

    suggestions.forEach((suggestion) => {
      expect(suggestion.address.countryCode).toBe('AU');
    });
  });

  it('should handle unexpected data structures gracefully', async () => {
    mockedAxios.get.mockResolvedValue({ data: { results: null } });
    const partialAddress = 'sydney';
    const suggestions = await quickRouteAddress.getSuggestions(partialAddress);

    expect(suggestions).toEqual([]);
  });

  it('should handle empty address fields gracefully', async () => {
    const mockResponseWithEmptyFields = {
      data: {
        results: [
          {
            id: '3',
            type: 'Point Address',
            score: 9.8,
            address: {
              municipality: '',
              countrySubdivision: '',
              countryCode: 'AU',
              country: 'Australia',
              freeformAddress: '',
              postalCode: '',
            },
            position: null,
            poi: null,
          },
        ],
      },
    };
    mockedAxios.get.mockResolvedValue(mockResponseWithEmptyFields);

    const partialAddress = 'sydney';
    const suggestions = await quickRouteAddress.getSuggestions(partialAddress);

    expect(suggestions).toEqual([
      {
        id: '3',
        type: 'Point Address',
        score: 9.8,
        address: {
          municipality: '',
          countrySubdivision: '',
          countryCode: 'AU',
          country: 'Australia',
          freeformAddress: '',
          postalCode: '',
        },
        position: null,
        poi: undefined,
      },
    ]);
  });

  it('should sort suggestions by score in descending order', async () => {
    const partialAddress = 'sydney';
    const suggestions = await quickRouteAddress.getSuggestions(partialAddress);

    expect(suggestions[0].score).toBeGreaterThanOrEqual(suggestions[1].score);
  });

  it('should limit suggestions to a maximum of 5 results', async () => {
    const mockResponseWithManyResults = {
      data: {
        results: Array.from({ length: 10 }, (_, i) => ({
          id: `${i + 1}`,
          type: 'Point Address',
          score: 9.8 - i * 0.1,
          address: {
            municipality: 'Sydney',
            countrySubdivision: 'NSW',
            countryCode: 'AU',
            country: 'Australia',
            freeformAddress: `${i + 1} Sydney St, Sydney, NSW, Australia`,
            postalCode: '2000',
          },
          position: { lat: -33.865, lon: 151.209 },
          poi: null,
        })),
      },
    };
    mockedAxios.get.mockResolvedValue(mockResponseWithManyResults);

    const partialAddress = 'sydney';
    const suggestions = await quickRouteAddress.getSuggestions(partialAddress);

    expect(suggestions.length).toBe(5);
  });
});