import { useState } from "react";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-blue-50 h-screen flex items-center pb-[200px]">
      <form className="w-64 mx-auto">
        <input
          onChange={(e) => setUserName(e.target.value)}
          value={username}
          placeholder="username"
          className="block w-full rounded-sm p-2 mb-2"
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="password"
          className="block w-full rounded-sm p-2 mb-2"
        />
        <button className="bg-blue-900 text-white w-full rounded-md p-2">
          Register
        </button>
      </form>
    </div>
  );
};

export default Login;
