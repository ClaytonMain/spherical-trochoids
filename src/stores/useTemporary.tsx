import { StoreType } from "leva/dist/declarations/src/types";
import { Parser, parser } from "mathjs";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

/**
 * None of the values in useTemporary are saved between page reloads.
 */
type CalculationState =
    | "ready"
    | "calculating"
    | "calculate input"
    | "calculate random";

interface LevaStores {
    lights: StoreType | undefined;
    camera: StoreType | undefined;
    animation: StoreType | undefined;
    parameterHistory: StoreType | undefined;
    input: StoreType | undefined;
    randomization: StoreType | undefined;
    style: StoreType | undefined;
}

interface TemporaryState {
    levaStores: LevaStores;
    calculationState: CalculationState;
    fixedIntervalCurvePoints: Float32Array;
    uselessVariable: number;
    uselessFunction: () => void;
    t: number;
    ind: number;
    lValues: Float32Array;
    transformMatrixValues: Float32Array;
    parser: Parser;
    scrubbing: boolean;
    autoRotate: boolean;
    autoRotateSpeed: number;
    autoZoomToFit: boolean;
    repositionCamera: boolean;
    randomizeIn: number;
}

const placeholderFloat32Array = new Float32Array([1, 0, 0, 1, 0, 0]);

export const useTemporary = create<TemporaryState>()(
    subscribeWithSelector(
        immer((set) => ({
            levaStores: {
                lights: undefined,
                camera: undefined,
                animation: undefined,
                parameterHistory: undefined,
                randomization: undefined,
                input: undefined,
                style: undefined,
            },
            calculationState: "ready",
            fixedIntervalCurvePoints: placeholderFloat32Array,
            uselessVariable: Math.random(),
            uselessFunction: () =>
                set((state) => (state.uselessVariable = Math.random())),
            t: -10,
            ind: 0,
            lValues: placeholderFloat32Array,
            transformMatrixValues: placeholderFloat32Array,
            parser: parser(),
            scrubbing: false,
            autoRotate: true,
            autoRotateSpeed: 1.0,
            autoZoomToFit: true,
            repositionCamera: false,
            randomizeIn: 30,
        }))
    )
);
