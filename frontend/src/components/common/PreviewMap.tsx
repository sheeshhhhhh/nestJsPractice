import { MapContainer, MapContainerProps, Marker, Popup, TileLayer } from "react-leaflet"
import { cn } from "../../lib/utils"
import { LatLngExpression } from "leaflet"


type PreviewMapProps = {
    positionMarker: {
        lat: number, // latitude
        lng: number, // longitude
    },
    zoom?: number,
    MarkerName?: string,
    className?: string
} & MapContainerProps

// this map is created for only viewing or showing to the user
// the map here cannot be edited
const PreviewMap = ({
    positionMarker,
    zoom=18,
    className,
    MarkerName,
    ...props
}: PreviewMapProps) => {
    const location = [
        positionMarker.lat, positionMarker.lng
    ] as LatLngExpression 

    return (
        <MapContainer
        {...props}
        className={cn("h-[100px] w-[250px]", className)}
        center={location} zoom={zoom}
        >
            <TileLayer 
            attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors"'}
            url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            <Marker
            position={positionMarker as LatLngExpression}
            >
                {
                    MarkerName &&
                    <Popup>
                        {MarkerName}
                    </Popup>
                }
            </Marker>
        </MapContainer>
    )
}

export default PreviewMap