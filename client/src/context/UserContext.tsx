import axios from "axios";
import { createContext, useEffect, useState } from "react";

interface IUserContext {
  username: string | null;
  setUsername: (username: string | null) => void;
  id: number | null;
  setId: (id: number | null) => void;
}

export const UserContext = createContext<IUserContext>({
  username: null,
  setUsername: () => {},
  id: null,
  setId: () => {},
});

export function UserContextProvider({ children }: any) {
  const [username, setUsername] = useState<string | null>(null);
  const [id, setId] = useState<number | null>(null);

  useEffect(() => {
    axios.get("/profile", {}).then((res: any) => {
      setId(res.data.userId);
      setUsername(res.data.username);
    });
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
