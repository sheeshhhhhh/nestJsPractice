import { Link } from "react-router-dom";
import { useOrderContext } from "../../../context/OrderContext"
import { Button } from "../../ui/button";

const Order = () => {
    const { order, loading } = useOrderContext();

    if(loading || !order) return

    return (
        <Link to={'/order/' + order?.id}>
            <Button className="max-w-[230px] w-full">
                View Order
            </Button>
        </Link>
    )
}

export default Order