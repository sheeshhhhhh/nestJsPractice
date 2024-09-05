import Search from "./MenuHeader/Search"
import AddMenu from "./MenuHeader/AddMenu"


const MenusHeader = () => {

    return (
        <div className="w-full">
            <div className="flex justify-between">
                <Search />
                <AddMenu />
            </div>
        </div>
    )
}

export default MenusHeader