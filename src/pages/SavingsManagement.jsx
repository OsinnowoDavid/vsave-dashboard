import React from 'react'
import Header from '../component/NavBar'
import Sidebar from '../component/SideBar'
import { getUserSavings,adminSavingsData  } from '../api/savings'
function SavingsManagement() {
    const adminSavings = async ()=>{
        try {
            const adminData = await adminSavingsData()
            return adminData
        } catch (error) {
            console.log(error)
            
        }
    }

    const userSavings = async ()=>{
        try {
            const userData = await adminSavingsData()
            return userData
        } catch (error) {
            console.log(error)
            
        }
    }
  return (
    <div>
        <Header/>
        <Sidebar/>
    </div>
  )
}

export default SavingsManagement