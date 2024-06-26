import { FC, useState } from "react";
import { AxiosError } from "axios";

import { useAppSelector } from "@/src/redux";
import { FilesService } from "@/src/services";
import { apiUiMessage } from "@/src/types";
import { useErrorBoundary } from "@/src/hooks";
import { EndpointsEnum, api } from "@/src/axios";
import { PostPreviewProps, BodyProps } from "./PostPreview.type";
import styles from "./PostPreview.module.scss";

import {
  UIbutton,
  PostDate,
  PostFullName,
  PostImage,
  PostText,
  PostTitle,
} from "@/src/components";
import { useProfileContext } from "@/src/context";

const PostPreview: FC<PostPreviewProps> = ({
  setFormIsOpen,
  setIsOpen,
  file,
  resetPostValues,
  ...props
}) => {
  const { firstName, lastName, id } = useAppSelector(
    (state) => state.userSlice.user
  );
  const setErrorBoundary = useErrorBoundary();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userPostsApi, setUserPostsList, page } = useProfileContext();

  const createAt = Date.now();

  const onHandleBackClick = () => {
    setFormIsOpen(true);
  };

  const onHandlePublishClick = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const body: BodyProps = {
        createAt,
      };
      if (props.title) body.title = props.title;
      const files = new FilesService(id, setErrorBoundary);

      if (props.prevImgUrl && (file || !props.imgUrl)) {
        files.delete(props.prevImgUrl);
        body.imgUrl = null;
      }

      if (file) {
        const res = await files.upload(file, {
          overwrite: true,
          transform:
            "c_auto,g_auto/f_auto,q_auto:eco/d_chapter:placeholders:post.webp",
        });

        if (res.code) return setError(apiUiMessage.ERROR_MESSAGE);

        body.imgUrl = res?.eager[0].secure_url;
      }

      if (props.caption) body.caption = props.caption;

      const newPost = await api.post(EndpointsEnum.CREATE_POST, body);
      newPost.data.postId = newPost.data.id;
      newPost.data.comments = [];
      setUserPostsList(prevPosts => [newPost.data, ...prevPosts]);

      setIsOpen(false);
      resetPostValues()
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrorBoundary(error);
        const errors = error.response?.data.errors;
        const [key] = Object.keys(errors);
        setError(errors[key] || apiUiMessage.ERROR_MESSAGE);
      }
    } finally {
      userPostsApi(EndpointsEnum.POSTS_BY_AUTHOR, setUserPostsList, page, undefined, 'addPost')
      setIsLoading(false);
    }
  };
  return (
    <div className={styles["preview"]}>
      <div className={styles["preview__image"]}>
        <PostImage {...props} />
      </div>
      <div className={styles["preview__user"]}>
        <PostFullName firstName={firstName} lastName={lastName} />
        <PostDate createAt={createAt} creatingPost />
      </div>
      <div className={styles["preview__title"]}>
        <PostTitle {...props} />
      </div>
      <PostText {...props} />
      <div className={styles["preview__buttons"]}>
        <UIbutton
          onClick={onHandleBackClick}
          dataAutomation="clickButton"
          fullWidth
          variant="outlined"
          aria-label="Back to previous page button"
        >
          Back
        </UIbutton>
        <UIbutton
          disabled={isLoading}
          isLoading={isLoading}
          onClick={onHandlePublishClick}
          dataAutomation="clickButton"
          aria-label="Publish post button"
          fullWidth
        >
          Publish
        </UIbutton>
      </div>
      {error ? <p className={styles["error"]}>{error}</p> : null}
    </div>
  );
};

export default PostPreview;
