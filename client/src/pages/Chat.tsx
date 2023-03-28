import React, { useContext, useEffect, useRef, useState } from "react";
import { AiFillWechat } from "react-icons/ai";
import { UserContext } from "../context/UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import Contact from "../components/Contact";
import message from "./message.mp3";
import { motion } from "framer-motion";

import {
  AiOutlineUserAdd,
  AiOutlineSearch,
  AiFillCloseCircle,
} from "react-icons/ai";
import {
  BsFillSunFill,
  BsMoonStarsFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { BiLogOut } from "react-icons/bi";
import { GiHamburgerMenu } from "react-icons/gi";

type WebSocketType = WebSocket | null;
interface Person {
  userId: number;
  username: string;
}

interface OnlinePeople {
  [key: number]: string;
}

export const Chat = () => {
  const [users, setUsers] = useState<OnlinePeople>({});
  const [toggleUsers, settoggleUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [ws, setWs] = useState<WebSocketType>(null);
  const [lightDarkMode, setLightDarkMode] = useState(false);
  const [offlinePeople, setOfflinePeople] = useState<OnlinePeople>({});
  const [onlinePeople, setOnlinePeople] = useState<OnlinePeople>({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; isOur: boolean }[]>(
    []
  );
  const { username, id, setId, setUsername } = useContext(UserContext);
  const messagesBoxRef = useRef();

  type Message = {
    text: string;
    isOur: boolean;
    sender: number;
  };

  //Getting messages for selected user.
  useEffect(() => {
    if (selectedUser) {
      axios.get("/messages/" + selectedUser).then((res) => {
        setMessages(res.data);
      });
    }
  }, [selectedUser]);

  //Creating a Web Socket connection every time the component mounts
  useEffect(() => {
    connectToWs();
  }, [selectedUser]);

  useEffect(() => {
    axios.get("/people").then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach((person) => {
        offlinePeople[person._id] = person;
      });
      setOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);

  //Function to show online people
  const showOnlinePeople = (peopleArray: Person[]) => {
    const people: OnlinePeople = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    axios.get("/people").then((res) => {
      const offlinePeople = {};
      const allPeople = {};
      console.log(res);
      res.data.forEach((person) => {
        allPeople[person._id] = person;
        if (people[person._id]) {
          allPeople[person._id] = person;
        }
      });

      setOfflinePeople(allPeople);
      setOnlinePeople(people);
      setUsers(allPeople);
    });
  };

  console.log(users);

  const connectToWs = () => {
    const ws = new WebSocket("ws://localhost:4000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.removeEventListener("close", () => {
      setTimeout(() => {
        connectToWs();
      }, 1000);
    });
  };

  //Displaying online users
  const onlinePeopleExcludingUser = { ...onlinePeople };
  delete onlinePeopleExcludingUser[id];
  //Prevent sending duplicate messages
  const messagesWithoutDups = uniqBy(messages, "_id");

  function logout() {
    axios.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setUsername(null);
    });
  }
  const handleMessage = (e: MessageEvent<any>) => {
    e.preventDefault();
    const messageData = JSON.parse(e.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  };
  const sendMessage = (e: React.FormEvent<HTMLFormElement>, file = null) => {
    if (e) e.preventDefault();
    ws?.send(
      JSON.stringify({
        recipient: selectedUser,
        text: newMessage,
        file,
      })
    );
    setNewMessage("");
    setMessages((prev) => [
      ...prev,
      {
        text: newMessage,
        sender: id,
        recipient: selectedUser,
        id: Date.now(),
        isOur: true,
      },
    ]);
    if (file) {
      axios.get("/messages/" + selectedUser).then((res) => {
        setMessages(res.data);
      });
    }
    const audio = new Audio(message);
    audio.play();
  };

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  }, [messages]);

  const toggleMode = () => {
    setLightDarkMode(!lightDarkMode);
  };
  const sendFile = (e: React.FormEvent<HTMLFormElement>) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: e.target.files[0].name,
        data: reader.result,
      });
    };
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.1 }}
      variants={{
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
      }}
      className="flex flex-col md:flex-row h-screen"
    >
      <div
        className={
          toggleUsers
            ? "bg-slate-100 md:w-1/4 lg:w-1/4 flex-grow-0 flex-shrink-0"
            : "bg-slate-50 md:w-1/8 lg:w-1/4 flex-grow-0 flex-shrink-0"
        }
      >
        {/* <GiHamburgerMenu size={50} /> */}
        {toggleUsers ? (
          <AiFillCloseCircle
            onClick={() => settoggleUsers(!toggleUsers)}
            className="hidden md:block ml-[80%] cursor-pointer"
            size={40}
          />
        ) : (
          <BsFillArrowRightCircleFill
            onClick={() => settoggleUsers(!toggleUsers)}
            className={
              toggleUsers
                ? "ml-[210px] rounded-xl cursor-pointer"
                : "my-[400px] rounded-xl cursor-pointer"
            }
            size={40}
          />
        )}
        {toggleUsers && (
          <motion.div className="flex flex-col items-center py-11 cursor-pointer">
            <div className="hidden md:flex flex-row gap-9 md:flex-col items-center justify-center md:gap-2">
              <div className="text-4xl text-orange-900 font-extrabold font-second">
                Chatify
              </div>
              {/* <button
                onClick={logout}
                className="underline text-white rounded-xl p-1 mx-1 font-fourth"
              >
                Log Out
              </button> */}
              <div className="flex items-center gap-1 md:hidden">
                <div className="hidden md:m-auto">
                  <AiOutlineUserAdd size={23} />
                </div>
                <div>
                  <p className="hidden md:text-xl font-bold font-six">
                    -{username}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
              <input
                onChange={(e) => setSearchQuery(e.target.value)}
                value={searchQuery}
                className="p-2 flex-grow w-[70%]"
                placeholder="Search friends"
              />
              <button>
                <AiOutlineSearch size={30} />
              </button>
            </div>
            <h3 className="text-center underline mt-4 mb-2 text-lg font-fourth">
              Users
            </h3>
            <div className="flex flex-row md:flex-col font-seven">
              {Object.keys(onlinePeopleExcludingUser).map((userId) => (
                <Contact
                  key={userId}
                  id={userId}
                  online={true}
                  username={onlinePeopleExcludingUser[userId]}
                  onClick={() => {
                    setSelectedUser(userId);
                    console.log({ userId });
                  }}
                  selected={userId === selectedUser}
                />
              ))}
            </div>
            <div className="fixed bottom-12 w-full flex justify-center flex-col items-center py-4 gap-1">
              <button className="hidden" onClick={toggleMode}>
                {lightDarkMode ? (
                  <BsFillSunFill size={30} />
                ) : (
                  <BsMoonStarsFill size={30} />
                )}
              </button>
              <button
                onClick={logout}
                className="hidden md:block text-black rounded-xl p-1 mx-1 font-fourth underline"
              >
                <BiLogOut size={38} />
              </button>
              <div className="hidden md:flex items-center gap-2">
                <div className="m-auto">
                  <AiOutlineUserAdd size={23} />
                </div>
                <div>
                  <p className="text-xl font-bold font-six">-{username}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <div className="flex-grow p-2 flex flex-col">
        <div className="relative h-full">
          {!selectedUser && (
            <div className="flex items-center justify-center h-full text-slate-400 text-4xl font-fifth">
              <span className="text-[70px] pb-3"> &larr;</span> Please select a
              contact
            </div>
          )}
          {!!selectedUser && (
            <div
              key={Date.now()}
              className="relative h-full font-fifth text-md mb-2"
              ref={messagesBoxRef}
            >
              {messagesWithoutDups.map((message, index) => (
                <div className="position-absolute top-0 left-0 right-0 bottom-2">
                  <div key={Date.now()} className=" ">
                    {message.sender === id ? (
                      <div
                        key={Date.now()}
                        className="flex justify-end font-extrabold bg-slate-100 text-black p-2"
                      >
                        <p>
                          {message.text}{" "}
                          {message.file && (
                            <div>
                              <a
                                className="underline border-b"
                                target="_blank"
                                href={`${axios.defaults.baseURL}/uploads/${message.file}`}
                              >
                                Photo
                              </a>
                            </div>
                          )}
                        </p>
                      </div>
                    ) : (
                      <div
                        key={Date.now()}
                        className="flex justify-start px-10 m-auto bg-blue-300 text-black p-2"
                      >
                        <p className="text-[17px]">
                          {" "}
                          {onlinePeople[message.sender]}:
                        </p>
                        <p className=""> {message.text}</p>
                      </div>
                    )}
                    <div ref={messagesBoxRef}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 h-1/8 bg-black flex-grow p-2 flex-col">
          {!!selectedUser && (
            <form onSubmit={sendMessage} className="w-full bg-black">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                type="text"
                placeholder="Your message.."
                className="bg-black p-2 flex-grow w-full text-white"
              />
              <div className="flex flex-row">
                <button
                  type="submit"
                  className="w-full p-2 text-white bg-slate-800 rounded-xl"
                >
                  Send
                </button>
                <label className="bg-white p-2 rounded-sm">
                  <input
                    onChange={sendFile}
                    className="hidden cursor-pointer"
                    type="file"
                  />
                  <GrAttachment size={24} />
                </label>
              </div>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
};
/* <div
onClick={() => setSelectedUser(userId)}
className={`flex flex-row border-b border-gray-100 py-3 items-center gap-2 px-3 ${
  userId === selectedUser ? "bg-blue-200" : ""
}`}
key={userId}
>
{userId === selectedUser && (
  <div className="w-1 bg-blue-500 h-12"></div>
)}
<Avatar
  online={true}
  username={onlinePeople[userId]}
  userId={userId}
/>
<div className="py-1">{onlinePeople[userId]}</div>
</div> */
