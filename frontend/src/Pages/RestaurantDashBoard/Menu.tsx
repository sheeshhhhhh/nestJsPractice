import MenusCollection from "../../components/PageComponents/RestaurantDashboard/Menu/MenusCollection";
import MenusHeader from "../../components/PageComponents/RestaurantDashboard/Menu/MenusHeader";

const Menu = () => {

  return (
    <div className='p-3'>
      <h2 className='font-bold text-4xl'>
        Menu
      </h2>
      <p className='text-muted-foreground text-lg mt-2 mb-4'>
        This is all the manus base on categories you can add as many as you want and also delete
        it as many times as you want. you can also make it not availble if it's not
      </p>
      <MenusHeader />
      <MenusCollection />
    </div>
  )
}

export default Menu