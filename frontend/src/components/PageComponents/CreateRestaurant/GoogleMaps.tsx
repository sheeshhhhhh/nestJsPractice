
import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { Dispatch, SetStateAction, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import { RestaurantLocation } from '../../../types/restaurant.types';
import { cn } from '@/lib/utils';

// this is the default
const center = [14.5995, 120.9842]  

type GoogleMapsProps = {
    latlng: Partial<RestaurantLocation>,
    setLatLng?: Dispatch<SetStateAction<Partial<RestaurantLocation>>>,
    RestaurantName: string, // this could just be use aas a name
    className?: string
}

// this is not google maps
const GoogleMaps = ({
    RestaurantName,
    latlng,
    setLatLng,
    className
}: GoogleMapsProps) => {
    const [marker, setMarker] = useState({
        lat: latlng.latitude || 0,
        lng: latlng.longitude || 0
    })
    const latlngExist = latlng.latitude && latlng.longitude 
    const mapCenter = latlngExist ? 
    [latlng.latitude, latlng.longitude] as LatLngExpression // if defined then set
    : center as LatLngExpression // if not then set center default
    
    const MapClickHandler = () => {
        // for handling the marker
        if(setLatLng) {
            useMapEvent('click', (e) => {
                setMarker({
                    lat: e.latlng.lat,
                    lng: e.latlng.lng
                })
                setLatLng({
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng 
                })
            })
        }

        return null
    }

    return (
        <div>
            <MapContainer 
            className={cn('h-[350px]', className)}
            center={mapCenter} zoom={latlngExist ? 18 : 5} >
                <TileLayer
                attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors"'}
                url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <MapClickHandler />
                <Marker 
                position={marker}>
                    <Popup>
                        {RestaurantName}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}

export default GoogleMaps