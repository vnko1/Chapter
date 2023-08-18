import { FC } from "react";

import styles from "./WelcomePagePanel.module.scss";

import UIbutton from "@/src/components/Buttons/UIbutton/UIbutton";
import { Link } from "react-router-dom";

const WelcomePagePanel: FC = () => {
  return (
    <div className={styles["panel-container"]}>
      <div className={styles["panel"]}>
        <div className={styles["panel-description"]}>
          <h2>Welcome to Chapter</h2>
          <h3>Read, discuss, make new friends!</h3>
        </div>
        <div className={styles["panel-buttons"]}>
          <Link className="inline-flex w-full" to="/register">
            <UIbutton
              dataAutomation="navigationButton"
              variant="orange-contained"
              className="text-[20px] py-[18px] base:text-[25px] 
              base:max-w-[250px]"
            >
              Sign up
            </UIbutton>
          </Link>
          <Link className="inline-flex w-full" to="/login">
            <UIbutton
              dataAutomation="navigationButton"
              variant="orange-outlined"
              className="text-[20px] py-[18px] base:text-[25px]
              base:max-w-[250px]"
            >
              Log in
            </UIbutton>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePagePanel;
