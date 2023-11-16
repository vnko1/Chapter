export enum EndpointsEnum {
  USERS = "users/",
  USERS_PROFILE = "users/profile/",
  UPLOAD_FILES = "files/upload",
  FILES = "files/",
  LOGIN = "auth/email/login",
  ADMIN_LOGIN = "auth/admin/email/login",
  REGISTRATION = "auth/email/register",
  REGISTRATION_FINALY = "auth/email/register/finaly",
  CONFIRM = "auth/email/confirm",
  FORGOT_PASSWORD = "auth/forgot/password",
  RESET_PASSWORD = "auth/reset/password",
  PROFILE = "users/me",
  UPDATE_PASSWORD = "users/update-password",
  REFRESH = "auth/refresh",
  LOGOUT = "auth/logout",
  FACEBOOK_LOGIN = "auth/facebook/login",
  GOOGLE_LOGIN = "auth/google/login",
  TWITTER_LOGIN = "auth/twitter/login",
  GOOGLE_RESTORE = "auth/restoring-user-by-google",
  EMAIL_RESTORE = "auth/restoring-user",
  CONFIRM_EMAIL_RESTORE = "auth/confirm-restoring-user",
}
