import { create } from "zustand";

interface PopupProps {
  show: boolean;
  type: string;
  title: string;
  content: string;
  submit: () => void;
  setShow: (show: boolean) => void;
  setType: (type: string) => void;
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setSubmit: (submit: () => void) => void;
}

const useConfirmPopupStore = create<PopupProps>((set) => ({
  show: false,
  type: "",
  title: "",
  content: "",
  submit: () => {},
  setShow: (show: boolean) => set({ show }),
  setType: (type: string) => set({ type }),
  setTitle: (title: string) => set({ title }),
  setContent: (content: string) => set({ content }),
  setSubmit: (submit: () => void) => set({ submit }),
}));

export default useConfirmPopupStore;
