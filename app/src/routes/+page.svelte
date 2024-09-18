<script lang='ts'>
  import '@maptiler/sdk/dist/maptiler-sdk.css';
  import { config, Map, type MapOptions, MapStyle } from '@maptiler/sdk';
  import { onMount } from 'svelte';
  import { isDarkMode } from '$lib/darkModeStore.js';
  import planeIcon from '$lib/images/icon-plane-512.png';
  import type { Aircraft } from '$lib/models/aircraft.js';
  import { distance } from '@turf/turf';

  // Configure key, map units, and subscribe to the dark mode style changer.
  export let data;
  config.apiKey = data.apiKey;
  config.unit = 'imperial';

  let map: Map;
  isDarkMode.subscribe(updateMapDarkModeStyle);

  /**
   * Change map styling based on dark mode preferences.
   * @param darkMode
   */
  function updateMapDarkModeStyle(darkMode: boolean) {
    const style = darkMode ? MapStyle.BASIC.DARK : MapStyle.BASIC.LIGHT;
    if (map) map.setStyle(style);
  }

  /**
   * Initalizes the starting map options.
   */
  function initMapOptions() {
    const options: MapOptions = {
      container: document.getElementById("map") as HTMLElement,
      style: document.documentElement.classList.contains('dark') 
        ? MapStyle.BASIC.DARK
        : MapStyle.BASIC.LIGHT,
      center: [-105.021440, 40.032666],
      zoom: 10,
      navigationControl: false,
      scaleControl: 'bottom-left'
    }
    return options;
  }

  /**
   * Loads the airplane icon into the map.
   */
  async function loadAirplaneIcon() {
    const response = await map.loadImage(planeIcon);
    map.addImage('airplane', response.data);
  }

  /**
   * Calculates the viewable area by using turf distance function.
   */
  function calculateMapViewingDistance() {
    const bounds = map.getBounds();
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    return distance([sw.lng, sw.lat], [ne.lng, ne.lat], { units: 'miles'});
  }

  /**
   * Generates the needed query params to request nearby aircraft based on the current state of the map.
   */
  function generateQueryParams() {
    const viewingDistance = calculateMapViewingDistance();
    const center = map.getCenter();
    return new URLSearchParams({
      lat: center.lat.toString(),
      lon: center.lng.toString(),
      dist: viewingDistance.toString()
    }).toString();
  }

  /**
   * Updates the map based on incoming ADSB data.
   */
  async function updateMap() {
    // Make API request to proxy and wait a list of aircraft.
    const apiResponse = await fetch(`/api?${generateQueryParams()}`)
    const data = await apiResponse.json();
    const aircrafts: Aircraft[] = data as Aircraft[];

    // Add each aircraft to the map depending on its most recent data.
    aircrafts.forEach((aircraft) => {
      const sourceId = `${aircraft.id}`
      const sourceData : GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [aircraft.lon, aircraft.lat]
          },
          properties: { rotation: aircraft.heading }
        }]
      }

      // If the source already exists, update it's data. Else add the source.
      if (map.getSource(sourceId)) {
        (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(sourceData);
      } 
      else {
        map.addSource(sourceId, {
          type: 'geojson',
          data: sourceData
        });
      }

      if (!map.getLayer(sourceId)) {
        map.addLayer({
          id: sourceId,
          type: 'symbol',
          source: sourceId,
          layout: {
            'icon-image': 'airplane',
            'icon-rotate': ['get', 'rotation'],
            'icon-allow-overlap': true,
            'icon-size': 0.1
          }
        });
      }
    });
  }

  /**
   * When the map is added to the dom, load in all aircraft data.
  */
  onMount(async () => {
    map = new Map(initMapOptions());
    map.on('load', async function() {
      await loadAirplaneIcon();
      await updateMap();
      setInterval(updateMap, 10000);
    });
  });
</script>

<div class="flex justify-center items-center relative w-full h-full md:py-5 overflow-hidden">
  <div id="map" class="w-full h-full"></div>
</div>
