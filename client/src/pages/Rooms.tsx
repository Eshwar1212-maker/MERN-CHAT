import React from "react";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { motion } from "framer-motion";

const Rooms = () => {
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
      <div className="py-[150px] w-[500px] font-thin font-six flex-col h-[650px] text-white bg-slate-900 flex justify-center items-center m-auto">
        <div className="py-0">Private room feature coming soon!</div>
      </div>
    </motion.div>
  );
};

export default Rooms;
