import { LatLngExpression } from "leaflet";
import { Marker, MapContainer, MapContainerProps, TileLayer, Popup } from "react-leaflet";
import L from 'leaflet'
import { cn } from "../../lib/utils";

export type markerPosition = {
    id: string,
    name?: string,
    role: 'Customer' | 'Rider'
    lat: number,
    lng: number
}

interface OrderMapProps extends MapContainerProps {
    positionMarker: markerPosition[];
    className?: string;
}

const OrderMapRider = ({
    positionMarker,
    className,
    ...props
}: OrderMapProps) => {

    // https://myprojects.geoapify.com/api/8dp1zvJtkuyWiJaPwqED/keys
    const truckgeoapiPy = `https://api.geoapify.com/v1/icon/?type=material&color=%23000000&icon=truck&iconType=awesome&apiKey=${import.meta.env.VITE_GEOAPIFY_MARKERICON_APIKEY}`
    const persongeoapify = `https://api.geoapify.com/v1/icon/?type=material&color=%23000000&icon=user&iconType=awesome&apiKey=${import.meta.env.VITE_GEOAPIFY_MARKERICON_APIKEY}`

    // find a way to define center and also zoom values between distance between the two
    return (
        <MapContainer
        className={cn('h-[100px] w-[250px]', className)}
        {...props}
        >
            <TileLayer 
            attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors"'}
            url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {positionMarker?.map((marker) => {
                const latLngMarker = [marker.lat,marker.lng ] as LatLngExpression
                const geoapifyIcon = marker.role === 'Rider' ? truckgeoapiPy : persongeoapify
                const markerCustomIcon = L.icon({
                    iconUrl: geoapifyIcon,
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40]
                })
                
                return (
                    <Marker 
                    key={marker.id} 
                    position={latLngMarker}
                    icon={markerCustomIcon}
                    >
                        {
                            marker.name &&
                            <Popup>
                                {marker.name}
                            </Popup>
                        }        
                    </Marker>
                )
            })}
        </MapContainer>
    )
}

export default OrderMapRider