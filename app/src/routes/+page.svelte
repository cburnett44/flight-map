<script lang='ts'>
    import '@maptiler/sdk/dist/maptiler-sdk.css';
    import { config, Map, type MapOptions, MapStyle } from '@maptiler/sdk';
    import { onMount } from 'svelte';
	import { isDarkMode } from '$lib/darkModeStore.js';

    export let data;
    config.apiKey = data.apiKey;

    let map: Map;
    isDarkMode.subscribe(updateMapDarkModeStyle);

    function updateMapDarkModeStyle(darkMode: boolean) {
      const style = darkMode ? MapStyle.BASIC.DARK : MapStyle.BASIC.LIGHT;
      // Ensure the map has been added to the DOM and is defined before trying to set the style.
      if (map) map.setStyle(style);
    }

    onMount(async () => {
      const initialDarkMode = document.documentElement.classList.contains('dark');
      const initStyle = initialDarkMode ? MapStyle.BASIC.DARK : MapStyle.BASIC.LIGHT;
      const options: MapOptions = {
        container: document.getElementById("map") as HTMLElement,
        style: initStyle,
        center: [16.62662018, 49.2125578],
        zoom: 14,
        navigationControl: false,
      }
      map = new Map(options);
    });
</script>

<div class="flex justify-center items-center relative w-full h-full md:py-5 overflow-hidden">
  <div id="map" class="w-full h-full"></div>
</div>
