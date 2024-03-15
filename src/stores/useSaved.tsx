import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { InputTypes, defaultInputValues } from "../SphericalTrochoid/shared";

const addToPlotHistory = (inputs: InputTypes) => {
    // const saveLastNPlots = useSaved.getState().saveLastNPlots;
    const plotHistory = useSaved.getState().plotHistory;

    plotHistory.unshift(inputs);
    plotHistory.pop();

    useSaved.setState({ plotHistory: plotHistory });

    console.log(useSaved.getState().plotHistory);

    return null;
};

interface SavedState {
    saveLastNPlots: number;
    plotHistory: Array<InputTypes>;
    addToPlotHistory: typeof addToPlotHistory;
    someValue: number;
    setSomeValue: (value: number) => void;
    getSomeValue: () => number;
}

export const useSaved = create<SavedState>()(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                saveLastNPlots: 10,
                plotHistory: [defaultInputValues],
                addToPlotHistory: addToPlotHistory,
                someValue: 0,
                setSomeValue: (someValue) => set({ someValue }),
                getSomeValue: () => get().someValue,
            }),
            {
                name: "general-storage",
            }
        )
    )
);
