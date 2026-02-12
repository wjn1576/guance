import React, { useEffect, useRef } from 'react';
import { Icons } from './Icons';
import L from 'leaflet';

export const GlobalNodes: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // 1. Initialize Map
    // Using a center that shows Asia/Europe/US reasonably well
    const map = L.map(mapContainerRef.current, {
      center: [30, 10], 
      zoom: 1.5,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false, // Keep page scroll smooth
      dragging: true,
      doubleClickZoom: false
    });
    mapInstanceRef.current = map;

    // 2. Add Tile Layer
    // Using CartoDB Positron for a clean, light, "tech" aesthetic similar to the screenshot's clean look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    // 3. Define Custom Icons
    // We create a DivIcon that mimics the pulsing blue dot
    const createNodeIcon = () => L.divIcon({
      className: 'custom-pin', // defined in index.html styles
      html: `
        <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 100%; height: 100%; background-color: #3B82F6; border-radius: 50%; opacity: 0.3; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 14px; height: 14px; background-color: #DBEAFE; border-radius: 50%; opacity: 0.8;"></div>
          <div style="position: relative; width: 8px; height: 8px; background-color: #1d4ed8; border-radius: 50%;"></div>
        </div>
        <style>
          @keyframes ping {
            75%, 100% { transform: scale(2); opacity: 0; }
          }
        </style>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    // 4. Data Points
    const nodes = [
      { name: "US West (Silicon Valley)", coords: [37.77, -122.41] },
      { name: "US East (Virginia)", coords: [38.90, -77.03] },
      { name: "South America (São Paulo)", coords: [-23.55, -46.63] },
      { name: "Europe (Frankfurt)", coords: [50.11, 8.68] },
      { name: "Asia (Shanghai)", coords: [31.23, 121.47] },
      { name: "Asia (Singapore)", coords: [1.35, 103.81] },
      { name: "Australia (Sydney)", coords: [-33.86, 151.20] }
    ];

    // 5. Add Markers
    nodes.forEach(node => {
      L.marker(node.coords as L.LatLngExpression, { icon: createNodeIcon() })
        .bindPopup(`
          <div style="font-family: 'Inter', sans-serif; padding: 4px;">
            <div style="font-weight: 700; color: #111827; margin-bottom: 2px;">${node.name}</div>
            <div style="font-size: 12px; color: #6B7280;">Guance Point of Presence</div>
          </div>
        `, { closeButton: false })
        .addTo(map);
    });

    // 6. Draw Connecting Lines (Bezier-like simplified polyline)
    // Connecting major hubs to simulate data flow
    const lineCoords = [
      [37.77, -122.41], // SF
      [38.90, -77.03],  // VA
      [50.11, 8.68],    // Frankfurt
      [31.23, 121.47],  // Shanghai
      [1.35, 103.81],   // Singapore
      [-33.86, 151.20]  // Sydney
    ];
    
    L.polyline(lineCoords as L.LatLngExpression[], {
      color: '#3B82F6',
      weight: 2,
      opacity: 0.5,
      dashArray: '5, 10',
      lineCap: 'round'
    }).addTo(map);

    // 7. Add "Coverage Zones" (Orange Circles)
    const zones = [
        { coords: [35, -100], radius: 2500000 }, // North America
        { coords: [45, 20], radius: 2000000 },  // Europe
        { coords: [30, 115], radius: 3500000 }, // Asia
        { coords: [-25, -60], radius: 2000000 }, // South America
    ];

    zones.forEach(zone => {
        L.circle(zone.coords as L.LatLngExpression, {
            color: 'transparent',
            fillColor: '#FFEDD5', // Orange-100ish
            fillOpacity: 0.4,
            radius: zone.radius
        }).addTo(map);
    });

    // Cleanup
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <section className="bg-white py-24 border-b border-gray-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-16 relative z-10">
          
          {/* Left Text Content - Absolute on desktop to float over map, or flexed */}
          {/* Keeping the layout split but making the map dominant */}
          <div className="lg:w-1/3 z-20 pointer-events-none"> 
            {/* pointer-events-none allows clicking map underneath text area if transparent, 
                but we have text so we need auto on children */}
             <div className="pointer-events-auto bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-sm">
                <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
                观测云拥有安全合规，<br/>遍布全球的节点
                </h2>
                <p className="text-gray-500 text-lg mb-8">
                助力您的全球布局，无论您的业务在何处，我们都能提供稳定、低延迟的数据采集与监控服务。
                </p>

                <div className="flex space-x-12 mb-8">
                    <div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">10 +</div>
                    <div className="text-sm text-gray-500">观测云全球节点</div>
                    </div>
                    <div>
                    <div className="text-4xl font-bold text-gray-900 mb-2">60 +</div>
                    <div className="text-sm text-gray-500">低延迟服务可用国家和地区</div>
                    </div>
                </div>

                <a href="#" className="inline-flex items-center text-guance-orange font-bold hover:underline transition-all group">
                    了解更多观测云全球化 <Icons.ChevronDown className="ml-1 w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </a>
             </div>
          </div>

          {/* Map Container */}
          <div className="absolute top-0 right-0 w-full lg:w-3/4 h-full z-0 opacity-100">
             <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '500px', background: '#F8FAFC' }}></div>
          </div>

        </div>
        
        {/* Spacer to push content down since map is absolute in background of section */}
        <div className="hidden lg:block h-[300px]"></div>
      </div>
    </section>
  );
};