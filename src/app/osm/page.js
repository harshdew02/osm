"use client"

import React, { useState, useMemo, useCallback, useEffect } from "react";
import osm from "./osm-providers";
import { useRef } from "react";
import "leaflet/dist/leaflet.css";
import {
    MapContainer,
    TileLayer,
    useMap,
    Marker,
    Popup,
    useMapEvents,
    CircleMarker,
    Polyline,
    getCenter,
    Circle,
    FeatureGroup
    // Map
} from 'react-leaflet'
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

import L, { icon } from 'leaflet'

import airport from '../../../public/Final_Airports.json';

const redOptions = { color: 'red' }

const polyline = [
    [20.253838, 81.601836],
    [28.6273928, 77.1716954],
    [23.2584857, 77.401989],
    [28.6273928, 79.1716954],
]

const customIcon = new L.Icon({
    iconUrl: '/airport.png',
    iconSize: [38, 38],
});


let count = 0;
let poss = [26.253838, 81.601836];
// import ExternalInfo from "components/ExternalInfo";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
});

const page = () => {

    // const [center, setCenter] = useState({ lat: 24.4539, lng: 54.3773 });
    const ZOOM_LEVEL = 12;
    const mapRef = useRef();

    const _created = (e) => console.log("i am see",e.layer.getLatLngs());

    const [center, setCenter] = useState({ lat: 21.253838, lng: 81.601836 });
    let map = useRef();
    const [air, setAir] = useState(airport);
    const [state, setState] = useState({ latitude: 0, longitude: 0 });

    const handleClick = (e) => {
        // console.log("handle", e)
        const { lat, lng } = e.latlng;
        setState({ latitude: lat, longitude: lng });
        // console.log("Maps: ", air)
    };

    const MapEvents = () => {
        useMapEvents({
            click: handleClick,
        });
        return null;
    };

    useEffect(() => {
        let interval;
        if (count <= 5) {
            interval = setInterval(() => {
                count = count + 1;
                poss[0] = poss[0] + 0.1;
                poss[1] = poss[1] + 0.1;
                getPosition(poss);
                if (count == 5) {
                    clearInterval(interval);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, []);

    let marker, circle;

    function getPosition(poss) {
        // console.log(position)
        var lat = poss[0]
        var long = poss[1]
        var accuracy = 50
        // console.log("Map: ", map.current)
        // if(marker) {
        //     map.current.removeLayer(marker)
        // }
        // if (circle) {
        //     map.current.removeLayer(circle)
        // }
        // marker = L.marker([lat, long])
        circle = L.circle([lat, long], { radius: accuracy }, { pathOptions: redOptions })
        var featureGroup = L.featureGroup([circle]).addTo(map.current)
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', alignItems: 'center', justifyContent: 'center', justifyContent: 'space-between' }} className="col text-center bg-green-500">
            <p style={{ color: 'black', width: '100%', backgroundColor: 'white' }}>
                latitude: {state.latitude}, longitude: {state.longitude}{' '}
            </p>

            <MapContainer center={center} zoom={7} style={{}} scrollWheelZoom={true} ref={map}>

                <FeatureGroup>
                    <EditControl
                        position="topright"
                        onCreated={_created}
                        draw={
                            {
                                 rectangle: false,
                              circle: false,
                              circlemarker: false,
                              marker: false,
                            //   polyline: false,
                            }
                        }
                    />
                </FeatureGroup>

                <TileLayer
                    url={osm.maptiler.url}
                    attribution={osm.maptiler.attribution}
                />

                <MapEvents />
                {/* <LocationMarker /> */}

                <CircleMarker center={[20.253838, 81.601836]} pathOptions={redOptions} radius={20}>
                    <Popup>Popup in CircleMarker</Popup>
                </CircleMarker>

                {/* <Polyline center={poss} pathOptions={redOptions} positions={polyline} /> */}

                {/* {air.map((item, key) => (
                    // console.log(item)
                    <Marker position={[item.latitude, item.longitude]} icon={customIcon}>
                        <Popup>You are herjhjkhjkhkhkhkhke</Popup>
                    </Marker>
                ))} */}

                <Circle
                    center={poss}
                    pathOptions={redOptions}
                    radius={10000}
                />

                <Marker position={poss} icon={customIcon}>
                    <Popup>You are herjhjkhjkhkhkhkhke</Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}

export default page