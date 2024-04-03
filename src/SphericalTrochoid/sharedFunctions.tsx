import { DataInput } from "leva/dist/declarations/src/types";
import * as math from "mathjs";
import { useTemporary } from "../stores/useTemporary";

export const innerGeometryShapes = ["Sphere", "Torus"];
export const outerGeometryShapes = ["Sphere", "Circle"];

export const inputKeys = [
    "calculationType",
    "stepSize",
    "innerGeometryShape",
    "innerGeometryRadius1",
    "innerGeometryRadius2",
    "outerGeometryShape",
    "outerGeometryRadius",
    "dEqualsOuterGeometryRadius",
    "dLineRadius",
    "curveTheta",
    "curvePhi",
    "curveTRange",
    "curveTStart",
];

export const randomizationKeys = [
    "autoRandomize",
    "autoRandomizeType",
    "randomizeAtTValue",
    "randomizeEveryNSeconds",
    "randomizingInSeconds",
    "innerGeometryRandomize",
    "innerGeometryRandomizeShape",
    "innerGeometryRandomizeRadius1",
    "innerGeometryRadius1Range",
    "innerGeometryRandomizeRadius2",
    "innerGeometryRadius2Range",
    "outerGeometryRandomize",
    "outerGeometryRandomizeShape",
    "outerGeometryRandomizeRadius",
    "outerGeometryRadiusRange",
    "dLineRandomize",
    "dLineEqualsOuterGeometryRadius",
    "dLineRandomizeRadius",
    "dLineRadiusRange",
    "curveRandomize",
    "curveRandomizeTheta",
    "curveRandomizePhi",
    "curveRandomizeTStart",
    "curveTStartRange",
    "curveRandomizeTInterval",
    "curveTIntervalRange",
] as const;

export type CalculationType = "Fixed Interval" | "Endless";

export interface InputTypes {
    calculationType: CalculationType;
    stepSize: number;
    innerGeometryShape: "Sphere" | "Torus";
    innerGeometryRadius1: number;
    innerGeometryRadius2: number;
    outerGeometryShape: "Circle" | "Sphere";
    outerGeometryRadius: number;
    dEqualsOuterGeometryRadius: boolean;
    dLineRadius: number;
    curveTheta: string;
    curvePhi: string;
    curveTRange: [number, number];
    curveTStart: number;
}

export interface DefaultRandomizationSettingType {
    disabled: boolean;
    render: boolean;
}
export interface RandomizationSettingsTypes {
    autoRandomize: { value: boolean } & DefaultRandomizationSettingType;
    autoRandomizeType: {
        value: "At t Max" | "At t Value" | "Every n Seconds";
    } & DefaultRandomizationSettingType;
    randomizeAtTValue: { value: number } & DefaultRandomizationSettingType;
    randomizeEveryNSeconds: { value: number } & DefaultRandomizationSettingType;
    randomizingInSeconds: { value: number } & DefaultRandomizationSettingType;
    innerGeometryRandomize: {
        value: boolean;
    } & DefaultRandomizationSettingType;
    innerGeometryRandomizeShape: {
        value: boolean;
    } & DefaultRandomizationSettingType;
    innerGeometryRandomizeRadius1: {
        value: boolean;
    } & DefaultRandomizationSettingType;
    innerGeometryRadius1Range: {
        value: [number, number];
    } & DefaultRandomizationSettingType;
    innerGeometryRandomizeRadius2: {
        value: boolean;
    } & DefaultRandomizationSettingType;
    innerGeometryRadius2Range: {
        value: [number, number];
    } & DefaultRandomizationSettingType;
    outerGeometryRandomize: {
        value: boolean;
    } & DefaultRandomizationSettingType;
    outerGeometryRandomizeShape: {
        value: boolean;
    } & DefaultRandomizationSettingType;
    outerGeometryRandomizeRadius: {
        value: boolean;
    } & DefaultRandomizationSettingType;
    outerGeometryRadiusRange: {
        value: [number, number];
    } & DefaultRandomizationSettingType;
    dLineRandomize: { value: boolean } & DefaultRandomizationSettingType;
    dLineEqualsOuterGeometryRadius: {
        value: boolean;
    } & DefaultRandomizationSettingType;
    dLineRandomizeRadius: { value: boolean } & DefaultRandomizationSettingType;
    dLineRadiusRange: {
        value: [number, number];
    } & DefaultRandomizationSettingType;
    curveRandomize: { value: boolean } & DefaultRandomizationSettingType;
    curveRandomizeTheta: { value: boolean } & DefaultRandomizationSettingType;
    curveRandomizePhi: { value: boolean } & DefaultRandomizationSettingType;
    curveRandomizeTStart: { value: boolean } & DefaultRandomizationSettingType;
    curveTStartRange: {
        value: [number, number];
    } & DefaultRandomizationSettingType;
    curveRandomizeTInterval: {
        value: boolean;
    } & DefaultRandomizationSettingType;
    curveTIntervalRange: {
        value: [number, number];
    } & DefaultRandomizationSettingType;
}

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

type StringOrNumber = string | number;
const spherePtzationFormatter = (
    theta: StringOrNumber,
    phi: StringOrNumber,
    R1: StringOrNumber,
    r: StringOrNumber
) => ({
    outerCenter: [
        `( ( ${R1} ) + ( ${r} ) ) * cos( ${theta} ) * cos( ${phi} )`,
        `( ( ${R1} ) + ( ${r} ) ) * sin( ${theta} ) * cos( ${phi} )`,
        `( ( ${R1} ) + ( ${r} ) ) * sin( ${phi} )`,
    ],
    contactPoint: [
        `( ${R1} ) * cos( ${theta} ) * cos( ${phi} )`,
        `( ${R1} ) * sin( ${theta} ) * cos( ${phi} )`,
        `( ${R1} ) * sin( ${phi} )`,
    ],
    basisX: [
        `cos( ${theta} ) * cos( ${phi} )`,
        `sin( ${theta} ) * cos( ${phi} )`,
        `sin( ${phi} )`,
    ],
});
const torusPtzationFormatter = (
    theta: StringOrNumber,
    phi: StringOrNumber,
    R1: StringOrNumber,
    R2: StringOrNumber,
    r: StringOrNumber
) => ({
    outerCenter: [
        `( ${R1} + ( ${R2} + ${r} ) * cos( ${phi} ) ) * cos( ${theta} )`,
        `( ${R1} + ( ${R2} + ${r} ) * cos( ${phi} ) ) * sin( ${theta} )`,
        `( ${R2} + ${r} ) * sin(${phi})`,
    ],
    contactPoint: [
        `( ${R1} + ${R2} * cos( ${phi} ) ) * cos( ${theta} )`,
        `( ${R1} + ${R2} * cos( ${phi} ) ) * sin( ${theta} )`,
        `${R2} * sin(${phi})`,
    ],
    basisX: [
        `cos( ${theta} ) * cos( ${phi} )`,
        `sin( ${theta} ) * cos( ${phi} )`,
        `sin( ${phi} )`,
    ],
});

interface SpherePtzationParams {
    shape: "Sphere";
    theta: string;
    phi: string;
    R1: number;
    r: number;
}

interface TorusPtzationParams {
    shape: "Torus";
    theta: string;
    phi: string;
    R1: number;
    R2: number;
    r: number;
}

const getPtzations = (params: SpherePtzationParams | TorusPtzationParams) => {
    let ptzations = null;
    if (params.shape === "Sphere") {
        ptzations = spherePtzationFormatter(
            params.theta,
            params.phi,
            params.R1,
            params.r
        );
    } else if (params.shape === "Torus") {
        ptzations = torusPtzationFormatter(
            params.theta,
            params.phi,
            params.R1,
            params.R2,
            params.r
        );
    } else {
        return;
    }
    const { outerCenter, contactPoint, basisX } = ptzations;
    const outerCenterDt = outerCenter.map((x) => math.derivative(x, "t"));
    const contactPointDt = contactPoint.map((x) => math.derivative(x, "t"));
    const basisXDt = basisX.map((x) => math.derivative(x, "t"));
    return {
        outerCenter,
        outerCenterDt,
        contactPoint,
        contactPointDt,
        basisX,
        basisXDt,
    };
};

export const getRandomizationSettings = () => {
    const randStoreData = useTemporary
        .getState()
        .levaStores.randomization?.getData();
    const randSettings = {};

    if (!randStoreData) {
        return;
    }

    Object.keys(randStoreData).forEach((k) => {
        const randInput = randStoreData[k] as DataInput;
        const randKey = randInput.key;

        // @ts-expect-error shhhhhhh
        if (!randomizationKeys.includes(randKey)) {
            return;
        }
        const value = randInput.value;
        const disabled = randInput.disabled;
        let render = true;
        if (randInput.render) {
            // @ts-expect-error not providing "get" function.
            render = randInput.render();
        }
        // @ts-expect-error Error because indexing by string.
        randSettings[randKey] = { value, disabled, render };
    });

    return randSettings as RandomizationSettingsTypes;
};

export const createParser = (inputs: InputTypes) => {
    const parser = math.parser();

    try {
        parser.evaluate(
            `theta = typed({'number': theta(t) = ${inputs.curveTheta}})`
        );
        parser.evaluate(`phi = typed({'number': phi(t) = ${inputs.curvePhi}})`);
        parser.evaluate(`R1 = ${inputs.innerGeometryRadius1}`);
        parser.evaluate(`R2 = ${inputs.innerGeometryRadius2}`);
        parser.evaluate(`r = ${inputs.outerGeometryRadius}`);
        parser.evaluate(`d = ${inputs.dLineRadius}`);
        parser.evaluate(`stepSize = ${inputs.stepSize}`);
    } catch (error) {
        console.log(error);
        return;
    }

    const ptzations = getPtzations({
        shape: inputs.innerGeometryShape,
        theta: inputs.curveTheta,
        phi: inputs.curvePhi,
        R1: inputs.innerGeometryRadius1,
        R2: inputs.innerGeometryRadius2,
        r: inputs.outerGeometryRadius,
    });
    if (!ptzations) {
        return;
    }

    const {
        outerCenter,
        outerCenterDt,
        contactPoint,
        contactPointDt,
        basisX,
        basisXDt,
    } = ptzations;

    parser.evaluate(`outerCenter(t) = [${String(outerCenter)}]`);
    parser.evaluate(`outerCenterDt(t) = [${String(outerCenterDt)}]`);
    parser.evaluate(`contactPoint(t) = [${String(contactPoint)}]`);
    parser.evaluate(`contactPointDt(t) = [${String(contactPointDt)}]`);
    parser.evaluate(`basisX(t) = [${String(basisX)}]`);
    parser.evaluate(`basisXDt(t) = [${String(basisXDt)}]`);

    // parser.evaluate(
    //     "outerCenterBasisX(t) = outerCenter(t) ./ norm(outerCenter(t))"
    // );
    parser.evaluate(
        "outerCenterBasisY(t) = outerCenterDt(t) ./ norm(outerCenterDt(t))"
    );
    parser.evaluate("outerCenterBasisX(t) = basisX(t)");
    // parser.evaluate(
    //     "outerCenterBasisY(t) = contactPointDt(t) ./ norm(contactPointDt(t))"
    // );
    parser.evaluate(
        "outerCenterBasisZ(t) = cross(outerCenterBasisX(t), outerCenterBasisY(t))"
    );
    parser.evaluate(
        "outerCenterBasis(t) = matrixFromColumns(\
            outerCenterBasisX(t),\
            outerCenterBasisY(t),\
            outerCenterBasisZ(t)\
        )"
    );

    if (inputs.outerGeometryShape === "Circle") {
        parser.evaluate("L = 0");
        parser.evaluate("alpha = L / r");
        parser.evaluate(
            "outerRotationMatrix(t) = resize(\
                rotationMatrix(alpha, outerCenterBasisZ(t)) * outerCenterBasis(t),\
                [4, 4]\
            ).subset(index(4, 4), 1)"
        );
        parser.evaluate(
            "transformMatrix(t) = outerRotationMatrix(t)\
                .subset(\
                    index([1, 2, 3], 4),\
                    outerCenter(t)\
                )"
        );
        parser.evaluate(
            "curveVec(t) = outerCenter(t)\
                + resize(column(outerRotationMatrix(t), 1), [3]) .* -d"
        );
    } else if (inputs.outerGeometryShape === "Sphere") {
        parser.evaluate("dAlpha = 0");
        parser.evaluate("outerRotationMatrix = identity(3, 3)");
        parser.evaluate(
            "transformMatrix(t) = resize(\
                outerRotationMatrix,\
                [4, 4]\
            ).subset(\
                index([1, 2, 3], 4),\
                outerCenter(t)\
            )"
        );
        parser.evaluate(
            "curveVec(t) = outerCenter(t)\
                + resize(column(outerRotationMatrix, 1), [3]) .* -d"
        );
    } else {
        return;
    }

    return parser;
};
