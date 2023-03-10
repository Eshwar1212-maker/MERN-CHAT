import React, { useState } from "react";
import { AiFillWechat } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { AiOutlineUserAdd, AiOutlineArrowDown } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsChatDots } from "react-icons/bs";

export const Navbar = () => {
  const [navbar, setNavbar] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const { username } = useContext(UserContext);

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="flex justify-between bg-slate-800">
      <div className="py-6 flex flex-row gap-2 mx-2 justify-center text-white">
        <AiFillWechat className="pb-5" size={70} />
        <div className="text-3xl text-orange-900 font-extrabold">Chatify</div>
      </div>
      {username && (
        <div className=" font-thin font-fifth text-xl">
          <nav className="hidden md:flex flex-row gap-4 m-auto list-none py-5 pr-11">
            <li className="relative p-3 bg-none hover:text-slate-300">
              <button
                onClick={handleDropdown}
                className="flex items-center focus:outline-none text-white"
              >
                <AiOutlineArrowDown
                  className="text-slate-500 hover:text-slate-500"
                  size={44}
                />
              </button>
              {showDropdown && (
                <div className="absolute top-full left-0 bg-slate-800 z-50">
                  <ul className="py-2 w-full">
                    <li
                      onClick={handleDropdown}
                      className="p-3 hover:bg-slate-700 hover:underline text-white"
                    >
                      <Link to="/about">About</Link>
                    </li>
                    <li className="p-3 hover:bg-slate-700 hover:underline text-white">
                      <Link onClick={handleDropdown} to="/rooms">
                        Rooms
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>
            <li className="p-3 hover:bg-slate-700 hover:underline text-white">
              <Link to="/profile">
                <AiOutlineUserAdd size={40} />
              </Link>
            </li>
            <li className="p-3 hover:bg-slate-700 hover:underline text-white">
              <Link to="/">
                <BsChatDots size={40} />
              </Link>
            </li>
            <li className="flex p-3 my-2">
              <p className="font-bold text-slate-100 text-[25px]">
                -{username}
              </p>
            </li>
          </nav>
        </div>
      )}
      {username && (
        <div className="md:hidden text-white z-50">
          <GiHamburgerMenu
            onClick={() => setNavbar(!navbar)}
            className="my-4"
            size={40}
          />
          {navbar && (
            <nav
              className={
                navbar
                  ? "fixed left-0 top-0 w-[40%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500mx-8"
                  : "ease-in-out duration-500 fixed left-[-100%]"
              }
            >
              <ul onClick={() => setNavbar(!navbar)} className="pt-24">
                <li className="border-b border-gray-600 p-8">
                  <Link to="/about">About</Link>
                </li>

                <li className="border-b border-gray-600 p-8">
                  <Link to="/">Home</Link>
                </li>
                <li className="border-b border-gray-600 p-8">
                  <Link to="/">Rooms</Link>
                </li>
                <li className="border-b border-gray-600 p-8">
                  <Link to="/profile">Profile</Link>
                </li>
                <li className="flex p-8">
                  {" "}
                  <AiOutlineUserAdd size={23} />
                  <p className="underline font-bold text-slate-400">
                    {username}
                  </p>
                </li>
              </ul>
            </nav>
          )}
        </div>
      )}
    </div>
  );
};
