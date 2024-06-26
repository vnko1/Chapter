import { FC } from "react";

import "@/src/extensions/string.extensions";
import { FeedProvider } from "./context";
import styles from "./FeedPage.module.scss";

import { Feeds } from "./components";

const FeedPage: FC = () => {
  return (
    <FeedProvider>
      <section className={styles["feeds"]}>
        <div className={styles["container"]}>
          <Feeds />
        </div>
      </section>
    </FeedProvider>
  );
};

export default FeedPage;
