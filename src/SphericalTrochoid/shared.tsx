import { DataInput } from "leva/dist/declarations/src/types";
import { useTemporary } from "../stores/useTemporary";

export const inputKeys = [
    "calculationType",
    "stepSize",
    "innerGeometryShape",
    "innerGeometryRadius1",
    "innerGeometryRadius2",
    "outerGeometryShape",
    "outerGeometryRadius",
    "dLineSetRadius",
    "dLineRadius",
    "curveTheta",
    "curvePhi",
    "curveTRange",
    "curveTStart",
];

export interface InputTypes {
    calculationType: "Fixed Interval" | "Endless";
    stepSize: number;
    innerGeometryShape: "Sphere" | "Torus";
    innerGeometryRadius1: number;
    innerGeometryRadius2: number;
    outerGeometryShape: "Circle" | "Sphere";
    outerGeometryRadius: number;
    dLineSetRadius: boolean;
    dLineRadius: number;
    curveTheta: string;
    curvePhi: string;
    curveTRange: [number, number];
    curveTStart: number;
}

export const defaultInputValues: InputTypes = {
    calculationType: "Fixed Interval",
    stepSize: 0.01,
    innerGeometryShape: "Sphere",
    innerGeometryRadius1: 4,
    innerGeometryRadius2: 1,
    outerGeometryShape: "Circle",
    outerGeometryRadius: 1,
    dLineSetRadius: true,
    dLineRadius: 1,
    curveTheta: "2t",
    curvePhi: "t",
    curveTRange: [-10, 40],
    curveTStart: -10,
};

export const getCurrentInputs = () => {
    const inputStoreData = useTemporary.getState().levaStores.input?.getData();
    const currentInputs = {};

    if (!inputStoreData) {
        return;
    }

    Object.keys(inputStoreData).forEach((k) => {
        const inputKey = (inputStoreData[k] as DataInput).key;
        if (!inputKeys.includes(inputKey)) {
            return;
        }
        const inputValue = (inputStoreData[k] as DataInput).value;
        // @ts-expect-error Error because indexing by string.
        currentInputs[inputKey] = inputValue;
    });

    return currentInputs as InputTypes;
};
