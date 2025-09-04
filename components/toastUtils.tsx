import React from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";

// Shared toast options type
type ToastDescription = string | React.ReactNode;
type ToastMessage = string | React.ReactNode;
type ToastOptions = Partial<Parameters<typeof toast>[1]>;

interface PromiseMessages {
  loading?: ToastMessage;
  success?: ToastMessage;
  error?: ToastMessage;
}

const baseStyle =
  "flex items-center gap-3 rounded-lg shadow-lg px-4 py-3 border-l-4 animate-slide-in";

export const toastUtils = {
  success: (message: ToastMessage, description?: ToastDescription) => {
    toast.success(message, {
      description,
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      className: `${baseStyle} bg-green-50 border-green-500 text-green-800`,
      duration: 4000,
    });
  },

  error: (message: ToastMessage, description?: ToastDescription) => {
    toast.error(message, {
      description,
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      className: `${baseStyle} bg-red-50 border-red-500 text-red-800`,
      duration: 5000,
    });
  },

  warning: (message: ToastMessage, description?: ToastDescription) => {
    toast.warning(message, {
      description,
      icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      className: `${baseStyle} bg-yellow-50 border-yellow-500 text-yellow-800`,
      duration: 4500,
    });
  },

  info: (message: ToastMessage, description?: ToastDescription) => {
    toast.info(message, {
      description,
      icon: <Info className="w-5 h-5 text-blue-500" />,
      className: `${baseStyle} bg-blue-50 border-blue-500 text-blue-800`,
      duration: 4000,
    });
  },

  custom: (message: ToastMessage, options: ToastOptions = {}) => {
    toast(message, {
      className: `${baseStyle} bg-gray-50 border-gray-400 text-gray-800`,
      duration: 4000,
      ...options,
    });
  },

  promise: <T,>(promise: Promise<T>, messages: PromiseMessages) => {
    return toast.promise(promise, {
      loading: (
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
          <span>{messages.loading || "Loading..."}</span>
        </div>
      ),
      success: messages.success || "Success!",
      error: messages.error || "Something went wrong",
      className: `${baseStyle} bg-indigo-50 border-indigo-500 text-indigo-800`,
      duration: 4000,
    });
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },

  dismissAll: () => {
    toast.dismiss();
  },
};
