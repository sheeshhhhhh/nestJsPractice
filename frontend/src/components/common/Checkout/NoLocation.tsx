import { ShieldAlert } from 'lucide-react'

const NoLocation = () => {
  return (
    <div className="w-full h-[200px] p-4 flex flex-col items-center">
        <h2 className="text-red-600 font-medium">
            Error please make sure you have configure you location
        </h2>
        {/* provide a link for settings location or address */}
        <div className="p-6">
            <ShieldAlert 
            size={80}
            />
        </div>
    </div>
  )
}

export default NoLocation