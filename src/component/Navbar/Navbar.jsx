import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
} from "@heroui/react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from './../Context/AuthContext';
import Login from './../Login/Login';


export default function MyNavbar() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const logedMenuItems = [
      { label: "Home", path: "/app" },
      { label: "Profile", path: "/app/profile" },
      { label: "Log Out", path: "/login", action: "logout" },
    ];
    const {userLogin, setuserLogin,userInfo} = useContext(AuthContext)
    const Navigate = useNavigate()

    function logOut(){
      localStorage.removeItem("userToken");
      setuserLogin(null)
      Navigate("/Login")
    }

  return (
    <Navbar>

      
      <NavbarMenu>
        {logedMenuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link
              className="w-full"
              color={item.action === "logout" ? "danger" : "foreground"}
              to={item.path}
              size="lg"
              onClick={() => {
                if (item.action === "logout") {
                  logOut();
                }
              }}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>

      <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
      <NavbarBrand>
        <p className="font-bold text-inherit"><Link  to={userLogin !== null && "/app"}> SOCIAL-APP</Link></p>
      </NavbarBrand>

      <NavbarContent as="div" justify="end">
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem isActive>
            <Link color="foreground" to="/app">
              Home
            </Link>
          </NavbarItem >
          
          <NavbarItem >
            <Link aria-current="page" color="secondary" to="/app/profile">
              Profile
            </Link>
          </NavbarItem>

          <NavbarItem >
            <Link aria-current="page" color="secondary" to="/app/notifications">
              Notifications
            </Link>
          </NavbarItem>

          
      </NavbarContent>

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              //will change with user 
              src={userInfo?.photo}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="help_and_feedback">{userInfo?.name}</DropdownItem>
            <DropdownItem key="help"><Link className="w-full block" to="/app/profile">profile</Link></DropdownItem>
            <DropdownItem key="help_and_feedback"><Link aria-current="page" color="secondary" to="/app/notifications">Notifications</Link></DropdownItem>  
            <DropdownItem key="feedback"> <Link className="w-full block" to="/app/settings">  settings   </Link> </DropdownItem>
            <DropdownItem key="logout" color="danger" onClick={function(){logOut()}}>
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
