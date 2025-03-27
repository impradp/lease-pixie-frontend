import { toast, Bounce } from "react-toastify";

interface ToastrProps {
  message: string;
  duration?: number;
  toastrType?: "success" | "info" | "warning" | "error";
  onClose?: () => void;
}

const toastr = ({
  message,
  duration = 5000,
  toastrType = "success",
  onClose,
}: ToastrProps) => {
  toast(
    <div
      style={{
        width: "322px",
        height: "14px",
        color: "#0C111D",
        fontSize: "13px",
        fontFamily: "Inter",
        fontWeight: 500,
        lineHeight: "14px",
        wordWrap: "break-word",
      }}
    >
      {message}
    </div>,
    {
      position: "top-right",
      autoClose: duration,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
      onClose: onClose,
      className: "custom-toastr",
      type: toastrType,
    }
  );
};

export default toastr;
