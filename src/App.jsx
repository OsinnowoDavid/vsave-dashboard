import { Router,Route,Routes } from "react-router-dom"
import SideBar from "./component/SideBar"
import NavBar from "./component/NavBar"
import Dashboard from "./pages/dashboard"
import WalletManagement from "./pages/walletManagement"
import Login from "./pages/Login"
import WaitList from "./pages/waitList"
import AdminProfile from "./pages/createAdmin"
import CreateSavingsPage from "./pages/CreateSavings"
import AdminDetails from "./pages/adminProfile"
import useAuthStore from "./store/useAuthStore"
import NotAuthenticatedLoginPage from "./component/NotAuthenticated"
import CreateRegion from "./pages/createRegion"
import ChangePassword from "./pages/ChangePassword"
import GetWaitList from "./pages/GetWaitList"
import OverView from "./pages/OverView"
import { configDotenv } from "dotenv"
import React from "react"
import { ToastContainer } from 'react-toastify';
import NotFound from "./pages/NotFound"
import Settings from "./pages/Settings"
import 'react-toastify/dist/ReactToastify.css';
import LoanManagement from "./pages/LoanManagement"
import SavingsManagement from "./pages/SavingsManagement"
import BranchManagement from "./pages/branchManagement"
function App() {
  const checkAuth = useAuthStore()
  console.log("auth", checkAuth)
  return (
    <>
    {/* <NavBar/>
<SideBar /> */}
     <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
<Routes>
  {/* Public routes */}

  <Route path="/"  element={<WaitList/>}/>
  <Route path="/login"  element={<Login/>}/>
  <Route path="/changePassword"  element={<ChangePassword/>}/>
  <Route path="/get-wait-list"  element={<GetWaitList/>}/>


{/* private routes */}
  <Route path="/manageSavings"  element= { checkAuth.token ?(<SavingsManagement/>) : (<NotAuthenticatedLoginPage/>)}/>
  <Route path="/admin-details"  element={ checkAuth.token ?(<AdminDetails/>) : (<NotAuthenticatedLoginPage/>)}/>
  <Route path="/create-admin"  element={ checkAuth.token ?(<AdminProfile/>) : (<NotAuthenticatedLoginPage/>)}/>
  <Route path="/createSavings"  element={ checkAuth.token ?(<CreateSavingsPage/>) : (<NotAuthenticatedLoginPage/>)}/>
  <Route path="/settings"  element={ checkAuth.token ?(<Settings/>) : (<NotAuthenticatedLoginPage/>)}/>
  <Route path="/createSavings"  element={ checkAuth.token ?(<CreateSavingsPage/>) : (<NotAuthenticatedLoginPage/>)}/>
  <Route path="/createRegion"  element={ checkAuth.token ?(<CreateRegion/>) : (<NotAuthenticatedLoginPage/>)}/>
  <Route path="/WalletManagement"  element={ checkAuth.token ?(<WalletManagement/>) : (<NotAuthenticatedLoginPage/>)}/>
  <Route path="/over-view"  element={ checkAuth.token ?(<OverView/>) : (<NotAuthenticatedLoginPage/>)}/>
  <Route path="/loans"  element={ checkAuth.token ?(<LoanManagement/>) : (<NotAuthenticatedLoginPage/>)}/>
  <Route path="/branch-management"  element={ checkAuth.token ?(<BranchManagement/>) : (<NotAuthenticatedLoginPage/>)}/>
    {/* 404 Route - MUST be at the end */}
        <Route path="*" element={<NotFound/>}/>
</Routes>
    </>
  )
}

export default App
