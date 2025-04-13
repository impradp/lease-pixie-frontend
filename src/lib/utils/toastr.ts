import { ReadonlyURLSearchParams } from "next/navigation";

import toastr from "@/lib/func/toastr";
import { decodeMsg, MessageCode } from "@/lib/constants/message";

const shownToasts = new Set<string>();

const handleToast = (searchParams: ReadonlyURLSearchParams) => {
  const code = searchParams.get("msg");
  if (code && Number(code) && !shownToasts.has(code)) {
    const info = decodeMsg(Number(code) as MessageCode);
    if (info) {
      toastr({
        message: info.message,
        toastrType: info.type,
      });
      shownToasts.add(code); // Mark this code as shown
    }
  }
};

export default handleToast;
