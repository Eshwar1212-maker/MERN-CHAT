import React from "react";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";

const Profile = () => {
  const { username, id, setId, setUsername } = useContext(UserContext);

  return (
    <div className="py-[150px] w-[500px] flex-col h-[650px] text-white bg-slate-900 flex justify-center items-center m-auto">
      <div>{username}'s activity</div>
      <div>This many messages</div>
    </div>
  );
};

export default Profile;
