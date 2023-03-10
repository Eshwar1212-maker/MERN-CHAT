import { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Register } from "../pages/Register";
import { Chat } from "../pages/Chat";
import { Navbar } from "../components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AiFillWechat } from "react-icons/ai";

function LoginRoutes() {
  const { username, id } = useContext(UserContext);
  const [isChatReady, setIsChatReady] = useState(false);

  useEffect(() => {
    // Simulate a delay to show the loading page
    const timer = setTimeout(() => {
      setIsChatReady(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (!isChatReady) {
    return (
      <div className="sm: text-[20px] md:text-[60px] flex flex-col items-center justify-center py-[300px]">
        <div className="flex flex-row">
          <AiFillWechat className="hidden md:block" size={80} />
          <div className=" text-orange-900 font-extrabold">Chatify</div>
        </div>
        <div>
          <p className="text-[10px] md:text-[40px] flex-col">Loading...</p>
        </div>
      </div>
    );
  }

  if (username) {
    return (
      <div>
        <Chat />
      </div>
    );
  }

  return (
    <div>
      <Register />
    </div>
  );
}

export default LoginRoutes;
