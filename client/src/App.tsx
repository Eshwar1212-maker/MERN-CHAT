import axios from "axios";
import { UserContextProvider } from "./context/UserContext";
import LoginRoutes from "./routes/LoginRoutes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import { Navbar } from "./components/Navbar";
import Profile from "./pages/Profile";
import Rooms from "./pages/Rooms";

const App = () => {
  axios.defaults.baseURL = "http://localhost:4000";
  axios.defaults.withCredentials = true;

  return (
    <BrowserRouter>
      <UserContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LoginRoutes />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/rooms" element={<Rooms />} />
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
};

export default App;
