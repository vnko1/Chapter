import { Dispatch, FC, SetStateAction, createRef, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AxiosError, AxiosResponse } from "axios";

import { EndpointsEnum, api } from "@/src/axios";
import { SocketApi } from "@/src/services";
import { getTokenFromLC } from "@/src/utils";
import { useErrorBoundary } from "@/src/hooks";
import { useAppSelector } from "@/src/redux";
import {
  INotification,
  INots,
  SocketEventsEnum,
  PostRefType,
} from "@/src/types";

import { IProfileProviderProps, SetBoolean } from "./ProfileProvider.type";
import { ProfileContext } from "./hooks";
import UserPostsLoader from "../UserPostsLoader/userPostsLoader";

const socket = new SocketApi();

const ProfileProvider: FC<IProfileProviderProps> = ({ children }) => {
  const setErrorBoundary = useErrorBoundary();
  const isAuth = useAppSelector((state) => state.userSlice.isAuth);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userPostsList, setUserPostsList] = useState<Array<PostRefType>>([]);
  const [isPostsLoad, setIsPostsLoad] = useState(false);
  const [page, setPage] = useState<number>(0);
  const intersectionRef = useRef(null);

  const [headerAddPostBtnIsDisabled, setHeaderAddPostBtnIsDisabled] =
    useState(false);


  const [notifications, setNotifications] = useState<Array<INots>>([]);

  const editedNotifications: Array<INotification> = notifications
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .map((el) => ({
      ...el,
      nodeRef: createRef(),
    }));

  const viewedNotifications = editedNotifications.filter(
    (notification) => notification.isViewed
  );
  const newNotifications = editedNotifications.filter(
    (notification) => !notification.isViewed
  );
  const [unreadMessage, setUnreadMessage] = useState(newNotifications.length);



  const fetchUserPosts = async (currentPage: number) => {
    try {
      const response = await api.get(
        `${EndpointsEnum.POSTS_BY_AUTHOR}?page=${currentPage}&limit=3`
      );
      const newPosts = response.data;
      setUserPostsList(prevPosts => [...prevPosts, ...newPosts]); // Append new posts to the existing list
      setIsPostsLoad(true);
      return newPosts;
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  const userPostsApi = useCallback(
    (url: string, setPostsList: Dispatch<SetStateAction<PostRefType[]>>, page: number, setIsPostsLoaded?: SetBoolean, postsAction?: "deletePost" | "addPost") =>
      new UserPostsLoader(url, setPostsList, setErrorBoundary, setIsPostsLoad, setIsPostsLoaded, postsAction).get(page),
    [page, setErrorBoundary]
  );

  useLayoutEffect(() => {
    setIsLoading(true);
    api
      .get(EndpointsEnum.NOTA)
      .then(({ data }: AxiosResponse<Array<INots>>) => setNotifications(data))
      .catch((e) => {
        if (e instanceof AxiosError) {
          setErrorBoundary(e);
        }
      })
      .finally(() => setIsLoading(false));
  }, [setErrorBoundary]);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onError = (error: Error) => console.log(error);
    const onDisconnect = () => setIsConnected(false);

    if (getTokenFromLC()) {
      socket.init(getTokenFromLC() + "");
      socket.connect(isAuth);
    }

    socket.addListener("connect", onConnect);
    socket.addListener("connect_error", onError);
    socket.addListener("disconnect", onDisconnect);

    return () => {
      socket.removeListener("connect", onConnect);
      socket.addListener("connect_error", onError);
      socket.removeListener("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, [isAuth]);

  useEffect(() => {
    const onHandleSubscribe = socket.handleData<INots>(
      setNotifications,
      setErrorBoundary
    );

    const onHandleNewPost = socket.handleData<INots>(
      setNotifications,
      setErrorBoundary
    );

    if (isConnected) {
      socket.addListener<INots>(SocketEventsEnum.subscribe, onHandleSubscribe);

      socket.addListener<INots>(SocketEventsEnum.post, onHandleNewPost);
    }

    return () => {
      socket.removeListener<INots>(
        SocketEventsEnum.subscribe,
        onHandleSubscribe
      );

      socket.removeListener<INots>(SocketEventsEnum.post, onHandleNewPost);
    };
  }, [isConnected, setErrorBoundary]);

  useEffect(() => {
    setUnreadMessage(newNotifications.length);
  }, [newNotifications.length]);

  return (
    <ProfileContext.Provider
      value={{
        headerAddPostBtnIsDisabled,
        unreadMessage,
        viewedNotifications,
        newNotifications,
        isLoading,
        notificationsLength: notifications.length,
        setHeaderAddPostBtnIsDisabled,
        setUnreadMessage,
        setNotifications,
        page,
        setPage,
        fetchUserPosts,
        userPostsList,
        setUserPostsList,
        setIsPostsLoad,
        isPostsLoad,
        intersectionRef,
        userPostsApi
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;
