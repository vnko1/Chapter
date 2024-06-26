import * as Yup from "yup";
import { emailValidation } from "@/src/utils";
import { RegisterAccountKey } from "./RegisterForm.type";

export const validationSchema = (type: boolean) => {
  if (type)
    return Yup.object().shape({
      [RegisterAccountKey.HASH]: Yup.string()
        .required("Sign up code is required")
        .trim(),
    });

  return Yup.object().shape({
    [RegisterAccountKey.EMAIL]: Yup.string()
      .matches(emailValidation, "Please enter a valid email address.")
      .required("Email is required")
      .trim(),
  });
};
