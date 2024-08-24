import { UserInterface } from "@/interfaces";
import { createContext } from "react";

export interface AuthContextInterface {
  user: UserInterface,
  setUser: (user: UserInterface) => void,
  loading: boolean,
}

export const AuthContext = createContext({} as AuthContextInterface)