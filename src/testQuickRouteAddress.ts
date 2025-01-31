import QuickRouteAddress from './QuickRouteAddress';

const apiKey = process.env.API_KEY||'';
const quickRouteAddress = new QuickRouteAddress(apiKey);

// Define a list of partial addresses to test
const testAddresses = [
  'Sydeny',
  '123 George St, Melbourne',
  'Bondi Beach, NSW',
];

// Function to test the getSuggestions method with custom manual inputs
async function testGetSuggestions() {
  for (const address of testAddresses) {
    try {
      console.log(`Getting suggestions for: ${address}`);
      const suggestions = await quickRouteAddress.getSuggestions(address);
      console.log(`Results for ${address}:`, suggestions);
    } catch (error) {
      console.error(`Error getting suggestions for ${address}:`, error);
    }
  }
}

// Run the test function
testGetSuggestions();