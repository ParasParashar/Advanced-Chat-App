import { create } from "zustand";

type props = {
  isOpen: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onClose: () => void;
};

const useSidebarHook = create<props>((set) => ({
  isOpen: false,
  onToggle: () => set((state) => ({ isOpen: !state.isOpen })),
  onClose: () => set(() => ({ isOpen: false })),
  onOpen: () => set(() => ({ isOpen: true })),
}));

export default useSidebarHook;
