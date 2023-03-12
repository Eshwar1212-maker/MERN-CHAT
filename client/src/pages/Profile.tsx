import React from "react";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { motion } from "framer-motion";

const Profile = () => {
  const { username, id, setId, setUsername } = useContext(UserContext);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
      variants={{
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
      }}
      className="py-[150px] w-[500px] flex-col h-[650px] text-white bg-slate-900 flex justify-center items-center m-auto"
    >
      <div>
        <span className=" font-six underline font-bold">{username}'s</span>{" "}
        activity:
      </div>
      <div>No activity so far!</div>
    </motion.div>
  );
};

export default Profile;
