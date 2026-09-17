"use client";
import {useEffect} from "react";
import {MaptilerLayer, MapStyle} from "@maptiler/leaflet-maptilersdk";
import {useMap} from "react-leaflet";

export default function MapTilerLayer() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const mtLayer = new MaptilerLayer({
      apiKey: process.env.NEXT_PUBLIC_MAPTILER_KEY!,
      style: MapStyle.STREETS
    });

    mtLayer.addTo(map);

    return () => {
      map.removeLayer(mtLayer);
    };
  }, [map]);

  return null;
}
