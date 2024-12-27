import React, { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from "../logo.svg"
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import DiamondIcon from '@mui/icons-material/Diamond';

import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import { useNavigate } from 'react-router-dom';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState({
    tasks: false,
    clients: false,
  });

  const [islockMenu,setIslockMenu] = useState(false);
  
  const toggleDropdown = (item) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [item]: !prevState[item],
    }));
  };

  const lockDropdown = () =>
  {
    setIslockMenu(!islockMenu);
  }
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { label: 'Dashboard', icon: <HomeIcon />, link: '/dashboard' },
    { label: 'User', icon: <AccountCircleIcon />, link: '/user' },
   
   
    { label: 'Order', icon: <ShoppingCartIcon />, link: '/',
      submenu: [
        { label: 'All',icon:<HorizontalRuleIcon /> ,link: '/all-order' },
        { label: 'Pending' ,icon:<HorizontalRuleIcon />, link: '/order/pending-order' },
        { label: 'Confirmed' ,icon:<HorizontalRuleIcon />, link: '/order/confirmed-order' },
       
        { label: 'Canceled' ,icon:<HorizontalRuleIcon />, link: '/order/cancel-order' },
        
        { label: 'Delivered' ,icon:<HorizontalRuleIcon />, link: '/order/deliver-order' },
       
      ],
     },
    { label: 'Category Setup', icon: <CategoryIcon />, link: '/',
      submenu: [
        { label: 'Category' ,icon:<HorizontalRuleIcon />, link: '/category' },
        { label: 'Sub Category' ,icon:<HorizontalRuleIcon />, link: '/sub-category' },
        
        
      ],
     },
    { label: 'Product Setup', icon: <DiamondIcon/>, link: '' ,
      submenu: [
        
        { label: 'Product Add' ,icon:<HorizontalRuleIcon />, link: '/product-add' },
        { label: 'Product List' ,icon:<HorizontalRuleIcon />, link: '/product-list' },
        
        { label: 'Product Review' ,icon:<HorizontalRuleIcon />, link: '' },
        
      ],
    },
   
  //  { label: 'Logout', icon: <ExitToAppIcon />, link: '/',
  //   onClick:()=>
  //   {
  //     sessionStorage.removeItem('isAuthenticated');
  //     navigate("/", { replace: true });
  //   }
  //  },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    // Check if the main menu item label matches the search term
    if (item.label.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    }
   
    if (item.submenu) {
      const foundInSubmenu = item.submenu.some(subitem =>
        subitem.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return foundInSubmenu;
    }
    return false;
  });

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    navigate("/", { replace: true });
  };

  return (
    <div
        className={`flex ${
          isOpen ? "" : "md:flex-col"
        } flex-auto flex-shrink-0`}
      >
      <div
          className={`${
            isOpen ? "block" : "hidden md:block"
          } fixed  top-0 left-0 w-64 bg-white h-full border-r overflow-y-auto z-50`}
        >
          <div className="fixed top-0 z-50 left-0 p-3 px-14 w-full flex h-14 border-b bg-black text-black">
            <div className="font-bold text-xl ">
              {/* <img src='./logo.png' alt='' className='w-52 h-9'/> */}
              <img src={logo} alt='' className='w-52 h-9'/>
            </div>
          </div>
          <div className="overflow-y-auto overflow-x-hidden flex-grow">
      <ul className="flex flex-col py-14 space-y-1">
        <li className="px-5">
          <div className="relative mt-5">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 pl-10 text-sm bg-gray-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-red-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-3 top-2 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 2a8 8 0 105.291 14.032l4.387 4.387a.75.75 0 001.06-1.061l-4.387-4.387A8 8 0 0010 2zm-6.5 8a6.5 6.5 0 1111.703 4.259.75.75 0 00-.11.119L17.573 19l-.707.707-4.287-4.287a.75.75 0 00-.119-.11A6.48 6.48 0 013.5 10z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </li>
        {filteredMenuItems.map((item, index) => (
          <li key={index}>
            {item.submenu ? (
              <div className="relative">
                <button
                  onClick={() => toggleDropdown(item.label.toLowerCase())}
                  className="relative flex flex-row items-center w-full h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-red-600 border-l-4 border-transparent hover:border-red-600 pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    {/* Render Material UI icon here */}
                    {item.icon}
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    {item.label}
                  </span>
                  <svg
                    className={`${
                      isDropdownOpen[item.label.toLowerCase()]
                        ? "transform rotate-180"
                        : ""
                    } w-4 h-4 ml-auto`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {/* Render submenu items */}
                {isDropdownOpen[item.label.toLowerCase()] && (
                  <ul className="ml-4 mt-2">
                    {item.submenu.map((subitem, subindex) => (
                      <li key={subindex}>
                        <a
                          href={subitem.link}
                          className="block px-4 py-1 text-sm text-gray-600 hover:text-red-600 flex items-center"
                        >
                          {/* Render submenu item icon here */}
                          {subitem.icon && (
                            <span className="inline-flex items-center mr-3">
                              {subitem.icon}
                            </span>
                          )}
                          {subitem.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              // Render regular items without dropdown
              <a
                href={item.link}
                className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-red-600 border-l-4 border-transparent hover:border-red-600 pr-6"
              >
                <span className="inline-flex justify-center items-center ml-4">
                  {/* Render Material UI icon here */}
                  {item.icon}
                </span>
                <span className="ml-2 text-sm tracking-wide truncate">
                  {item.label}
                </span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
      </div>

     <div className="fixed top-0 w-full md:pl-64 z-50">
          <div className="bg-black text-white h-14 w-full flex items-center justify-end px-5">
            <div className="media-body d-flex align-items-end flex-column flex flex-col">
              <span className="card-title h5">Admin</span>
              
            </div>
            <div className="relative flex items-center pl-2">
              {islockMenu && (
                <div className="absolute right-0 mt-48 bg-white shadow-lg py-2 w-48">
                  <a href="/" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">Profile</a>
                  <a href="/" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">Settings</a>
                  <a href="/" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"  onClick={handleLogout}>Logout</a>
                </div>
              )}
              <button onClick={lockDropdown} className="focus:outline-none">
                <img
                  src="https://i.pinimg.com/564x/4a/43/da/4a43da03892a2dc31b77e7e1f7853676.jpg"
                  alt="Avatar"
                  className="h-10 w-10 rounded-full cursor-pointer"
                />
              </button>
              </div>
          </div>
</div>
<button
          className="fixed md:hidden left-0 top-0 mt-2 ml-4 p-2  rounded-lg text-white z-50"
          onClick={toggleSidebar}
        >
          {isOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
    </div>
  );
};

export default SideBar;
