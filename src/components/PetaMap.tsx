"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MAP_CONFIG } from "@/lib/mapConfig";

// ── Lucide SVG paths (inline, no CDN) ─────────────────────────────────────
// BadgeCheck — komitmen
const ICON_CHECK =
  `<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/>` +
  `<path d="m9 12 2 2 4-4"/>`;

// ClipboardList — survei
const ICON_CLIPBOARD =
  `<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>` +
  `<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>` +
  `<path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>`;

// MapPin — belum ikut
const ICON_MAP_PIN =
  `<path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/>` +
  `<circle cx="12" cy="10" r="3"/>`;

function makeLucideMarker(
  svgPaths: string,
  bg: string,
  border: string,
  shadow: string,
  isPending: boolean = false,
  stroke: string = "white"
): L.DivIcon {
  const size = isPending ? 24 : 30;
  const iconSize = isPending ? 12 : 15;

  const html = `
    <div style="
      width:${size}px; height:${size}px;
      background:${bg};
      border-radius:50%;
      border:2px solid ${border};
      box-shadow: 0 0 10px ${shadow}, 0 2px 6px rgba(0,0,0,0.6);
      opacity: ${isPending ? 0.45 : 1};
      display:flex; align-items:center; justify-content:center;
    ">
      <svg width="${iconSize}" height="${iconSize}" viewBox="0 0 24 24"
        fill="none" stroke="${stroke}"
        stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        ${svgPaths}
      </svg>
    </div>`;

  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -16],
  });
}

// ── Icons — vivid on light map ─────────────────────────────────────────────
const iconPrimary = makeLucideMarker(
  ICON_CHECK,
  "#2E7D32", // primary (Green)
  "#FFFFFF", // clean white border
  "#2E7D3260",
);
const iconInfo = makeLucideMarker(
  ICON_CLIPBOARD,
  "#1E88E5", // info (Blue GESAMEGA)
  "#FFFFFF",
  "#1E88E560",
);
const iconNeutral = makeLucideMarker(
  ICON_MAP_PIN,
  "#FFFFFF", // white background
  "#CBD5E1", // light gray border
  "#00000020",
  false,
  "#64748B" // slate-500 stroke for visibility
);

const iconPrimaryPending = makeLucideMarker(
  ICON_CHECK,
  "#2E7D32",
  "#FFFFFF",
  "#2E7D3230",
  true,
);
const iconInfoPending = makeLucideMarker(
  ICON_CLIPBOARD,
  "#1E88E5",
  "#FFFFFF",
  "#1E88E530",
  true,
);
const iconNeutralPending = makeLucideMarker(
  ICON_MAP_PIN,
  "#FFFFFF",
  "#CBD5E1",
  "#00000010",
  true,
  "#64748B"
);


interface School {
  id: string;
  nama_sekolah: string;
  latitude: number;
  longitude: number;
  status: string;
  status_validasi: string;
}

interface Props {
  schoolId?: string;
  schools: School[];
}

function MapController({ schools, targetId }: { schools: School[], targetId?: string }) {
  const map = useMap();
  useEffect(() => {
    if (targetId && schools.length > 0) {
      const target = schools.find(s => s.id === targetId);
      if (target) {
        map.flyTo([target.latitude, target.longitude], 12);
      }
    }
  }, [schools, targetId, map]);
  return null;
}

export default function PetaKomponen({ schoolId, schools }: Props) {

  const getIcon = (status: string, validasi: string) => {
    const isPending = validasi === "pending";
    if (status === "komitmen") return isPending ? iconPrimaryPending : iconPrimary;
    if (status === "survei") return isPending ? iconInfoPending : iconInfo;
    return isPending ? iconNeutralPending : iconNeutral;
  };

  return (
    <div className="w-full h-full relative z-10 rounded-2xl overflow-hidden" style={{ background: "#F5F7FA" }}>
      <MapContainer 
        center={[-7.4478, 112.7183]} 
        zoom={11} 
        scrollWheelZoom={true} 
        className="w-full h-[600px] z-10 peta-styled-map"
        style={{ background: "#F5F7FA" }}
      >
        <TileLayer
          {...MAP_CONFIG.getTileLayerProps()}
        />
        <MapController schools={schools} targetId={schoolId} />
        
        {schools.map((school) => (
          <Marker 
            key={school.id} 
            position={[school.latitude, school.longitude]} 
            icon={getIcon(school.status, school.status_validasi)}
          >
            <Popup className="custom-peta-popup">
              <div className="p-1 font-sans min-w-[190px]">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-bold rounded-full border ${
                    school.status === 'komitmen' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : school.status === 'survei' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      school.status === 'komitmen' 
                        ? 'bg-emerald-600' 
                        : school.status === 'survei' 
                        ? 'bg-blue-600' 
                        : 'bg-slate-400'
                    }`} />
                    {school.status === 'komitmen' ? 'Sudah Komitmen' : school.status === 'survei' ? 'Sudah Survei' : 'Belum Ikut'}
                  </span>
                  {school.status_validasi === 'pending' && (
                    <span className="text-[10px] text-amber-700 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      Pending
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1">
                  {school.nama_sekolah}
                </h3>
                <p className="text-[11px] text-slate-500">
                  Kabupaten Sidoarjo, Jawa Timur
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
