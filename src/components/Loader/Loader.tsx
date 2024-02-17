import { FC, useRef } from "react";
import ContentLoader from "react-content-loader";

import { ILoaderProps } from "./Loader.type";
import styles from "./Loader.module.scss";

import { Animation } from "@/src/components";

const Loader: FC<ILoaderProps> = ({
  height = 160,
  width = 400,
  speed = 2,
  interval = 0.1,
  isShown = false,
  timeTransition = 150,
  wrapperClassNames,
  loaderClassNames,
  ...props
}) => {
  const nodeRef = useRef(null);
  const transitionClassNames = {
    enter: styles["loader-enter"],
    enterActive: styles["loader-enter-active"],
    exit: styles["loader-exit"],
    exitActive: styles["loader-exit-active"],
  };

  return (
    <Animation
      nodeRef={nodeRef}
      in={isShown}
      timeout={timeTransition}
      classNames={transitionClassNames}
      mountOnEnter
      unmountOnExit
    >
      <div ref={nodeRef} className={`${styles["loader"]} ${wrapperClassNames}`}>
        <ContentLoader
          viewBox="0 0 400 160"
          height={height}
          width={width}
          backgroundColor="transparent"
          className={loaderClassNames}
          speed={speed}
          interval={interval}
          title=""
          {...props}
        >
          <circle cx="150" cy="86" r="8" />
          <circle cx="194" cy="86" r="8" />
          <circle cx="238" cy="86" r="8" />
        </ContentLoader>
      </div>
    </Animation>
  );
};

export default Loader;