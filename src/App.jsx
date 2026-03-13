import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./component/Layout/Layout";
import Login from "./component/Login/Login";
import Register from "./component/Register/Register";
import Notallowed from "./component/Notallowed/Notallowed";
import Home from "./component/Home/Home";
import CounterContainerProvider from './component/Context/CounterContext';
import {HeroUIProvider} from "@heroui/react";
import Profile from './component/Profile/Profile';
import AuthContextProvider from "./component/Context/AuthContext";
import LandingPage from './component/LandingPage/LandingPage';
import ProtectedRoute from "./component/ProtectedRoute/protectedRoute";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import PostDetails from './component/PostDetails/PostDetails';
import { ToastContainer } from 'react-toastify';
import {useNetworkState} from 'react-use';   // to detect offline
import DetectOffline from "./component/DetectOffline/DetectOffline";
import Settings from './component/Settings/Settings';
import Notifications from './component/Notifications/Notifications';
import UserProfile from "./component/UserProfile/UserProfile";



const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    path: "/app",
    element:  <ProtectedRoute>  <Layout />  </ProtectedRoute> ,
    children: [
      { index: true, element:  <Home/> },      // /app
      { path: "home", element:  <Home/>  },     // /app/home
      { path: "profile", element:  <Profile/> }, // /app/profile
      { path: "settings", element:  <Settings/> }, 
      { path: "postdetails/:id", element:  <PostDetails/> },
      { path: "userprofile/:postId", element:  <UserProfile/> },
      { path: "notifications", element:  <Notifications/> }, // /app/notifications
      { path: "*", element: <Notallowed /> },
    ],
  },
]);



const quary = new QueryClient()


export default function App() {

  const {online} = useNetworkState()


  return <>

  {!online && <DetectOffline/>}

  <QueryClientProvider client={quary}>
    <AuthContextProvider>
      <HeroUIProvider>
        <CounterContainerProvider>
          <RouterProvider router={router}/>

            <ToastContainer/>
        </CounterContainerProvider>
      </HeroUIProvider>
    </AuthContextProvider>
  </QueryClientProvider>

  
   
  
  </>;
}
