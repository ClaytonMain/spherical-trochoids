import { useEffect, useMemo } from "react";
import { useSaved } from "../stores/useSaved.tsx";
import { useTemporary } from "../stores/useTemporary.tsx";
import {
    DefaultRandomizationSettingType,
    createParser,
    getCurrentInputs,
    getRandomizationSettings,
    innerGeometryShapes,
    outerGeometryShapes,
    randomizationKeys,
} from "./sharedFunctions.tsx";

/**
 * Just a reminder, the calculations are (mostly) performed in the
 * "calculationsWorker.ts" file, but most of the math function & variable
 * definitions are actually in the "shared.tsx" file.
 *
 * This file pretty much just handles deciding when calculations should
 * be performed. Also getting random inputs & getting calculation inputs,
 * but those will probably be moved somewhere else at some point.
 */

const checkSetting = (
    setting: { value: boolean } & DefaultRandomizationSettingType
) => {
    return setting.value && !setting.disabled && setting.render;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chooseRandomArrayElement = (array: Array<any>) => {
    return array[Math.floor(Math.random() * array.length)];
};

const randInInterval = (
    interval: [number, number],
    roundDenominator: number = 4
) => {
    const range = interval[1] - interval[0];
    return (
        Math.round(Math.random() * range * roundDenominator) /
            roundDenominator +
        interval[0]
    );
};

type CheckedSettingsTypes<T extends readonly string[]> = {
    [Key in T[number]]: boolean;
};

const getRandomCurveFunction = () => {
    const functionType = Math.random() <= 2 / 3 ? 1 : 2;
    if (functionType == 1) {
        const factorGtOne = Math.random() <= 1 / 2;
        if (factorGtOne) {
            return `${randInInterval([1, 5])}t`;
        } else {
            return `${randInInterval([0, 1], 16)}t`;
        }
    } else if (functionType == 2) {
        const sinOrCos = Math.random() <= 1 / 2 ? "sin" : "cos";
        const outerFactor = randInInterval([0, 1], 16);
        const innerFactor = randInInterval([1, 10]);
        return `${outerFactor}${sinOrCos}(${innerFactor}t)`;
    }
    return "0";
};

const getRandomInputs = () => {
    const inputs = { ...useSaved.getState().currentPlot };
    const randSettings = getRandomizationSettings();

    if (!(inputs && randSettings)) return;

    const checkedSettings = Object.fromEntries(
        // @ts-expect-error indexing randSettings by string.
        Object.keys(randSettings).map((k) => [k, checkSetting(randSettings[k])])
    ) as CheckedSettingsTypes<typeof randomizationKeys>;

    if (checkedSettings.innerGeometryRandomize) {
        if (checkedSettings.innerGeometryRandomizeShape) {
            inputs.innerGeometryShape =
                chooseRandomArrayElement(innerGeometryShapes);
        }
        if (checkedSettings.innerGeometryRandomizeRadius1) {
            inputs.innerGeometryRadius1 = randInInterval(
                randSettings.innerGeometryRadius1Range.value
            );
        }
        if (checkedSettings.innerGeometryRandomizeRadius2) {
            inputs.innerGeometryRadius2 = randInInterval(
                randSettings.innerGeometryRadius2Range.value
            );
        }
    }

    if (checkedSettings.outerGeometryRandomize) {
        if (checkedSettings.outerGeometryRandomizeShape) {
            inputs.outerGeometryShape =
                chooseRandomArrayElement(outerGeometryShapes);
        }
        if (checkedSettings.outerGeometryRandomizeRadius) {
            inputs.outerGeometryRadius = randInInterval(
                randSettings.outerGeometryRadiusRange.value
            );
        }
    }

    if (checkedSettings.dLineRandomize) {
        if (checkedSettings.dLineEqualsOuterGeometryRadius) {
            inputs.dLineRadius = inputs.outerGeometryRadius;
        } else if (checkedSettings.dLineRandomizeRadius) {
            inputs.dLineRadius = randInInterval(
                randSettings.dLineRadiusRange.value
            );
        }
    }

    if (checkedSettings.curveRandomize) {
        if (checkedSettings.curveRandomizeTheta) {
            inputs.curveTheta = getRandomCurveFunction();
        }
        if (checkedSettings.curveRandomizePhi) {
            inputs.curvePhi = getRandomCurveFunction();
        }
        if (checkedSettings.curveRandomizeTStart) {
            const newTStart = randInInterval(
                randSettings.curveTStartRange.value,
                1
            );
            if (inputs.calculationType === "Fixed Interval") {
                const newTEnd = Math.min(
                    newTStart + inputs.curveTRange[1] - inputs.curveTRange[0],
                    200
                );
                inputs.curveTRange = [newTStart, newTEnd];
            } else if (inputs.calculationType === "Endless") {
                inputs.curveTStart = newTStart;
            }
        }
        if (checkedSettings.curveRandomizeTInterval) {
            inputs.curveTRange = [
                inputs.curveTRange[0],
                Math.min(
                    inputs.curveTRange[0] +
                        randInInterval(
                            randSettings.curveTIntervalRange.value,
                            1
                        ),
                    200
                ),
            ];
        }
    }
    return inputs;
};

const getCalculationInputs = (
    calculateInputOrRandom: "calculate input" | "calculate random"
) => {
    let inputs;
    if (calculateInputOrRandom === "calculate input") {
        inputs = getCurrentInputs();
    } else if (calculateInputOrRandom === "calculate random") {
        inputs = getRandomInputs();
    }

    if (!inputs) {
        return;
    }

    return inputs;
};

const Calculations = () => {
    const worker: Worker = useMemo(
        () =>
            new Worker(new URL("./calculationsWorker.ts", import.meta.url), {
                type: "module",
            }),
        []
    );

    useEffect(() => {
        worker.onmessage = (event) => {
            if (event.data.calculationStatus === "success") {
                useTemporary.setState({
                    parser: createParser(event.data.inputs),
                    fixedIntervalCurvePoints: event.data.curvePoints,
                    lValues: event.data.lValues,
                    transformMatrixValues: event.data.transformMatrixValues,
                    repositionCamera: true,
                });
            }
            useSaved.getState().addToPlotHistory(event.data.inputs);
            useTemporary.setState({ calculationState: "ready" });
        };
    }, [worker]);

    useEffect(() => {
        const unsubscribeCalculationState = useTemporary.subscribe(
            (state) => state.calculationState,
            (value) => {
                if (
                    value === "calculate input" ||
                    value === "calculate random"
                ) {
                    const inputs = getCalculationInputs(value);
                    useTemporary.setState({ calculationState: "calculating" });
                    worker.postMessage(inputs);
                }
            }
        );
        return () => {
            unsubscribeCalculationState();
        };
    });

    useEffect(() => {
        useTemporary.setState({ calculationState: "calculate input" });
    }, []);

    return <></>;
};

export default Calculations;
