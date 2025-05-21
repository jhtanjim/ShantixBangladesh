import { Outlet } from "react-router-dom"
import Footer from "../components/Footer/Footer"
import Navbar from "../components/navbar/Navbar"

 


const Main = () => {
  return (
    <div>
<Navbar/>
<Outlet/>
<Footer/>
    </div>
  )
}

export default Main
