import { json } from '@sveltejs/kit';
import type { Aircraft } from '$lib/models/aircraft';

/**
 * Proxy the adsb.lol endpoint so we can map live adsb data into Aircraft objects and pass to the client.
 * @returns 
 */
export async function GET(): Promise<Response>{
    const headers: Headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');

    const request: RequestInfo = new Request('https://api.adsb.lol/v2/lat/39.563401/lon/-104.859232/dist/30', {
        method: 'GET',
        headers: headers
    });

    try {
        const reponse = await fetch(request);
        const data = await reponse.json();
        const aircrafts: Aircraft[] = [];

        for (let i = 0; i < data.ac.length; i++) {
            const entry = data.ac[i];
            const aircraft: Aircraft = {
                id: entry.hex,
                lat: entry.lat,
                lon: entry.lon,
                heading: entry.track
            };
            aircrafts.push(aircraft);
        }
        return json(aircrafts);
    }
    catch(error) {
        return json(null);
    }
}