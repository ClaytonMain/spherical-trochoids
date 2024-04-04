import {
    LevaInputs,
    LevaPanel,
    button,
    useControls,
    useCreateStore,
} from "leva";
import { useEffect, useState } from "react";
import {
    defaultInputValueConstraints,
    defaultInputValues,
    minTRange,
    tMax,
    tMin,
} from "../../SphericalTrochoid/configs";
import { useTemporary } from "../../stores/useTemporary";
import { justText } from "../LevaPlugins/JustText";

export default function InputControls() {
    const [store] = useState(useCreateStore());

    useEffect(() => {
        useTemporary.setState((state) => {
            state.levaStores.input = store;
        });
    }, [store]);

    const handleInnerGeometryShapeChange = (shape: string) => {
        if (shape === "Sphere") {
            store.getInput("innerGeometryRadius1")!.label = "R (Radius)";
        } else if (shape === "Torus") {
            store.getInput("innerGeometryRadius1")!.label = "R1 (Radius 1)";
        }
    };

    const renderInnerGeometryRadius2 = () => {
        const innerGeometryShape = get("innerGeometryShape");
        if (innerGeometryShape === "Sphere") {
            return false;
        } else if (innerGeometryShape === "Torus") {
            return true;
        }
        return true;
    };

    const handledEqualsOuterGeometryRadiusChange = (v: boolean) => {
        store.disableInputAtPath("dLineRadius", v);
        if (v) {
            set({ dLineRadius: get("outerGeometryRadius") });
        }
    };

    const [startEditTRange, setStartEditTRange] = useState([0, 0]);

    const handleCurveTRangeChange = (v: [number, number]) => {
        const tRange = v[1] - v[0];
        if (tRange >= minTRange) return;

        let setTo: [number, number];
        if (v[0] > startEditTRange[0] || v[1] > startEditTRange[1]) {
            // Editing t start.
            if (v[0] + minTRange > tMax) {
                setTo = [tMax - minTRange, tMax];
            } else {
                setTo = [v[0], v[0] + minTRange];
            }
        } else if (v[0] < startEditTRange[0] || v[1] < startEditTRange[1]) {
            // Editing t end.
            if (v[1] - minTRange < tMin) {
                setTo = [tMin, tMin + minTRange];
            } else {
                setTo = [v[1] - minTRange, v[1]];
            }
        } else {
            return;
        }
        set({ curveTRange: setTo });
    };

    const handleCurveTRangeEditStart = (v: [number, number]) => {
        setStartEditTRange(v);
    };

    const renderCurveTRange = () => {
        const calculationType = get("calculationType");
        if (calculationType === "Fixed Interval") {
            return true;
        } else if (calculationType === "Endless") {
            return false;
        }
        return true;
    };

    const renderCurveTStart = () => {
        const calculationType = get("calculationType");
        if (calculationType === "Fixed Interval") {
            return false;
        } else if (calculationType === "Endless") {
            return true;
        }
        return true;
    };

    const handleUpdatePlot = () => {
        const calculationState = useTemporary.getState().calculationState;
        if (calculationState === "ready") {
            useTemporary.setState({
                calculationState: "calculate input",
            });
        }
    };

    useEffect(() => {
        const unsubscribeCalculationState = useTemporary.subscribe(
            (state) => state.calculationState,
            (value) => {
                if (value === "calculating") {
                    store.setSettingsAtPath("Update Plot", { disabled: true });
                } else if (value === "ready") {
                    store.setSettingsAtPath("Update Plot", { disabled: false });
                }
            }
        );
        return () => {
            unsubscribeCalculationState();
        };
    });

    const [, set, get] = useControls(
        () => ({
            calculationType: {
                label: "Calculation Type",
                value: defaultInputValues.calculationType,
                options: ["Fixed Interval", "Endless"],
            },
            stepSize: {
                label: "Step Size",
                value: defaultInputValues.stepSize,
                min: defaultInputValueConstraints.stepSizeRange[0],
                max: defaultInputValueConstraints.stepSizeRange[1],
            },

            innerGeometryLabel: justText({
                text: "Inner Geometry",
            }),
            innerGeometryShape: {
                label: "Shape",
                value: defaultInputValues.innerGeometryShape,
                options: ["Sphere", "Torus"],
                onChange: handleInnerGeometryShapeChange,
            },
            innerGeometryRadius1: {
                label: "R1 (Radius 1)",
                value: defaultInputValues.innerGeometryRadius1,
                min: defaultInputValueConstraints.innerGeometryRadius1Range[0],
                max: defaultInputValueConstraints.innerGeometryRadius1Range[1],
            },
            innerGeometryRadius2: {
                label: "R2 (Radius 2)",
                value: defaultInputValues.innerGeometryRadius2,
                min: defaultInputValueConstraints.innerGeometryRadius2Range[0],
                max: defaultInputValueConstraints.innerGeometryRadius2Range[1],
                render: renderInnerGeometryRadius2,
            },

            outerGeometryLabel: justText({
                text: "Outer Geometry",
            }),
            outerGeometryShape: {
                label: "Shape",
                value: defaultInputValues.outerGeometryShape,
                options: ["Circle", "Sphere"],
            },
            outerGeometryRadius: {
                label: "r (Radius)",
                value: defaultInputValues.outerGeometryRadius,
                min: defaultInputValueConstraints.outerGeometryRadiusRange[0],
                max: defaultInputValueConstraints.outerGeometryRadiusRange[1],
                onChange: (v) => {
                    if (get("dEqualsOuterGeometryRadius")) {
                        return set({ dLineRadius: v });
                    }
                },
            },

            dLineLabel: justText({
                text: "d Line",
            }),
            dEqualsOuterGeometryRadius: {
                label: "d = r",
                value: defaultInputValues.dEqualsOuterGeometryRadius,
                onChange: handledEqualsOuterGeometryRadiusChange,
            },
            dLineRadius: {
                label: "d (Radius)",
                value: defaultInputValues.dLineRadius,
                min: defaultInputValueConstraints.dLineRadiusRange[0],
                max: defaultInputValueConstraints.dLineRadiusRange[1],
            },

            curveLabel: justText({
                text: "Curve",
            }),
            curveTheta: {
                label: "Theta",
                value: defaultInputValues.curveTheta,
                type: LevaInputs.STRING,
            },
            curvePhi: {
                label: "Phi",
                value: defaultInputValues.curvePhi,
                type: LevaInputs.STRING,
            },
            curveTRange: {
                label: "t Range",
                value: defaultInputValues.curveTRange,
                min: defaultInputValueConstraints.curveTRangeRange[0],
                max: defaultInputValueConstraints.curveTRangeRange[1],
                onChange: handleCurveTRangeChange,
                onEditStart: handleCurveTRangeEditStart,
                render: renderCurveTRange,
            },
            curveTStart: {
                label: "t Start",
                value: defaultInputValues.curveTStart,
                min: defaultInputValueConstraints.curveTStartRange[0],
                max: defaultInputValueConstraints.curveTStartRange[1],
                render: renderCurveTStart,
            },

            "Update Plot": button(handleUpdatePlot, { disabled: true }),
        }),
        { store }
    );

    return (
        <LevaPanel
            store={store}
            fill
            flat
            theme={{ colors: { highlight1: "#ffffff" } }}
            titleBar={{
                title: "Input",
                drag: false,
                filter: false,
            }}
            collapsed={false}
        />
    );
}
