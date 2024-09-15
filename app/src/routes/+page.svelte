<script lang='ts'>
    import '@maptiler/sdk/dist/maptiler-sdk.css';
    import { config, Map, type MapOptions, MapStyle } from '@maptiler/sdk';
    import { onMount } from 'svelte';

    export let data;
    config.apiKey = data.apiKey;

    onMount(async () => {
      const options: MapOptions = {
        container: document.getElementById("map") as HTMLElement,
        style: MapStyle.BASIC.DARK,
        center: [16.62662018, 49.2125578],
        zoom: 14,
      }
      const map: Map = new Map(options);
    });
</script>

<div class="flex justify-center items-center relative w-full h-full md:py-5 overflow-hidden">
  <div id="map" class="w-full h-full"></div>
</div>
