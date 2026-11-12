import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Negocio, AtrativoEvento, Coordinates } from '../types/index.ts';

interface InteractiveMapProps {
  negocios: Negocio[];
  atrativos: AtrativoEvento[];
  userLocation: Coordinates;
  userAddressLabel?: string;
  radiusKm?: number;
  selectedItemId?: string | null;
  onSelectItem?: (type: 'negocio' | 'atrativo', id: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  negocios,
  atrativos,
  userLocation,
  radiusKm = 0,
  selectedItemId,
  onSelectItem,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const circleLayerRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map centered at Canoinhas
      const map = L.map(mapContainerRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 12,
        scrollWheelZoom: false,
      });

      // Warm, high quality terrain/road tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center, user beacon, radius and markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // User Location Marker
    const userPinHtml = `
      <div style="background-color: #2563EB; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.35);"></div>
    `;
    const userIcon = L.divIcon({
      html: userPinHtml,
      className: 'user-pin-marker',
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
    userMarker.bindPopup(`
      <div style="font-family: inherit; font-size: 13px; font-weight: 600; padding: 2px;">
        Sua Localização de Referência
        <div style="font-size: 11px; font-weight: 400; color: #64748B;">Canoinhas, Planalto Norte SC</div>
      </div>
    `);
    markersLayer.addLayer(userMarker);

    // Draw radius circle if specified
    if (circleLayerRef.current) {
      circleLayerRef.current.remove();
      circleLayerRef.current = null;
    }

    if (radiusKm > 0) {
      circleLayerRef.current = L.circle([userLocation.lat, userLocation.lng], {
        radius: radiusKm * 1000,
        color: '#2D6A4F',
        fillColor: '#52B788',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(map);
    }

    // Add Negocios Pins
    negocios.forEach((n) => {
      let bgColor = '#2D6A4F'; // green for pousadas & fazendas
      if (n.categoria === 'restaurante') bgColor = '#BC6C25'; // warm ochre for restaurants
      if (n.categoria === 'propriedade_rural') bgColor = '#40916C';

      const isSelected = selectedItemId === n.id;
      const size = isSelected ? 34 : 28;
      const border = isSelected ? '3px solid #FCD34D' : '2px solid white';

      const pinHtml = `
        <div style="background-color: ${bgColor}; width: ${size}px; height: ${size}px; border-radius: 50%; border: ${border}; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 12px; cursor: pointer;">
          ${n.categoria === 'pousada' ? '🏡' : n.categoria === 'restaurante' ? '🍲' : '🌾'}
        </div>
      `;

      const icon = L.divIcon({
        html: pinHtml,
        className: 'custom-map-pin',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([n.lat, n.lng], { icon });

      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 230px;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 2px; color: #1B4332;">${n.nome}</div>
          <div style="font-size: 12px; color: #854D0E; font-weight: 600; margin-bottom: 4px;">${n.categoriaLabel}</div>
          <div style="font-size: 12px; color: #475569; margin-bottom: 6px; line-height: 1.4;">${n.descricao}</div>
          <div style="font-size: 11px; color: #1E293B; display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span>★ <strong>${n.nota.toFixed(1)}</strong> (${n.num_avaliacoes})</span>
            <span>·</span>
            <span>${n.distanciaKm !== undefined ? `${n.distanciaKm} km de você` : ''}</span>
          </div>
          <button id="btn-pin-${n.id}" style="width: 100%; background-color: #2D6A4F; color: white; border: none; border-radius: 6px; padding: 6px 10px; font-size: 12px; font-weight: 600; cursor: pointer;">
            Ver Detalhes & Reservar
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-pin-${n.id}`);
        if (btn && onSelectItem) {
          btn.onclick = () => onSelectItem('negocio', n.id);
        }
      });

      markersLayer.addLayer(marker);
    });

    // Add Atrativos Pins
    atrativos.forEach((a) => {
      const isSelected = selectedItemId === a.id;
      const size = isSelected ? 32 : 26;
      const border = isSelected ? '3px solid #FCD34D' : '2px solid white';
      const bgColor = a.categoria === 'natureza' ? '#0077B6' : '#7209B7';

      const pinHtml = `
        <div style="background-color: ${bgColor}; width: ${size}px; height: ${size}px; border-radius: 50%; border: ${border}; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 12px; cursor: pointer;">
          ${a.tipo === 'evento' ? '🎉' : '🌲'}
        </div>
      `;

      const icon = L.divIcon({
        html: pinHtml,
        className: 'custom-map-pin',
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker([a.lat, a.lng], { icon });

      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 220px;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 2px; color: #0F172A;">${a.titulo}</div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">${a.categoriaLabel} · ${a.local}</div>
          <div style="font-size: 11px; color: #334155; margin-bottom: 6px;">${a.distanciaKm !== undefined ? `A ${a.distanciaKm} km de você` : ''}</div>
          <button id="btn-atr-${a.id}" style="width: 100%; background-color: #1E293B; color: white; border: none; border-radius: 6px; padding: 6px 10px; font-size: 12px; font-weight: 600; cursor: pointer;">
            Ver Informações
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-atr-${a.id}`);
        if (btn && onSelectItem) {
          btn.onclick = () => onSelectItem('atrativo', a.id);
        }
      });

      markersLayer.addLayer(marker);
    });

    // If selected item exists, pan to it
    if (selectedItemId) {
      const foundN = negocios.find((n) => n.id === selectedItemId);
      if (foundN) {
        map.setView([foundN.lat, foundN.lng], 14, { animate: true });
      } else {
        const foundA = atrativos.find((a) => a.id === selectedItemId);
        if (foundA) {
          map.setView([foundA.lat, foundA.lng], 14, { animate: true });
        }
      }
    }
  }, [negocios, atrativos, userLocation, radiusKm, selectedItemId, onSelectItem]);

  return (
    <div className="relative w-full h-[460px] md:h-[540px] rounded-2xl overflow-hidden border border-[#E5E1D8] shadow-sm bg-[#EFECE6]">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-sm border border-[#E5E1D8] rounded-xl px-3 py-2 text-xs text-[#2C3E35] shadow-md flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-[#2D6A4F] inline-block"></span>
          <span>Pousadas & Fazendas</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-[#BC6C25] inline-block"></span>
          <span>Restaurantes & Cafés</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-[#0077B6] inline-block"></span>
          <span>Cachoeiras & Trilhas</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-[#7209B7] inline-block"></span>
          <span>Eventos & História</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded-full bg-[#2563EB] inline-block"></span>
          <span>Sua Posição</span>
        </div>
      </div>
    </div>
  );
};
