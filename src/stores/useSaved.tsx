import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { defaultInputValues } from "../SphericalTrochoid/configs";
import { InputTypes } from "../SphericalTrochoid/sharedFunctions";

const addToPlotHistory = (inputs: InputTypes) => {
    const saveLastNPlots = useSaved.getState().saveLastNPlots;
    const plotHistory = [...useSaved.getState().plotHistory];
    plotHistory.unshift(inputs);
    if (plotHistory.length > saveLastNPlots) {
        plotHistory.pop();
    }
    useSaved.setState({
        currentPlot: inputs,
        plotHistory: plotHistory,
    });
    return null;
};

interface SavedState {
    saveLastNPlots: number;
    currentPlot: InputTypes;
    plotHistory: Array<InputTypes>;
    addToPlotHistory: typeof addToPlotHistory;
}

export const useSaved = create<SavedState>()(
    subscribeWithSelector(
        persist(
            () => ({
                saveLastNPlots: 10,
                currentPlot: defaultInputValues,
                plotHistory: [
                    defaultInputValues,
                    defaultInputValues,
                    defaultInputValues,
                    defaultInputValues,
                ],
                addToPlotHistory: addToPlotHistory,
            }),
            {
                name: "general-storage",
            }
        )
    )
);
