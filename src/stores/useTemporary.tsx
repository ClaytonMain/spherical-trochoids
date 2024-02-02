import { create } from "zustand";

/**
 * None of the values in useTemporary are saved between page reloads.
 */

interface TemporaryState {
    // UI
    perfMonitorVisible: boolean;

    // Calculation parameters
    t: number;
    tMin: number;
    tMax: number;
    innerGeometryType: "Sphere";
    innerGeometryRadius1: number;
    innerGeometryRadius2: number;
    outerGeometryType: "Sphere" | "Circle";
    outerGeometryRadius1: number;
    outerGeometryCurveDrawRadius: number;
}

export const useTemporary = create<TemporaryState>()(
    /**(set, get)*/ () => ({
        // UI
        perfMonitorVisible: true,

        // Calculation parameters
        t: 0,
        tMin: -10,
        tMax: 10,
        innerGeometryType: "Sphere",
        innerGeometryRadius1: 4,
        innerGeometryRadius2: 1,
        outerGeometryType: "Circle",
        outerGeometryRadius1: 1,
        outerGeometryCurveDrawRadius: 1,
    })
);
