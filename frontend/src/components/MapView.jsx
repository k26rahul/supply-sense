import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Building2, 
  MapPin, 
  Truck, 
  Navigation, 
  AlertCircle, 
  Radio,
  RotateCcw,
  Layers
} from 'lucide-react';

const BASEMAP_PRESETS = {
  esriLight: {
    name: 'Light Canvas (Clean)',
    base: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    ref: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
    maxZoom: 16,
  },
  osm: {
    name: 'OpenStreetMap',
    base: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
  carto: {
    name: 'CARTO Positron',
    base: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png?api_key=eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfcWY1MjIzb2kiLCJqdGkiOiJlNzk4Mzc5NSIsImV4cCI6MTc5MDI0ODQzOH0.2va2v7WCwgQo0YV7Kf0DKooxYur-N1z8eHjMJ3GU-QM',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19,
  }
};

export default function MapView({
  facilities = [],
  selectedFacilityId,
  onSelectFacility,
  selectedMedicineName = 'Oxytocin Injection',
  activeTransfer = null,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const tileLayersRef = useRef([]);

  const [activeBasemapKey, setActiveBasemapKey] = useState('esriLight');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  // Helper to switch basemap tile layers
  const setBasemap = (key) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove previous tile layers
    tileLayersRef.current.forEach((layer) => map.removeLayer(layer));
    tileLayersRef.current = [];

    const preset = BASEMAP_PRESETS[key] || BASEMAP_PRESETS.esriLight;

    const baseLayer = L.tileLayer(preset.base, {
      maxZoom: preset.maxZoom || 18,
      attribution: preset.attribution,
      subdomains: preset.subdomains || 'abc',
    }).addTo(map);

    tileLayersRef.current.push(baseLayer);

    // If there is an overlay reference layer (for Esri Light labels)
    if (preset.ref) {
      const refLayer = L.tileLayer(preset.ref, {
        maxZoom: preset.maxZoom || 18,
        opacity: 0.85,
      }).addTo(map);
      tileLayersRef.current.push(refLayer);
    }

    setActiveBasemapKey(key);
  };

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered over Udupi City / Taluk
    const map = L.map(mapContainerRef.current, {
      center: [13.3409, 74.7421],
      zoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    // Zoom control at top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Layer groups for dynamic markers and route lines
    const markersLayer = L.layerGroup().addTo(map);
    const routeLayer = L.layerGroup().addTo(map);

    markersLayerRef.current = markersLayer;
    routeLayerRef.current = routeLayer;
    mapInstanceRef.current = map;

    // Mount initial clean Esri Light Canvas basemap (no watermark)
    const initialPreset = BASEMAP_PRESETS.esriLight;
    const baseLayer = L.tileLayer(initialPreset.base, {
      maxZoom: initialPreset.maxZoom,
      attribution: initialPreset.attribution,
    }).addTo(map);
    const refLayer = L.tileLayer(initialPreset.ref, {
      maxZoom: initialPreset.maxZoom,
      opacity: 0.85,
    }).addTo(map);
    tileLayersRef.current = [baseLayer, refLayer];

    // Auto-fit initial bounds of the Udupi cluster
    const udupiBounds = [
      [13.2200, 74.6900], // Southwest (near Kaup / Malpe coast)
      [13.4350, 74.8000], // Northeast (near Brahmavar / Manipal)
    ];
    map.fitBounds(udupiBounds, { padding: [40, 40] });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers and Polyline Route whenever facilities or selection change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const routeLayer = routeLayerRef.current;

    if (!map || !markersLayer || !routeLayer) return;

    markersLayer.clearLayers();
    routeLayer.clearLayers();

    if (!facilities || facilities.length === 0) return;

    const facA = facilities.find((f) => f.id === 'fac-a');
    const facD = facilities.find((f) => f.id === 'fac-d');
    const isFacDEnRoute = facD?.status === 'in_transit' || facD?.incoming_transfer || activeTransfer;

    // 1. Draw Active Redistribution Route (Brahmavar CHC -> Kallianpur -> District Hospital Ajjarkad via NH 66)
    if (isFacDEnRoute && facA && facD) {
      const routeCoordinates = [
        [facA.lat || 13.4241, facA.lng || 74.7502],
        [13.3854, 74.7561],
        [13.3510, 74.7480],
        [facD.lat || 13.3340, facD.lng || 74.7421],
      ];

      L.polyline(routeCoordinates, {
        color: '#0284c7',
        weight: 8,
        opacity: 0.3,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(routeLayer);

      L.polyline(routeCoordinates, {
        color: '#0284c7',
        weight: 3.5,
        opacity: 0.9,
        dashArray: '8, 8',
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(routeLayer);

      const midpointIcon = L.divIcon({
        className: 'custom-route-badge',
        html: `
          <div style="transform: translate(-50%, -50%);" class="bg-slate-900 text-white border border-teal-400/50 shadow-xl px-2.5 py-1 rounded-full flex items-center space-x-1.5 whitespace-nowrap text-[11px] font-bold">
            <span class="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
            <span>NH 66 • 14 km (Dispatched - 24m)</span>
          </div>
        `,
        iconSize: [0, 0],
      });

      L.marker([13.3750, 74.7530], { icon: midpointIcon, interactive: false }).addTo(routeLayer);
    }

    // 2. Render Real Health Facility Markers
    facilities.forEach((fac) => {
      if (!fac.lat || !fac.lng) return;

      const isSelected = selectedFacilityId === fac.id;
      const isCritical = fac.status === 'critical';
      const isEnRoute = fac.status === 'in_transit' || fac.incoming_transfer;
      const isLow = fac.status === 'low';

      let markerBg = 'bg-emerald-500';
      let ringColor = isSelected ? 'ring-4 ring-slate-900 scale-110' : 'ring-2 ring-white hover:scale-105';
      let badgeStyle = 'bg-white/95 text-slate-700 border-slate-200';
      let iconMarkup = `
        <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 18h12"></path>
          <path d="M6 14h12"></path>
          <rect width="16" height="20" x="4" y="2" rx="2"></rect>
          <path d="M12 6v4"></path>
          <path d="M10 8h4"></path>
        </svg>
      `;

      if (isEnRoute) {
        markerBg = 'bg-blue-600 animate-transit-pulse';
        badgeStyle = 'bg-blue-900 text-white font-bold shadow-md';
        iconMarkup = `
          <svg class="w-5 h-5 text-white animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
            <path d="M15 18H9"></path>
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
            <circle cx="17" cy="18" r="2"></circle>
            <circle cx="7" cy="18" r="2"></circle>
          </svg>
        `;
      } else if (isCritical) {
        markerBg = 'bg-red-500 animate-critical-pulse';
        badgeStyle = 'bg-red-50 text-red-700 border-red-300 font-extrabold shadow-sm';
        iconMarkup = `
          <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        `;
      } else if (isLow) {
        markerBg = 'bg-amber-400';
        badgeStyle = 'bg-white/95 text-slate-800 border-amber-300 font-semibold';
      }

      if (isSelected) {
        badgeStyle = 'bg-slate-900 text-white font-bold shadow-md';
      }

      const customIcon = L.divIcon({
        className: 'custom-leaflet-facility-marker',
        html: `
          <div class="relative group flex flex-col items-center cursor-pointer select-none" style="transform: translate(-50%, -50%);">
            <div class="relative w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${markerBg} ${ringColor}">
              ${iconMarkup}
              ${isEnRoute ? `
                <span class="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-600"></span>
                </span>
              ` : ''}
            </div>

            <div class="mt-1 px-2.5 py-0.5 rounded-md text-[11px] shadow-xs whitespace-nowrap transition-all duration-200 border ${badgeStyle}">
              ${fac.name}
            </div>
          </div>
        `,
        iconSize: [0, 0],
      });

      const marker = L.marker([fac.lat, fac.lng], {
        icon: customIcon,
        zIndexOffset: isSelected ? 1000 : isCritical ? 900 : isEnRoute ? 800 : 500,
      }).addTo(markersLayer);

      const tooltipContent = `
        <div class="p-2 min-w-[170px] text-left">
          <div class="flex items-center justify-between gap-2">
            <span class="font-bold text-xs text-slate-900">${fac.name}</span>
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${
              isEnRoute ? 'bg-blue-100 text-blue-800' : isCritical ? 'bg-red-100 text-red-800' : isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }">${fac.status_label || fac.status}</span>
          </div>
          <div class="text-[10px] text-slate-500 mt-0.5">${fac.type} • ${fac.locality || 'Udupi'}</div>
          <div class="mt-2 pt-1.5 border-t border-slate-200 flex justify-between items-center text-[11px]">
            <span class="text-slate-500">Days Stock:</span>
            <span class="font-bold text-slate-900">${fac.days_of_stock}</span>
          </div>
          <div class="flex justify-between items-center text-[11px]">
            <span class="text-slate-500">Current Stock:</span>
            <span class="font-semibold text-slate-800">${fac.current_stock} units</span>
          </div>
          ${isEnRoute ? `
            <div class="mt-1.5 bg-blue-50 border border-blue-200 p-1 rounded text-[10px] text-blue-800 flex items-center space-x-1">
              <span>🚚 +150 units arriving from Brahmavar</span>
            </div>
          ` : ''}
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        direction: 'top',
        offset: [0, -25],
        className: 'leaflet-custom-tooltip shadow-lg rounded-xl border border-slate-200',
      });

      marker.on('click', () => {
        onSelectFacility(fac.id);
      });
    });
  }, [facilities, selectedFacilityId, onSelectFacility, activeTransfer]);

  // Reset map camera to Udupi bounds
  const handleResetCamera = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const udupiBounds = [
      [13.2200, 74.6900],
      [13.4350, 74.8000],
    ];
    map.fitBounds(udupiBounds, { padding: [40, 40] });
  };

  return (
    <div className="relative w-full h-[620px] rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden select-none bg-slate-100">
      {/* Real Interactive Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Map Context Info Card */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/90 shadow-md z-[500]">
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-bold text-slate-900">Udupi Taluk, Karnataka</span>
          <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 font-semibold px-1.5 py-0.5 rounded">
            6 Facilities
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Monitoring: <span className="font-semibold text-slate-800">{selectedMedicineName}</span>
        </p>
      </div>

      {/* Top-Right Action Group: Layer Switcher & Reset Camera */}
      <div className="absolute top-4 right-14 flex items-center space-x-2 z-[500]">
        {/* Layer Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            title="Switch Map Theme"
            className="bg-white/95 hover:bg-slate-100 backdrop-blur-md px-2.5 py-2 rounded-xl border border-slate-200 shadow-md text-slate-700 hover:text-slate-900 flex items-center space-x-1.5 text-xs font-semibold cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span className="hidden sm:inline">{BASEMAP_PRESETS[activeBasemapKey].name}</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-[600]">
              <span className="block px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Map Basemaps
              </span>
              {Object.entries(BASEMAP_PRESETS).map(([k, p]) => (
                <button
                  key={k}
                  onClick={() => {
                    setBasemap(k);
                    setShowLayerMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition cursor-pointer ${
                    activeBasemapKey === k ? 'bg-teal-50 text-teal-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{p.name}</span>
                  {activeBasemapKey === k && <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reset Camera Button */}
        <button
          onClick={handleResetCamera}
          title="Reset camera to Udupi bounds"
          className="bg-white/95 hover:bg-slate-100 backdrop-blur-md p-2 rounded-xl border border-slate-200 shadow-md text-slate-600 hover:text-slate-900 transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Legend in bottom-left */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 shadow-md z-[500] text-xs">
        <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wider block mb-2">
          Stock Threshold Legend
        </span>
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-2xs"></span>
            <span className="text-slate-700 font-medium">Healthy (&gt;14 days stock)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-2xs"></span>
            <span className="text-slate-700 font-medium">Low (7-14 days stock)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-pulse shadow-2xs"></span>
            <span className="text-slate-700 font-medium">Critical (&lt;3 days stock)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block flex items-center justify-center text-[8px] text-white">
              •
            </span>
            <span className="text-slate-700 font-medium">Transfer En Route (Mitigated)</span>
          </div>
        </div>
      </div>

      {/* Interactive Helper Hint in bottom-right */}
      <div className="absolute bottom-4 right-4 bg-slate-900/85 backdrop-blur-md text-white/90 text-[11px] px-3 py-1.5 rounded-lg flex items-center space-x-1.5 pointer-events-none z-[500] shadow-md">
        <Radio className="w-3 h-3 text-teal-400 animate-ping" />
        <span>Click facility pin to inspect telemetry</span>
      </div>
    </div>
  );
}
