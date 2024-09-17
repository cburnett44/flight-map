<script lang='ts'>
    import '@maptiler/sdk/dist/maptiler-sdk.css';
    import { config, Map, type MapOptions, MapStyle } from '@maptiler/sdk';
    import { onMount } from 'svelte';
	  import { isDarkMode } from '$lib/darkModeStore.js';
    import planeIcon from '$lib/images/icon-plane-512.png';
	  import type { Aircraft } from '$lib/models/aircraft.js';

    // Configure key and units.
    export let data;
    config.apiKey = data.apiKey;
    config.unit = 'imperial';

    // Subscribe to the dark mode store.
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

    onMount(async () => {
      const initialDarkMode = document.documentElement.classList.contains('dark');
      const initStyle = initialDarkMode ? MapStyle.BASIC.DARK : MapStyle.BASIC.LIGHT;
      const options: MapOptions = {
        container: document.getElementById("map") as HTMLElement,
        style: initStyle,
        center: [-105.021440, 40.032666],
        zoom: 10,
        navigationControl: false,
        scaleControl: 'bottom-left'
      }
      map = new Map(options);

      map.on('load', async function() {
        const response = await map.loadImage(planeIcon);
        map.addImage('airplane', response.data);

        async function updateMap() {
          const apiResponse = await fetch('/api');
          const data = await apiResponse.json();
          const aircrafts: Aircraft[] = data as Aircraft[];
          aircrafts.forEach((aircraft) => {
            // if the source was already added, change its data.
            if (map.getSource(`${aircraft.id}`)) {
              (map.getSource(`${aircraft.id}`) as maplibregl.GeoJSONSource).setData({
                'type': 'FeatureCollection',
                'features': [
                  {
                    'type': 'Feature',
                    'geometry': {
                      'type': 'Point',
                      'coordinates': [aircraft.lon, aircraft.lat]
                    },
                    'properties': {
                      'rotation': aircraft.heading
                    }
                  }
                ]
              });
            }
            // if the source is new, add source to the map.
            else {
              map.addSource(`${aircraft.id}`, {
                'type': 'geojson',
                'data': {
                  'type': 'FeatureCollection',
                  'features': [
                    {
                      'type': 'Feature',
                      'geometry': {
                        'type': 'Point',
                        'coordinates': [aircraft.lon, aircraft.lat]
                      },
                      'properties': {
                        'rotation': aircraft.heading
                      }
                    }
                  ]
                }
              });
            }

            // Add the layer to the map
            map.addLayer({
              'id': `${aircraft.id}`,
              'type': 'symbol',
              'source': `${aircraft.id}`,
              'layout': {
                'icon-image': 'airplane',
                'icon-rotate': ['get', 'rotation'],
                'icon-allow-overlap': true,
                'icon-size': 0.1
              }
            });
          });
        }

        await updateMap();
        setInterval(updateMap, 1000);

      });
    });
</script>

<div class="flex justify-center items-center relative w-full h-full md:py-5 overflow-hidden">
  <div id="map" class="w-full h-full"></div>
</div>
