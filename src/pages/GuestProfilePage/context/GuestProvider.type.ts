import { PostRefType } from "@/src/types";
import { Dispatch, ReactNode } from "react";
import { enemyData } from "../components";

export interface IGuestProviderProps {
  children: ReactNode;
}

export type GuestContextType = {
  fetchEnemyUserData: (Id: string | number | undefined) => Promise<void>;
  guestPostsList: [] | Array<PostRefType>;
  setGuestPostsList: Dispatch<React.SetStateAction<Array<PostRefType>>>;
  enemyData: enemyData | undefined;
  setEnemyData: Dispatch<React.SetStateAction<enemyData | undefined>>;
  BooksCheker: boolean;
  setPage: Dispatch<React.SetStateAction<number>>
  isGuestPostsLoaded: boolean;
};
