import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const toastStyles = {
    info: {
      background: '#0074D9', 
      color: '#FFFFFF',
    },
    error: {
      background: '#FF4136', 
      color: '#FFFFFF',
    },
    warning: {
      background: '#FFDC00',
      color: '#333333',
    },
    success: {
      background: '#2ECC40',
      color: '#FFFFFF',
    },
};

const toastConfig = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    style: toastStyles,
};

const notify = (message, autoClose=5000) => {
    toast(message, { ...toastConfig, autoClose });
}

const notifySuccess = (message, autoClose=5000) => {
    toast.success(message, { ...toastConfig, autoClose });
};

const notifyError = (message, autoClose=5000) => {
    toast.error(message, { ...toastConfig, autoClose });
};

const notifyInfo = (message, autoClose=5000) => {
    toast.info(message, { ...toastConfig, autoClose });
};

const notifyWarn = (message, autoClose=5000) => {
    toast.warn(message, { ...toastConfig, autoClose });
};

export {
    ToastContainer, 
    notify, notifyError, notifyInfo, notifySuccess, notifyWarn
};