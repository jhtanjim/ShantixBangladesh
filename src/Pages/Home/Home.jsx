
import Banner from './Banner'
// import SearchFilter from '../Shared/SearchFilter/SearchFilter'

import FixedPriceStock from './FixedPriceStock/FixedPriceStock'

import LowCostStock from './LowCostStock/LowCostStock'

import NewArrival from './NewArrival/NewArrival'
import banner2 from "../../assets/images/Banner2.jpg"
import logoImg from "../../assets/images/logo.png";
import coverImg from "../../assets/images/cover.jpg";

import { IoShieldCheckmarkOutline } from 'react-icons/io5'
// import Button from '../../components/ui/Button'
import Services from './Services'
import Partner from './Partner'
import CarSearchForm from '../Shared/CarSearchform/CarSearchForm'

const Home = () => {
  return (
    <div>
   <Banner/>
   {/* <SearchFilter/> */}
<CarSearchForm/>
<FixedPriceStock/>
<LowCostStock/>
<NewArrival/>



{/* banner */}
<div className="relative w-full min-h-[620px] bg-black overflow-hidden my-40">
<img
    src={banner2}
    alt="Background"
    className="w-full h-[700px]  opacity-30 absolute top-0 left-0"
  />
  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center h-full px-6 md:px-30 py-10">
    {/* Left Side */}
    <div className="flex flex-col md:mt-80 md:flex-row items-center text-white space-y-4 md:space-y-0 md:space-x-4">
      <div className="p-4 rounded-md">
        <IoShieldCheckmarkOutline className="text-white text-8xl md:text-[150px]" />
      </div>
      <div className="text-center md:text-left">
        <p className="text-2xl md:text-4xl font-semibold">Your Trusted Partner</p>
        <h1
          className="text-4xl md:text-7xl font-bold"
          style={{ letterSpacing: "2px" }}
        >
          20 YEARS
        </h1>
      </div>
    </div>

    {/* Right Side */}
    <div className="text-center mt-10 md:mt-0 mb-10 md:mb-30">
      <h1 className="text-3xl md:text-7xl font-bold text-white">
        I Want To Explore
      </h1>
      <h1 className="text-2xl md:text-6xl font-bold text-blue-400 mt-2">
        Trusted Exported
      </h1>
      <img
        src={logoImg}
        alt="Shantix Logo"
        className="w-40 md:w-90 mx-auto mt-4"
      />
    </div>
  </div>
</div>

{/* another content  */}
<div className="container mx-auto my-12 px-4">
  <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
    
    {/* Left Side */}
    <div className="w-full lg:w-[60%] text-center lg:text-left">
      <h1 className="text-4xl md:text-6xl lg:text-7xl">Welcome to</h1>
      <h1 className="text-red uppercase font-extrabold text-5xl md:text-7xl lg:text-8xl my-2">SHANTIX</h1>
      <p className="text-lg md:text-2xl mt-4">
        Lorem ipsum dolor sit amet consectetur. Lectus nibh morbi non proin dui ut. Vel vestibulum dolor sagittis pulvinar felis ac. Ullamcorper non dictum in ullamcorper eros vel viverra. Venenatis magna lacus malesuada proin quam parturient viverra tellus.
      </p>

      <button className="mt-6 bg-dark-blue text-white px-6 py-3 rounded-md hover:bg-red-700 text-xl font-semibold">
        Read More
      </button>
    </div>

    {/* Right Side */}
    <div className="w-full lg:w-[40%] flex justify-center">
      <img src={coverImg} alt="Cover" className="h-[400px] md:h-[500px] lg:h-[570px] w-auto" />
    </div>

  </div>
</div>
{/*  */}
<Services/>
<Partner/>
    </div>
  )
}

export default Home
