import Search from "../components/PageComponents/Home/Search"
import Collection from "../components/PageComponents/Home/Collection"

// this should automatically display all the restaurant available
const Home = () => {

  return(
    <div className="p-4 w-[1200px] mx-auto">
      <header className="mb-5 flex justify-center">
        <Search />
      </header>
      <main className="p-4 min-h-[759px]">
        <Collection />
      </main>
    </div>
  )

}

export default Home