import React from 'react'
import FlashDeals from './FlashDeals'
import ShoppingToday from './ShoppingToday'
import OtherProductList from './OtherProductList'
import FeaturedProducts from './FeaturedProducts'
import ServicesTwo from './ServicesTwo'

const HomeProducts = () => {
  return (
    <div>
        <FlashDeals/>
        <ShoppingToday/>
        <OtherProductList/>
        <FeaturedProducts/>
        <hr className="my-6"/>
        <ServicesTwo/>
        <hr className="my-6"/>
    </div>
  )
}

export default HomeProducts