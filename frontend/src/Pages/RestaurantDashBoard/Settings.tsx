import RestaurantSettings from "../../components/PageComponents/RestaurantDashboard/Settings/RestaurantSettings"


const Settings = () => {
  return (
    <div className='p-3'>
      <h2 className='font-bold text-4xl'>
        Settings
      </h2>
      <p className="text-muted-foreground text-lg mt-2 mb-4">
        This is your settings and also where you update your data's
      </p>
      <RestaurantSettings />
    </div>
  )
}

export default Settings