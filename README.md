# QuickRouteAddress Project

This project provides a TypeScript-based utility for fetching address suggestions using the TomTom API. It includes a QuickRouteAddress class that interacts with the TomTom Search API to retrieve and filter address suggestions for Australian addresses.

## Features
* Fetch Address Suggestions: Retrieve address suggestions from the TomTom API based on a partial address input.

* Filter by Country: Results are filtered to include only Australian addresses (countryCode: 'AU').

* Sort and Limit Results: Suggestions are sorted by score in descending order and limited to the top 5 results.

* Error Handling: Gracefully handles API errors and unexpected data structures.

## Prerequisites
* Node.js (v16 or higher)

* npm

* Valid TomTom API key

## Setup and Installation

1. Clone the Repository: 
* git clone <repository-url>
* cd HIL

2. Install Dependencies:
* npm install

3. Set Up Environment Variables:
* Create a .env file in the root directory
* Add your TomTom API key:
API_KEY=Oyb0npJAVdRwDauqpFez7zKCy2euUYql

4. Build the Project:
* npm run build

## Usage

* Fetch Address Suggestions
Run the Script: npx ts-node src/testQuickRouteAddress.ts

* You can manually add or remove the incomplete addresses to the to **testAddresses** list in the **testQuickRouteAddress.ts** file to fetch the suggestions

## Running Tests
* Execute the test suite using Jest:
npm test