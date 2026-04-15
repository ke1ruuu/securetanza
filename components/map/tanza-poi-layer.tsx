"use client";

import React from "react";
import { CircleMarker, Tooltip, Pane } from "react-leaflet";
import { POLICE_STATION_COORD } from "../../constants/map-constants";

export const TanzaPoliceStation: React.FC = () => {
  return (
    <Pane name="poi-pane" style={{ zIndex: 600 }}>
      {/* Outer Glow / Pulse Effect */}
      <CircleMarker
        center={POLICE_STATION_COORD}
        pathOptions={{
          fillColor: "#ef4444",
          fillOpacity: 0.3,
          color: "#ef4444",
          weight: 0,
          className: "animate-pulse"
        }}
        radius={15}
      />
      
      {/* Core Marker */}
      <CircleMarker
        center={POLICE_STATION_COORD}
        pathOptions={{
          fillColor: "#ef4444",
          fillOpacity: 1,
          color: "#ffffff",
          weight: 2,
        }}
        radius={6}
      >
        <Tooltip direction="top" offset={[0, -5]} opacity={1} permanent={false} className="custom-tooltip">
          <div className="px-1 py-0.5">
             <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Authority</p>
             <p className="text-sm font-bold text-slate-800">Tanza Municipal Police Station</p>
          </div>
        </Tooltip>
      </CircleMarker>
    </Pane>
  );
};

export default TanzaPoliceStation;
