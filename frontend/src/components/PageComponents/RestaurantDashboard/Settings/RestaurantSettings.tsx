import { Link } from "react-router-dom"
import ChangePassword from "./ChangePassword"
import ChangeUsername from "./ChangeUsername"
import { Card, CardHeader, CardTitle } from "../../../ui/card"

const RestaurantSettings = () => {
  return (
    <div className="space-y-4">
        <Card className="max-w-[660px]">
          <CardHeader>
            <div className="flex gap-2">
              <CardTitle>
                Update Restauran Info? 
              </CardTitle>
              <Link to={'/updateRestaurant'}>
                  <CardTitle className="text-blue-600 underline-offset-4 hover:underline">
                    Go Here
                  </CardTitle>
              </Link>
            </div>
          </CardHeader>
        </Card>
        <ChangeUsername />
        <ChangePassword />
    </div>
  )
}

export default RestaurantSettings