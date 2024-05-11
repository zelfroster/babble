import React, { createContext, useState } from "react";

export interface User {
  firstName: string;
  lastName: string;
  username: string;
}

export const UserContext = createContext<{
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
}>({
  currentUser: null,
  setCurrentUser: () => null,
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const value = { currentUser, setCurrentUser };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
