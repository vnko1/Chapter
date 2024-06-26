import { CommentType, RefsType } from "@/src/types";
import { CommentsProps } from "../../Comments.type";

export type CommentProps = {
  hideCommentBtn?: boolean;
} & Required<
  Pick<
    CommentsProps,
    "postId" | "setPage" | "handleNickname" | "setAllComments" | "postAuthor"
  >
> &
  Pick<CommentsProps, "setPosts" | "setPost"> &
  CommentType &
  Omit<RefsType, "nodeRef">;
