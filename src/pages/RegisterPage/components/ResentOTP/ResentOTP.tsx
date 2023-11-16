import { FC, useState } from "react";
import { AxiosError } from "axios";

import { ResentOTPProps } from "./ResentOTP.type";
import { EndpointsEnum, api } from "@/src/axios";
import { apiErrorStatus } from "@/src/types";
import { useAppDispatch, userError } from "@/src/redux";
import styles from "./ResentOTP.module.scss";
import { Loader, ModalWindow, UIbutton } from "@/src/components";

const ResentOTP: FC<ResentOTPProps> = ({ email }) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onHandleClick = async () => {
    setIsLoading(true);
    try {
      await api.patch(EndpointsEnum.RESENT_OTP, { email });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data.status === apiErrorStatus.TOO_MANY_REQUEST)
          return setIsOpen(true);

        dispatch(
          userError(
            error.response?.data.error ||
              error.response?.data.message ||
              error.response?.statusText ||
              error.message
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = () => setIsOpen(false);

  return (
    <div className={styles["resent-wrapper"]}>
      <p className={styles["resent-wrapper__message"]}>
        3 attempt per 24 hours.
      </p>
      <p className={styles["resent-wrapper__btn-text"]}>
        Send the code again?{" "}
        <button
          onClick={onHandleClick}
          disabled={isLoading}
          className={styles["resent-wrapper__button"]}
        >
          Click here.
        </button>
      </p>
      <ModalWindow isOpen={isOpen} setIsOpen={setIsOpen}>
        <p className={styles["modal-text"]}>
          You have exhausted all attempts. <br />
          Try again tomorrow.
        </p>
        <div className={styles["modal-btn"]}>
          <UIbutton dataAutomation="clickButton" onClick={onClick} fullWidth>
            Confirm
          </UIbutton>
        </div>
      </ModalWindow>
      <Loader isShown={isLoading} />
    </div>
  );
};

export default ResentOTP;
