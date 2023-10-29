import { FC } from "react";

import { useAppSelector } from "@/src/redux/hooks";
import { AvatarProps } from "./UserAvatar.type";
import styles from "./UserAvatar.module.scss";

import defaultUserAvatar from "@/src/assets/SVG/default-user-avatar.svg";

const UserAvatar: FC<AvatarProps> = ({ avatarUrl }) => {
  const { user } = useAppSelector((state) => state.userSlice);

  return (
    <div className={styles["avatar"]}>
      <img
        src={avatarUrl || defaultUserAvatar}
        alt="avatar"
        width="120"
        className={`${styles["avatar__image"]} ${styles["avatar__image--mob"]}`}
      />
      <img
        src={avatarUrl || defaultUserAvatar}
        alt="avatar"
        width="210"
        className={`${styles["avatar__image"]} ${styles["avatar__image--tab"]}`}
      />
      <img
        src={avatarUrl || defaultUserAvatar}
        alt="avatar"
        width="216"
        className={`${styles["avatar__image"]} ${styles["avatar__image--desc"]}`}
      />
      <p className={styles["avatar__email"]}>
        {user.email || "test.test@test.com"}
      </p>
    </div>
  );
};

export default UserAvatar;