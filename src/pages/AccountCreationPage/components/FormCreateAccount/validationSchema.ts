import * as Yup from "yup";
import { baseValidation } from "@/src/utils/regex/password-regex";
import simpleStringRegex from "@/src/utils/regex/simple-string";

export default Yup.object({
  fullname: Yup.string()
    .required("Please enter a valid name.")
    .matches(
      simpleStringRegex,
      "Fullname field cannot contain any special symbols or numbers"
    ),
  nickname: Yup.string().required("Please enter a valid Nickname"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      baseValidation,
      "Password must be at least 8 characters, including uppercase letters and special characters"
    ),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Passwords must match")
    .required("Confirm Password is required"),
});
