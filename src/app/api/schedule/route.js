import { NextResponse } from 'next/server';

// Array of geo locations
const geos = ["ID", "US", "TW", "CA", "GB", "DE", "AU", "SG"];

// Function to make GET requests
async function makeRequest(geo) {
    const timestamp = Math.floor(Date.now() / 1000);
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/google-trends?geo=${geo}&timestamp=${timestamp}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data for ${geo}: ${response.statusText}`);
        }
        const data = await response.json();
        return { geo, data };
    } catch (error) {
        return { geo, error: error.message };
    }
}

// API handler
export async function GET() {
    const results = [];

    for (const geo of geos) {
        const result = await makeRequest(geo);
        results.push(result);

        // Adding a 1-second delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Return the collected results
    return NextResponse.json(results);
}
