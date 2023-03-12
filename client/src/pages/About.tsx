import React from "react";
import { motion } from "framer-motion";

function About() {
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
      <div className="my-[100px]">
        Welcome to Chatify, please send this url to a friend of yours so you can
        start chatting, or for testing purposes, just open this url side by side
        on another browser, log in with a new account, so you can see how it
        works!
      </div>
    </motion.div>
  );
}

export default About;
