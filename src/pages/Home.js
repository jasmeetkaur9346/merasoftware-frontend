import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
// import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'
import AppConvertingBanner from '../components/AppConvertingBanner'
import HomeSecondBanner from '../components/HomeSecondBanner'

const Home = () => {
  return (
    <div>

      <AppConvertingBanner/>
      <CategoryList/>
      <BannerProduct serviceName="home"/>

      <HomeSecondBanner/>
      
      {/* <VerticalCardProduct category={"static_websites"} heading={"Static Websites"}/> */}
      <VerticalCardProduct category={"standard_websites"} heading={"Standard Websites"}/>
      <VerticalCardProduct category={"dynamic_websites"} heading={"Dynamic Websites"}/>
      {/* <VerticalCardProduct category={"web_applications"} heading={"Cloud Softwares"}/> */}
    </div>
  )
}

export default Home
