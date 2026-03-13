import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from './../Footer/Footer';
import MyNavbar from './../Navbar/Navbar';
import SuggestedFriends from '../SuggestedFriends/SuggestedFriends';
import SideMenu from './../SideMenu/SideMenu';

export default function Layout() {
  return (
    <>
      <MyNavbar />

      <div className="container mx-auto w-[90%] min-h-screen">

        <div className="grid grid-cols-12 gap-6">

          <div className="hidden lg:block col-span-12 lg:col-span-3">
            <SideMenu/>
          </div>


          {/* Feed */}
          <div className="col-span-12 lg:col-span-6">
            <Outlet />
          </div>

          {/* Suggested Friends - يظهر فقط في الشاشات الكبيرة */}
          <div className="hidden lg:block lg:col-span-3">
            <SuggestedFriends />
          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}