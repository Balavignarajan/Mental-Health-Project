import toast from 'react-hot-toast';

export const showToast = {
  success: (message) => {
    toast.success(message);
  },
  
  error: (message) => {
    toast.error(message);
  },
  
  info: (message) => {
    toast(message, {
      icon: 'ℹ️',
      duration: 4000,
    });
  },
  
  loading: (message) => {
    return toast.loading(message);
  },
  
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
  
  promise: (promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Loading...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong!',
    });
  }
};