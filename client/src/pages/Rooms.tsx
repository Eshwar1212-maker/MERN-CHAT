import React from "react";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";

const Rooms = () => {
  const { username, id, setId, setUsername } = useContext(UserContext);

  return (
    <div className="py-[150px] w-[500px] font-thin font-six flex-col h-[650px] text-white bg-slate-900 flex justify-center items-center m-auto">
      <div className="py-0">Welcome to Chatifys rooms!</div>
      <button className="bg-slate-700 p-2 rounded-lg">Create a room</button>
    </div>
  );
};

export default Rooms;
