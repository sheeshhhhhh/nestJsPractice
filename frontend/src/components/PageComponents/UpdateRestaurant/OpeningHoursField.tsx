import { Label } from '../../ui/label'
import { Input } from '../../ui/input'
import { RestaurantOpeningHours } from '../../../types/restaurant.types'
import { Dispatch, SetStateAction } from 'react'

type OpeningHoursFieldProps = {
    openingHours: RestaurantOpeningHours,
    setOpeningHours: Dispatch<SetStateAction<RestaurantOpeningHours>>
}

const OpeningHoursField = ({
    openingHours,
    setOpeningHours
}:  OpeningHoursFieldProps) => {

    return (
        <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
                <Label>Opening Hours</Label>
                <Input 
                value={openingHours?.open}
                onChange={(e) => setOpeningHours(prev => ({...prev, open: e.target.value}))}
                />
            </div>
            <div>
                <Label>Closing Hours</Label>
                <Input 
                value={openingHours?.closed}
                onChange={(e) => setOpeningHours(prev => ({...prev, closed: e.target.value}))}
                />
            </div>
        </div>
    )
}

export default OpeningHoursField