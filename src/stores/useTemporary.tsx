import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

/**
 * None of the values in useTemporary are saved between page reloads.
 * However, calculation config/parameter & visual settings history
 * will be stored in `useSaved`.
 */
type CalculationStatus = "ready" | "calculating" | "needs calculating";

interface SphericalTrochoidPlotConfig {
    isActive: boolean;
    innerGeometry: {
        isActive: boolean;
        visible: boolean;
        shape: "Sphere" | "Torus";
        radius1: number;
        radius2: number;
    };
    outerGeometry: {
        isActive: boolean;
        visible: boolean;
        shape: "Circle" | "Sphere";
        radius: number;
    };
    dLine: {
        isActive: boolean;
        visible: boolean;
        radius: number;
        eqOuterGeometryRadius: boolean;
    };
    dPoint: {
        isActive: boolean;
        visible: boolean;
    };
    curve: {
        isActive: boolean;
        visible: boolean;
        thetaFunction: number | string;
        phiFunction: number | string;
    };
    fixedInterval: {
        isActive: boolean;
        stepSize: number;
        t: number;
        tMin: number;
        tMax: number;
        status: CalculationStatus;
        valueArrays: {
            outerCenterPoints: Float32Array;
            curvePoints: Float32Array;
        };
    };
    endless: {
        isActive: boolean;
    };
    updateFixedIntervalCalcStatus: (
        plotId: number,
        newStatus: CalculationStatus
    ) => void;
    updateFixedIntervalValueArrays: (
        plotId: number,
        outerCenterPoints: Float32Array,
        curvePoints: Float32Array
    ) => void;
}

interface PlotConfig {
    isActive: boolean;
    sphericalTrochoid: SphericalTrochoidPlotConfig;
}

type Plot = {
    [key: number]: PlotConfig;
};

interface TemporaryState {
    setActivePlotType: typeof setActivePlotType;
    plots: Plot;
}

const placeholderFloat32Array = new Float32Array([1, 0, 0, 1, 0, 0]);

const setActivePlotType = (plotId: number, plotType: string) => {
    useTemporary.setState((state) => {
        state.plots[plotId].sphericalTrochoid.isActive =
            plotType === "Spherical Trochoid";
    });
    console.log(useTemporary.getState().plots[plotId]);
};

export const useTemporary = create<TemporaryState>()(
    subscribeWithSelector(
        immer((set) => ({
            setActivePlotType: setActivePlotType,
            plots: {
                0: {
                    isActive: true,
                    sphericalTrochoid: {
                        isActive: true,
                        innerGeometry: {
                            isActive: true,
                            visible: true,
                            shape: "Sphere",
                            radius1: 4,
                            radius2: 1,
                        },
                        outerGeometry: {
                            isActive: true,
                            visible: true,
                            shape: "Circle",
                            radius: 1,
                        },
                        dLine: {
                            isActive: true,
                            visible: true,
                            radius: 1,
                            eqOuterGeometryRadius: true,
                        },
                        dPoint: {
                            isActive: true,
                            visible: true,
                        },
                        curve: {
                            isActive: true,
                            visible: true,
                            thetaFunction: "2t",
                            phiFunction: "t",
                        },
                        fixedInterval: {
                            isActive: true,
                            stepSize: 0.01,
                            t: 0,
                            tMin: 0,
                            tMax: 50,
                            status: "ready",
                            valueArrays: {
                                outerCenterPoints: placeholderFloat32Array,
                                curvePoints: placeholderFloat32Array,
                            },
                        },
                        endless: {
                            isActive: false,
                        },
                        updateFixedIntervalCalcStatus: (plotId, newStatus) =>
                            set((state) => {
                                state.plots[
                                    plotId
                                ].sphericalTrochoid.fixedInterval.status =
                                    newStatus;
                            }),
                        updateFixedIntervalValueArrays: (
                            plotId,
                            outerCenterPoints,
                            curvePoints
                        ) =>
                            set((state) => {
                                state.plots[
                                    plotId
                                ].sphericalTrochoid.fixedInterval.valueArrays.outerCenterPoints =
                                    outerCenterPoints;
                                state.plots[
                                    plotId
                                ].sphericalTrochoid.fixedInterval.valueArrays.curvePoints =
                                    curvePoints;
                            }),
                    },
                },
            },
        }))
    )
);
