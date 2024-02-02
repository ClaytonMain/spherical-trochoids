import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SavedState {
    someValue: number;
    setSomeValue: (value: number) => void;
    getSomeValue: () => number;
}

export const useSaved = create<SavedState>()(
    persist(
        (set, get) => ({
            someValue: 0,
            setSomeValue: (someValue) => set({ someValue }),
            getSomeValue: () => get().someValue,
        }),
        {
            name: "general-storage",
        }
    )
);
