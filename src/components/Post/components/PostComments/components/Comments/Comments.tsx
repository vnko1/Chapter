import { FC, useRef } from "react";
import cn from "classnames";

import { CommentsProps } from "./Comments.type";
import { CommentType } from "@/src/types";
import { intersectionHandlerCB } from "@/src/utils";
import { useRefIntersection } from "@/src/hooks";
import styles from "./Comments.module.scss";

import { Comment } from "./components";

const itemClassNames = (value: number) => {
  return cn(styles["comments__item"], {
    [styles["indent"]]: value === 0,
    [styles["comments__sub-comments--first"]]: value === 1,
  });
};

const Comments: FC<CommentsProps> = (props) => {
  const startLoaderRef = useRef(null);

  useRefIntersection(intersectionHandlerCB(props.setPage), startLoaderRef, {
    commentsIsShow: props.showAllComments,
    threshold: 1,
  });

  const renderComments = (comments: Array<CommentType>, step: number) => {
    let counter: number = 0;

    counter += step;

    if (counter > 1) return;

    const sortedComments = counter
      ? comments.sort((a, b) => {
          const firstEl = new Date(a.createdAt).getTime();
          const secondEl = new Date(b.createdAt).getTime();

          return firstEl - secondEl;
        })
      : comments;

    const classNames = itemClassNames(counter);

    return (
      <>
        {props.showAllComments && !counter ? (
          <div className="hide-element" ref={startLoaderRef} data-value={1} />
        ) : null}
        <ul className={styles["comments__list"]}>
          {sortedComments.map((i) => {
            return (
              <li key={i.id} className={classNames}>
                <Comment {...props} {...i} />
                {i.comments?.length ? renderComments(i.comments, 1) : null}
              </li>
            );
          })}
        </ul>
      </>
    );
  };

  return renderComments(props.comments, 0);
};

export default Comments;
