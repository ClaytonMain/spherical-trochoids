import { StoreType } from "leva/dist/declarations/src/types";
import { Parser, parser } from "mathjs";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

/**
 * None of the values in useTemporary are saved between page reloads.
 * However, calculation config/parameter & visual settings history
 * will be stored in `useSaved`.
 */
type CalculationStatus = "ready" | "calculating" | "needs calculating";

interface LevaStores {
    camera: StoreType | undefined;
    animation: StoreType | undefined;
    parameterHistory: StoreType | undefined;
    input: StoreType | undefined;
    randomization: StoreType | undefined;
    style: StoreType | undefined;
}

interface TemporaryState {
    levaStores: LevaStores;
    calculationStatus: CalculationStatus;
    fixedIntervalCurvePoints: Float32Array;
    uselessVariable: number;
    uselessFunction: () => void;
    t: number;
    ind: number;
    lValues: Float32Array;
    parser: Parser;
    scrubbing: boolean;
}

const placeholderFloat32Array = new Float32Array([1, 0, 0, 1, 0, 0]);

export const useTemporary = create<TemporaryState>()(
    subscribeWithSelector(
        immer((set) => ({
            levaStores: {
                camera: undefined,
                animation: undefined,
                parameterHistory: undefined,
                randomization: undefined,
                input: undefined,
                style: undefined,
            },
            calculationStatus: "ready",
            fixedIntervalCurvePoints: placeholderFloat32Array,
            uselessVariable: Math.random(),
            uselessFunction: () =>
                set((state) => (state.uselessVariable = Math.random())),
            t: -50,
            ind: 0,
            lValues: placeholderFloat32Array,
            parser: parser(),
            scrubbing: false,
        }))
    )
);
