<script lang='ts'>
    import '@maptiler/sdk/dist/maptiler-sdk.css';
    import { config, Map, type MapOptions, MapStyle } from '@maptiler/sdk';
    import { onMount } from 'svelte';

    export let data;
    config.apiKey = data.apiKey;

    onMount(async () => {
      const options: MapOptions = {
        container: document.getElementById("map") as HTMLElement,
        style: MapStyle.STREETS.DARK,
        center: [16.62662018, 49.2125578],
        zoom: 14,
      }
      const map: Map = new Map(options);
    });
</script>

<div class="map-container">
  <div id="map" class="map"></div>
</div>

<style>
  .map-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border-radius: 25px;
    padding: 100px;
  }

  .map {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
