import CategoriesCollection from "../../components/PageComponents/RestaurantDashboard/Category/CategoriesCollection"
import CategoryHeader from "../../components/PageComponents/RestaurantDashboard/Category/CategoryHeader"


const Category = () => {


  return (
    <div className="p-3">
      <h2 className="font-bold text-4xl">
        Categories
      </h2>
      <p className="text-muted-foreground text-lg mt-2 mb-4">
        this is all the categories the user can choose from and where you can add all your 
        menu items. this is a good way to organize your food and satisfy the customers!
      </p>
      <CategoryHeader  />
      <CategoriesCollection />
    </div>
  )
}

export default Category