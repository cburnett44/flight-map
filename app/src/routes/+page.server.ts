import { mapsKey } from '$env/static/private';

/**
 * Load map key from environment variables and pass to client. The api key will always be exposed since its on the client,
 * and can only be protected by managing the api keys origins.
 */
export async function load() {
    return {
        apiKey: mapsKey
    };
}