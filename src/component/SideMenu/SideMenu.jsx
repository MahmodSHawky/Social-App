import { NavLink } from "react-router-dom";
import { FaRegNewspaper } from "react-icons/fa";

import { IoGlobeOutline } from "react-icons/io5";
import { BsBookmark } from "react-icons/bs";

export default function SideMenu() {
  return (
    <div className="bg-white rounded-2xl shadow p-4 w-64 me-2">

      <nav className="flex flex-col gap-2">

        <NavLink
          
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition
            ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : ""}`
          }
        >
          <FaRegNewspaper size={20} />
          Feed
        </NavLink>

        <NavLink
          
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition
            ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : ""}`
          }
        >

          My Posts
        </NavLink>

        <NavLink
          
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition
            ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : ""}`
          }
        >
          <IoGlobeOutline size={20} />
          Community
        </NavLink>

        <NavLink
          
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition
            ${isActive ? "bg-blue-100 text-blue-600 font-semibold" : ""}`
          }
        >
          <BsBookmark size={20} />
          Saved
        </NavLink>

      </nav>

    </div>
  );
}