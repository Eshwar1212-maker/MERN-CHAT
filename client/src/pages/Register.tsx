import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import video from "../assets/video.mp4";

export const Register = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginOrRegister, setIsLoginOrRegister] = useState("login");

  const { setUsername: setLoggedInUserName, setId } = useContext(UserContext);

  const handleSubmit = async (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    const url = isLoginOrRegister === "register" ? "register" : "login";
    const { data } = await axios.post(url, { username, password });
    setLoggedInUserName(username);
    setId(data.id);
  };

  return (
    <div className="text-white relative h-screen">
      <video
        className="w-full h-full object-cover"
        src={video}
        autoPlay
        loop
        muted
      />

      <div className="bg-blue-50 flex items-center absolute w-full h-full top-0 left-0 bg-gray-900/30 text-center">
        <form className="w-[230px] mx-auto mb-11" onSubmit={handleSubmit}>
          <input
            onChange={(e) => setUserName(e.target.value)}
            value={username}
            type="text"
            placeholder="username"
            className="block w-full rounded-xl mb-2 border text-black h-[57px] text-xl"
          />
          <input
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            type="password"
            placeholder="password"
            className="block w-full rounded-xl mb-2 border text-black h-[57px] text-xl"
          />
          <button className="bg-blue-500 text-white block w-full font-first h-[46px] rounded-xl">
            {isLoginOrRegister === "register" ? "Register" : "Login"}
          </button>
          <div className="text-center mt-2 font-first font-bold">
            {isLoginOrRegister === "register" && (
              <div className="text-md">
                Already a member?
                <button
                  className="ml-1 underline text-md"
                  onClick={() => setIsLoginOrRegister("login")}
                >
                  Login here
                </button>
              </div>
            )}
            {isLoginOrRegister === "login" && (
              <div className="text-md">
                <p className="text-md">Don't have an account?</p>
                <button
                  className="ml-1 underline text-md"
                  onClick={() => setIsLoginOrRegister("register")}
                >
                  Register here
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
