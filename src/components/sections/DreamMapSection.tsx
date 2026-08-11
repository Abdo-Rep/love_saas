'use client';

import React, { useEffect, useState } from 'react';
import { useConfig } from '@/lib/configContext';
import { MapPin as MapPinIcon, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet to avoid SSR window errors
const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((m) => m.Popup),
  { ssr: false }
);

export const DreamMapSection: React.FC = () => {
  const { config } = useConfig();
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    import('leaflet').then((leaflet) => {
      setL(leaflet);
    });
  }, []);

  const pins = config.mapPins || [];
  const defaultCenter = pins.length > 0 ? pins[0].coordinates : [30.0444, 31.2357];

  return (
    <section className="w-full py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs text-cosmic-gold font-bold px-3 py-1 rounded-full bg-cosmic-rosegold/20 border border-cosmic-rosegold">
            📍 خريطة أحلامنا
          </span>
          <h3 className="text-2xl font-bold text-white">أماكن شهدت على حبنا</h3>
        </div>

        <div className="w-full h-80 rounded-3xl overflow-hidden border-2 border-cosmic-gold/40 shadow-2xl relative">
          {isClient && L ? (
            <MapContainer
              center={defaultCenter}
              zoom={5}
              scrollWheelZoom={false}
              className="w-full h-full z-0"
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              />
              {pins.map((pin) => (
                <Marker
                  key={pin.id}
                  position={pin.coordinates}
                  icon={L.divIcon({
                    className: 'custom-star-pin',
                    html: `<div style="background-color: #FFD700; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #b76e79; box-shadow: 0 0 15px #FFD700;"></div>`,
                    iconSize: [20, 20],
                  })}
                >
                  <Popup>
                    <div className="p-1 text-right space-y-1">
                      <h4 className="text-sm font-bold text-cosmic-gold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> {pin.title}
                      </h4>
                      <p className="text-xs text-white leading-relaxed">{pin.message}</p>
                      {pin.date && (
                        <p className="text-[10px] text-cosmic-rosegold font-semibold">
                          📅 {pin.date}
                        </p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="w-full h-full bg-cosmic-deep flex items-center justify-center text-cosmic-gold text-xs">
              جاري تحميل الخريطة الكونية...
            </div>
          )}
        </div>

        {/* List of pins */}
        <div className="space-y-2">
          {pins.map((pin) => (
            <div
              key={pin.id}
              className="glass-panel rounded-xl p-3 border border-cosmic-rosegold/30 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-cosmic-gold" />
                <span className="font-bold text-white">{pin.title}</span>
              </div>
              <span className="text-cosmic-rosegold font-medium">{pin.date}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
