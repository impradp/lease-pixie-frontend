import { LeasePixieToastMsg } from "@/types/LeasePixieToastMsg";

const target = {
  //100000 series for root level msg handle
  100000: {
    type: "error",
    message: "Required fields (*) are empty.",
  } as LeasePixieToastMsg,

  //100100 series for account
  100100: {
    type: "success",
    message: "Account created successfully.",
  } as LeasePixieToastMsg,
  100101: {
    type: "info",
    message: "User redirected to account dashboard.",
  } as LeasePixieToastMsg,
  100102: { type: "error", message: "Invalid account." } as LeasePixieToastMsg,
  100103: {
    type: "error",
    message: "Error fetching accounts.",
  } as LeasePixieToastMsg,
  100104: {
    type: "error",
    message: "Exception occurred while fetching accounts.",
  } as LeasePixieToastMsg,
  100105: {
    type: "error",
    message: "Account creation failed.",
  } as LeasePixieToastMsg,
  100106: {
    type: "error",
    message: "Exception occurred while creating account.",
  } as LeasePixieToastMsg,
  100107: {
    type: "success",
    message: "Account updated successfully.",
  } as LeasePixieToastMsg,
  100108: {
    type: "error",
    message: "Account update failed.",
  } as LeasePixieToastMsg,
  100109: {
    type: "error",
    message: "Exception occurred while updating account.",
  } as LeasePixieToastMsg,
  100110: {
    type: "info",
    message: "Account access locked successfully.",
  } as LeasePixieToastMsg,
  100111: {
    type: "success",
    message: "Account access un-locked successfully.",
  } as LeasePixieToastMsg,
  100112: {
    type: "error",
    message: "Failed to update account access.",
  } as LeasePixieToastMsg,
  100113: {
    type: "error",
    message: "Exception occurred while updating account access.",
  } as LeasePixieToastMsg,

  //100200 series for user access
  100200: {
    type: "success",
    message: "User access approved.",
  } as LeasePixieToastMsg,
  100201: {
    type: "error",
    message: "User access denied.",
  } as LeasePixieToastMsg,
  100202: {
    type: "success",
    message: "Logged out successfully.",
  } as LeasePixieToastMsg,

  //100300 series for login handle message
  100300: {
    type: "success",
    message: "Login successful.",
  } as LeasePixieToastMsg,
  100301: { type: "error", message: "Login failed." } as LeasePixieToastMsg,
  100302: {
    type: "error",
    message: "Failed to sign out. Please try again.",
  } as LeasePixieToastMsg,
  100303: {
    type: "success",
    message: "Logout successful.",
  } as LeasePixieToastMsg,

  //100400 series for reset handle message
  100400: {
    type: "success",
    message: "SMS sent sucessfully.",
  } as LeasePixieToastMsg,
  100401: {
    type: "error",
    message: "Reset code verification failed.",
  } as LeasePixieToastMsg,
  100402: { type: "error", message: "Reset failed." } as LeasePixieToastMsg,
  100403: {
    type: "error",
    message: "SMS sending failed.",
  } as LeasePixieToastMsg,
  100404: {
    type: "info",
    message:
      "We have sent a reset code via e-mail if the provided information is valid.",
  } as LeasePixieToastMsg,
  100405: {
    type: "error",
    message: "Reset code is invalid. Please try again.",
  } as LeasePixieToastMsg,

  //100500 series for portfolio handle message
  100500: {
    type: "success",
    message: "Portfolio created successfully.",
  } as LeasePixieToastMsg,
  100501: {
    type: "error",
    message: "Error fetching portfolio users.",
  } as LeasePixieToastMsg,
  100502: {
    type: "error",
    message: "Exception occurred while fetching portfolio users.",
  } as LeasePixieToastMsg,
  100503: {
    type: "error",
    message: "Error fetching portfolio vendors.",
  } as LeasePixieToastMsg,
  100504: {
    type: "error",
    message: "Exception occurred while fetching portfolio vendors.",
  } as LeasePixieToastMsg,
  100505: {
    type: "error",
    message: "Error creating portfolio.",
  } as LeasePixieToastMsg,
  100506: {
    type: "error",
    message: "Exception occurred while creating portfolio.",
  } as LeasePixieToastMsg,
  100507: {
    type: "success",
    message: "New portfolio user added successfully.",
  } as LeasePixieToastMsg,
  100508: {
    type: "error",
    message: "Error adding new portfolio user.",
  } as LeasePixieToastMsg,
  100509: {
    type: "error",
    message: "Exception occured adding new portfolio user.",
  } as LeasePixieToastMsg,
  100510: {
    type: "success",
    message: "New portfolio vendor added successfully.",
  } as LeasePixieToastMsg,
  100511: {
    type: "error",
    message: "Error adding new portfolio vendor.",
  } as LeasePixieToastMsg,
  100512: {
    type: "error",
    message: "Exception occured adding new portfolio vendor.",
  } as LeasePixieToastMsg,

  //100600 series for property handle message
  100600: {
    type: "success",
    message: "New property user added successfully.",
  } as LeasePixieToastMsg,
  100601: {
    type: "error",
    message: "Error adding new property user.",
  } as LeasePixieToastMsg,
  100602: {
    type: "error",
    message: "Exception occurred adding new property user.",
  } as LeasePixieToastMsg,
} as const;

export type MessageCode = keyof typeof target;

/**
 * Decodes an error code into a message.
 * @param code - The error code to decode.
 * @returns The corresponding message, or a default message if not found.
 */
export function decodeMsg(code: MessageCode): LeasePixieToastMsg {
  return target[code];
}
