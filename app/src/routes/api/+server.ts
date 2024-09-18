import { json } from '@sveltejs/kit';
import type { Aircraft } from '$lib/models/aircraft';
import type { RequestEvent } from '../$types';

/**
 * Proxy the adsb.lol endpoint so we can map ADSB data to the Aircraft interface and pass to client.
 * @returns 
 */
export async function GET({ url }: RequestEvent): Promise<Response>{
    const lat = parseFloat(url.searchParams.get('lat') || '0');
    const lon = parseFloat(url.searchParams.get('lon') || '0');
    const dist = parseInt(url.searchParams.get('dist') || '0');

    const headers: Headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    const request: RequestInfo = new Request(`https://api.adsb.lol/v2/lat/${lat}/lon/${lon}/dist/${dist}`, {
        method: 'GET',
        headers: headers
    });

    try {
        const reponse = await fetch(request);
        const data = await reponse.json();
        const aircrafts: Aircraft[] = [];
        for (let i = 0; i < data.ac.length; i++) {
            const entry = data.ac[i];
            if (entry.lat != undefined && entry.lon != undefined && entry.track != undefined) {
                const aircraft: Aircraft = {
                    id: entry.hex,
                    lat: entry.lat,
                    lon: entry.lon,
                    heading: entry.track
                };
                aircrafts.push(aircraft);
            }
        }
        return json(aircrafts);
    }
    catch(error) {
        return json(null);
    }
}