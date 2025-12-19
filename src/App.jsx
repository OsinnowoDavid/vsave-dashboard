import { Router,Route,Routes } from "react-router-dom"
import SideBar from "./component/SideBar"
import NavBar from "./component/NavBar"
import Dashboard from "./pages/dashboard"
import WalletManagement from "./pages/walletManagement"
import Login from "./pages/Login"
import WaitList from "./pages/waitList"
import React from "react"

function App() {

  return (
    <>
    {/* <NavBar/>
<SideBar /> */}
<Routes>

  <Route path="/"  element={<WaitList/>}/>
  <Route path="/login"  element={<Login/>}/>

  <Route path="/manageSavings"  element={<Dashboard/>}/>
  <Route path="/WalletManagement"  element={<WalletManagement/>}/>
</Routes>
    </>
  )
}

export default App
