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
  100114: {
    type: "info",
    message: "Account user deleted successfully.",
  } as LeasePixieToastMsg,
  100115: {
    type: "error",
    message: "Failed to delete account user.",
  } as LeasePixieToastMsg,
  100116: {
    type: "error",
    message: "Exception occured while deleting account user.",
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
  100203: {
    type: "success",
    message: "Read-Only Admin user created successfully.",
  } as LeasePixieToastMsg,
  100204: {
    type: "error",
    message: "Failed to create Read-Only Admin user.",
  } as LeasePixieToastMsg,
  100205: {
    type: "error",
    message: "Exception occured creating Read-Only Admin user.",
  } as LeasePixieToastMsg,
  100206: {
    type: "error",
    message: "Failed to fetch Read-Only Admin user.",
  } as LeasePixieToastMsg,
  100207: {
    type: "error",
    message: "Exception occured fetching Read-Only Admin user.",
  } as LeasePixieToastMsg,
  100208: {
    type: "info",
    message: "Read-only admin user deleted successfully.",
  } as LeasePixieToastMsg,
  100209: {
    type: "error",
    message: "Error deleting read-only admin user.",
  } as LeasePixieToastMsg,
  100210: {
    type: "error",
    message: "Exception occured deleting read-only admin user.",
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
    message: "Error fetching vendors.",
  } as LeasePixieToastMsg,
  100504: {
    type: "error",
    message: "Exception occurred while fetching vendors.",
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
    message: "New vendor added successfully.",
  } as LeasePixieToastMsg,
  100511: {
    type: "error",
    message: "Error adding new vendor.",
  } as LeasePixieToastMsg,
  100512: {
    type: "error",
    message: "Exception occured adding new vendor.",
  } as LeasePixieToastMsg,
  100513: {
    type: "error",
    message: "Failed to fetch portfolios.",
  } as LeasePixieToastMsg,
  100514: {
    type: "error",
    message: "Exception occured while fetching portfolios.",
  } as LeasePixieToastMsg,
  100515: {
    type: "success",
    message: "Portfolio user deleted successfully.",
  } as LeasePixieToastMsg,
  100516: {
    type: "error",
    message: "Error occured deleting portfolio user.",
  } as LeasePixieToastMsg,
  100517: {
    type: "error",
    message: "Exception occured deleting portfolio user.",
  } as LeasePixieToastMsg,
  100518: {
    type: "success",
    message: "Vendor restored successfully.",
  } as LeasePixieToastMsg,
  100519: {
    type: "error",
    message: "Error restoring vendor.",
  } as LeasePixieToastMsg,
  100520: {
    type: "error",
    message: "Exception occured restoring vendor.",
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
  100603: {
    type: "error",
    message: "Error fetching properties.",
  } as LeasePixieToastMsg,
  100604: {
    type: "error",
    message: "Exception occured fetching properties.",
  } as LeasePixieToastMsg,

  //100700 series for deposit account handle message
  100700: {
    type: "success",
    message: "Deposit account added successfully.",
  } as LeasePixieToastMsg,
  100701: {
    type: "error",
    message: "Failed to fetch deposit account.",
  } as LeasePixieToastMsg,
  100702: {
    type: "error",
    message: "Exception occured while fetching deposit account.",
  } as LeasePixieToastMsg,
  100703: {
    type: "error",
    message: "Failed to create deposit account.",
  } as LeasePixieToastMsg,
  100704: {
    type: "error",
    message: "Exception occured while creating deposit account.",
  } as LeasePixieToastMsg,
  100705: {
    type: "success",
    message: "Payment processing enabled successfully.",
  } as LeasePixieToastMsg,
  100706: {
    type: "info",
    message: "Payment processing disabled successfully.",
  } as LeasePixieToastMsg,
  100707: {
    type: "error",
    message: "Error updating payment processing flag.",
  } as LeasePixieToastMsg,
  100708: {
    type: "error",
    message: "Exception occured updating payment processing flag.",
  } as LeasePixieToastMsg,
  100709: {
    type: "success",
    message: "Merchant onboarded successfully.",
  } as LeasePixieToastMsg,
  100710: {
    type: "error",
    message: "Error onboarding merchant.",
  } as LeasePixieToastMsg,
  100711: {
    type: "error",
    message: "Exception occured onboarding merchant.",
  } as LeasePixieToastMsg,

  //100800 series for deposit account handle message
  100800: {
    type: "info",
    message: "Vendor deleted successfully.",
  } as LeasePixieToastMsg,
  100801: {
    type: "error",
    message: "Error occured while deleting vendor.",
  } as LeasePixieToastMsg,
  100802: {
    type: "error",
    message: "Exception occured while deleting vendor.",
  } as LeasePixieToastMsg,
  100803: {
    type: "success",
    message: "Vendor updated successfully.",
  } as LeasePixieToastMsg,
  100804: {
    type: "error",
    message: "Error updating vendor.",
  } as LeasePixieToastMsg,
  100805: {
    type: "error",
    message: "Exception occured while updating vendor.",
  } as LeasePixieToastMsg,
  100806: {
    type: "error",
    message: "Error fetching vendor.",
  } as LeasePixieToastMsg,
  100807: {
    type: "error",
    message: "Exception occured while fetching vendor.",
  } as LeasePixieToastMsg,

  //100900 series for plaid service handle message
  100900: {
    type: "info",
    message: "Hold on. Redirecting to secure plaid setup .",
  } as LeasePixieToastMsg,
  100901: {
    type: "error",
    message: "Error creating link token.",
  } as LeasePixieToastMsg,
  100902: {
    type: "error",
    message: "Exception occured creating link token.",
  } as LeasePixieToastMsg,
  100903: {
    type: "info",
    message: "Plaid Setup cancelled by user.",
  } as LeasePixieToastMsg,
  100904: {
    type: "success",
    message: "Plaid link generated sucessfully.",
  } as LeasePixieToastMsg,
  100905: {
    type: "info",
    message: "Plaid link removed sucessfully.",
  } as LeasePixieToastMsg,
  100906: {
    type: "error",
    message: "Error removing plaid link.",
  } as LeasePixieToastMsg,
  100907: {
    type: "error",
    message: "Exception occured removing plaid link.",
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
