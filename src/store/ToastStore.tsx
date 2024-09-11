import { create } from "zustand";

interface Toast {
  show: boolean;
  content: string;
  type: "success" | "error" | "info" | "warning";
}

interface ToastState {
  Toast: Toast;
  setToast: (toast: Toast) => void;
}

const useToastStore = create<ToastState>((set) => ({
  Toast: {
    show: false,
    content: "",
    type: "success",
  },
  setToast: (Toast: Toast) => set({ Toast }),
}));

export default useToastStore;
