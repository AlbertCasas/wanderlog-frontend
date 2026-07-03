<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Trip } from "../types";

const props = defineProps<{
  trips: Trip[];
}>();

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;

onMounted(() => {
  if (!mapContainer.value) return;

  setTimeout(() => {
    map = L.map(mapContainer.value!, {
      center: [20, 0],
      zoom: 2,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    const allDestinations = props.trips.flatMap((t) =>
      t.destinations.filter((d) => d.latitude && d.longitude),
    );

    props.trips.forEach((trip) => {
      const coords = trip.destinations
        .filter((d) => d.latitude && d.longitude)
        .map((d) => [d.latitude!, d.longitude!] as [number, number]);

      if (coords.length > 1) {
        L.polyline(coords, {
          color: "#2B6CB0",
          weight: 2.5,
          opacity: 0.7,
          dashArray: "6, 6",
        }).addTo(map!);
      }

      trip.destinations
        .filter((d) => d.latitude && d.longitude)
        .forEach((dest, index) => {
          const marker = L.marker([dest.latitude!, dest.longitude!], {
            icon: L.divIcon({
              className: "",
              html: `<div class="wl-marker-num" style="background:#2B6CB0">${index + 1}</div>`,
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            }),
          });

          marker.bindPopup(`
          <div class="wl-popup">
            <strong>${dest.name}</strong>
            <span>${trip.title}</span>
            <span>${new Date(dest.date_from).toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${new Date(dest.date_to).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
          </div>
        `);

          marker.addTo(map!);
        });
    });

    if (allDestinations.length > 0) {
      const bounds = L.latLngBounds(
        allDestinations.map((d) => [d.latitude!, d.longitude!]),
      );
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 10 });
    }

    map.invalidateSize();
  }, 150);
});

onUnmounted(() => {
  map?.remove();
});
</script>

<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container"></div>
    <p v-if="!trips.some((t) => t.destinations.some(d => d.latitude))" class="map-empty">
      No destinations to show yet — create a trip to see it on the map.
    </p>
  </div>
</template>

<style scoped>
.map-wrapper {
  position: relative;
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-border);
  overflow: hidden;
  height: 380px;
}

.map-container {
  height: 100%;
  width: 100%;
}

.map-empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--color-text-muted);
  background: var(--color-surface);
}
</style>

<style>
.wl-marker {
  font-size: 24px;
  line-height: 1;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.wl-popup {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-family: "Poppins", sans-serif;
  min-width: 160px;
}

.wl-popup strong {
  font-size: 14px;
  color: #2b3a4a;
}

.wl-popup span {
  font-size: 12px;
  color: #6b7785;
}

.leaflet-popup-content-wrapper {
  border-radius: 12px !important;
  border: 2px solid #2b6cb0 !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1) !important;
}

.leaflet-popup-tip {
  background: #2b6cb0 !important;
}

.wl-marker-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #FFFFFF;
  box-shadow: 0 2px 6px rgba(0,0,0,0.25);
  font-family: 'Poppins', sans-serif;
}
</style>
