import { Card, CardContent, CardTitle } from '../../ui/card'
import { BriefcaseIcon, Laptop2Icon } from 'lucide-react'
import { Button } from '../../ui/button'
import { Dispatch, SetStateAction } from 'react'

type role = 'Customer' | 'Business' | undefined

type PickARoleProps = {
    setStage: Dispatch<SetStateAction<number>>,
    role: role,
    setRole: Dispatch<SetStateAction<role>>
}

const PickARole = ({
    setStage,
    role, 
    setRole
}: PickARoleProps) => {

    return (
        <div>
            <CardTitle className="text-center mb-6">
                Join as a Customer or Business
            </CardTitle>

            <div className="flex gap-5" >
                <label
                onClick={() => setRole('Business')}
                >
                    <Card className={`hover:border-green-600 ${role === 'Business' && 'border-green-600'}`}>
                        <CardContent className="pt-6 relative w-[230px]">
                            <div 
                            className={`size-[24px] absolute top-3 right-4 rounded-full
                            flex justify-center items-center ${role === 'Business' ? "bg-green-700" : 
                            'border-2 border-muted-foreground'}`} 
                            >
                                <div className={`size-[13px] rounded-full ${role === 'Business' && 'border'}`} />
                            </div>
                            <BriefcaseIcon />
                            <CardTitle className="mt-3 text-lg select-none">
                                Im a restaurant owner wanting to open 
                                here
                            </CardTitle>
                        </CardContent>
                    </Card>
                    <input
                    hidden 
                    id="Business" 
                    name="role" 
                    type="radio" 
                    />
                </label>
                <label
                onClick={() => setRole('Customer')}
                >
                    <Card className={`hover:border-green-600 ${role === 'Customer' && 'border-green-600'}`}>
                        <CardContent className="pt-6 relative w-[230px]">
                            <div 
                            className={`size-[24px] absolute top-3 right-4 rounded-full
                            flex justify-center items-center ${role === 'Customer' ? "bg-green-700" : 
                            'border-2 border-muted-foreground'}`} 
                            >
                                <div className={`size-[13px] rounded-full ${role === 'Customer' && 'border'}`} />
                            </div>
                            <Laptop2Icon />
                            <CardTitle className="mt-3 text-lg select-none">
                                Im a customer wanting to browse 
                                restaurants
                            </CardTitle>
                        </CardContent>
                    </Card>
                    <input
                    hidden 
                    id="Customer" 
                    name="role" 
                    type="radio" 
                    />
                </label>
            </div>

            <div className="flex w-full justify-center items-center mt-6">
                <Button
                onClick={() => setStage(1)}
                disabled={!role}
                variant={'outline'}
                >
                    {role === 'Business' && 'Apply as a restaurant'}
                    {role === 'Customer' && 'Join as a Customer'}
                    {!role && 'Create Account'}
                </Button>
            </div>

        </div>
    )
}

export default PickARole