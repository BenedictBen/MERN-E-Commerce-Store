import React from 'react'
import AdminOrder from "@/components/AdminOrder";


const OrderPage = () => {
  return (
    <div className="flex flex-col items-center justify-center  !py-6">
         <div>
           <h3 className="!text-xl font-bold">Orders</h3>
         </div>
   
         <div>
           <AdminOrder />
         </div>
       </div>
  )
}

export default OrderPage