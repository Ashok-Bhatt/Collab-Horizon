import { toast, Zoom } from "react-toastify";

const showErrorToast = (toastText) => {
    toast.error(toastText, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Zoom,
    })
}

const showAcceptToast = (toastText) => {
    toast.success(toastText, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Zoom,
    })
}

export {
    showErrorToast,
    showAcceptToast
}