import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import DashMobile from "./../../Assets/image-hero-mobile.png";
import DashDesktop from "./../../Assets/image-hero-desktop.png";

const HomePage = () => {
    return (
        <div className=' font-epilogue bg-[hsl(0,0%,98%)]'>
      <div className=' flex flex-col'>
        <Navbar/>
        <img src={DashMobile} alt="image-hero-mobile" className=' lg:hidden' />
        <div className=' lg:flex lg:mx-44 lg:gap-4 lg:mt-10'>
          <img src={DashDesktop} alt="image-hero-desktop" className='hidden lg:flex lg:order-2 lg:w-full lg:h-full overflow-auto' />
          <div className='px-5 mt-8 mb-48 lg:pt-20 lg:pr-32'>
            <div className=" flex flex-col items-center lg:items-start">
                <h1 className=" text-4xl font-bold text-[hsl(0,0%,8%)] lg:text-7xl">Connecting Talent with ProctorX</h1>
                <p className=" text-center lg:text-start lg:pr-11 lg:my-10 text-base lg:text-lg my-6 text-[hsl(0,0%,41%)] font-medium">
                Explore opportunities from across the globe to learn, connect and grow. Secure and smooth tests like none other.
                </p>
                <div className=" text-white bg-[hsl(0,0%,8%)] hover:bg-transparent hover:border hover:text-[hsl(0,0%,8%)] hover:border-[hsl(0,0%,8%)] py-3 px-6 rounded-xl">
                    <div className="text-base font-medium">Learn more</div>
                </div>
            </div>
            <div className=' flex flex-row justify-between mt-14 lg:mt-28 items-center'>
                <img src='' alt="client-databiz" className=' h-4'/>
                <img src='' alt="client-audiophile" className='h-8'/>
                <img src='' alt="client-meet" className='h-4'/>
                <img src='' alt="client-maker" className='h-5'/>
            </div>
        </div>
        </div>
        <Footer/>
      </div>
    </div>
    )
}

export default HomePage