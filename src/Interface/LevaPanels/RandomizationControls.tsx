import { LevaPanel, button, folder, useControls, useCreateStore } from "leva";
import { useEffect, useState } from "react";
import { useSaved } from "../../stores/useSaved";
import { useTemporary } from "../../stores/useTemporary";

export default function RandomizationControls() {
    const [store] = useState(useCreateStore());
    const randomizeIn = useTemporary((state) => state.randomizeIn);

    useEffect(() => {
        useTemporary.setState((state) => {
            state.levaStores.randomization = store;
        });
    }, [store]);

    const handleRandomizePlot = () => {
        const calculationState = useTemporary.getState().calculationState;
        if (calculationState === "ready") {
            useTemporary.setState({
                calculationState: "calculate random",
            });
        }
    };

    useEffect(() => {
        const unsubscribeCalculationState = useTemporary.subscribe(
            (state) => state.calculationState,
            (value) => {
                if (value === "calculating") {
                    store.setSettingsAtPath("Randomize Plot", {
                        disabled: true,
                    });
                } else if (value === "ready") {
                    store.setSettingsAtPath("Randomize Plot", {
                        disabled: false,
                    });
                }
            }
        );
        return () => {
            unsubscribeCalculationState();
        };
    });

    const [autoRandomizeTypeOptions, setAutoRandomizeTypeOptions] = useState([
        "At t Max",
        "Every n Seconds",
    ]);
    const [currentAutoRandomizeType, setCurrentAutoRandomizeType] =
        useState("At t Max");

    useEffect(() => {
        const unsubscribeCalculationType = useSaved.subscribe(
            (state) => state.currentPlot.calculationType,
            (value) => {
                if (value === "Fixed Interval") {
                    store.setSettingsAtPath("autoRandomizeType", {
                        keys: ["At t Max", "Every n Seconds"],
                        values: ["At t Max", "Every n Seconds"],
                    });
                    setAutoRandomizeTypeOptions([
                        "At t Max",
                        "Every n Seconds",
                    ]);
                    if (get("autoRandomizeType") === "At t Value") {
                        set({ autoRandomizeType: "At t Max" });
                    }
                } else if (value === "Endless") {
                    store.setSettingsAtPath("autoRandomizeType", {
                        keys: ["At t Value", "Every n Seconds"],
                        values: ["At t Value", "Every n Seconds"],
                    });
                    setAutoRandomizeTypeOptions([
                        "At t Value",
                        "Every n Seconds",
                    ]);
                    if (get("autoRandomizeType") === "At t Max") {
                        set({ autoRandomizeType: "At t Value" });
                    }
                }
                setCurrentAutoRandomizeType(get("autoRandomizeType"));
            }
        );
        return () => {
            unsubscribeCalculationType();
        };
    });

    const handleInnerGeometryRandomizeChange = (v: boolean) => {
        const pathPrefix = "Inner Geometry.innerGeometry";
        const pathSuffixes = [
            "RandomizeShape",
            "RandomizeRadius1",
            "RandomizeRadius2",
        ];
        pathSuffixes.forEach((suffix) =>
            store.disableInputAtPath(`${pathPrefix}${suffix}`, !v)
        );
    };
    const handleOuterGeometryRandomizeChange = (v: boolean) => {
        const pathPrefix = "Outer Geometry.outerGeometry";
        const pathSuffixes = ["RandomizeShape", "RandomizeRadius"];
        pathSuffixes.forEach((suffix) =>
            store.disableInputAtPath(`${pathPrefix}${suffix}`, !v)
        );
    };
    const handleDLineRandomizeChange = (v: boolean) => {
        const pathPrefix = "d Line.dLine";
        const pathSuffixes = ["EqualsOuterGeometryRadius", "RandomizeRadius"];
        pathSuffixes.forEach((suffix) =>
            store.disableInputAtPath(`${pathPrefix}${suffix}`, !v)
        );
    };
    const handleCurveRandomizeChange = (v: boolean) => {
        const pathPrefix = "Curve.curve";
        const pathSuffixes = [
            "RandomizeTheta",
            "RandomizePhi",
            "RandomizeTStart",
            "RandomizeTInterval",
        ];
        pathSuffixes.forEach((suffix) =>
            store.disableInputAtPath(`${pathPrefix}${suffix}`, !v)
        );
    };

    // @ts-expect-error asdfsadf sadf asdf
    const [{ autoRandomizeType }, set, get] = useControls(
        // @ts-expect-error asdf asdf asdf
        () => ({
            autoRandomize: {
                label: "Auto Randomize",
                value: true,
            },
            autoRandomizeType: {
                label: "Auto Randomize Type",
                value: currentAutoRandomizeType,
                options: autoRandomizeTypeOptions,
                render: () => get("autoRandomize"),
            },
            randomizeAtTValue: {
                label: "Randomize @ t",
                value: 40,
                render: () =>
                    get("autoRandomize") &&
                    get("autoRandomizeType") === "At t Value",
            },
            randomizeEveryNSeconds: {
                label: "Randomize every",
                value: "30s",
                min: 5,
                render: () =>
                    get("autoRandomize") &&
                    get("autoRandomizeType") === "Every n Seconds",
            },
            randomizingInSeconds: {
                label: "Randomizing in",
                value: "0s",
                disabled: true,
                render: () =>
                    get("autoRandomize") &&
                    get("autoRandomizeType") === "Every n Seconds",
            },
            "Inner Geometry": folder(
                {
                    innerGeometryRandomize: {
                        label: "Randomize Enabled",
                        value: true,
                        onChange: handleInnerGeometryRandomizeChange,
                    },
                    innerGeometryRandomizeShape: {
                        label: "Randomize Shape",
                        value: true,
                    },
                    innerGeometryRandomizeRadius1: {
                        label: "Randomize Radius 1",
                        value: true,
                        onChange: (v) =>
                            store.disableInputAtPath(
                                "Inner Geometry.innerGeometryRadius1Range",
                                !v
                            ),
                    },
                    innerGeometryRadius1Range: {
                        label: "R1 Rand. Range",
                        value: [2.0, 4.0],
                        min: 0.25,
                        max: 6.0,
                    },
                    innerGeometryRandomizeRadius2: {
                        label: "Randomize Radius 2",
                        value: true,
                        onChange: (v) =>
                            store.disableInputAtPath(
                                "Inner Geometry.innerGeometryRadius2Range",
                                !v
                            ),
                    },
                    innerGeometryRadius2Range: {
                        label: "R2 Rand. Range",
                        value: [0.25, 2.0],
                        min: 0.25,
                        max: 3.0,
                    },
                },
                {
                    collapsed: true,
                }
            ),
            "Outer Geometry": folder(
                {
                    outerGeometryRandomize: {
                        label: "Randomize Enabled",
                        value: true,
                        onChange: handleOuterGeometryRandomizeChange,
                    },
                    outerGeometryRandomizeShape: {
                        label: "Randomize Shape",
                        value: true,
                    },
                    outerGeometryRandomizeRadius: {
                        label: "Randomize Radius",
                        value: true,
                        onChange: (v) =>
                            store.disableInputAtPath(
                                "Outer Geometry.outerGeometryRadiusRange",
                                !v
                            ),
                    },
                    outerGeometryRadiusRange: {
                        label: "Radius Range",
                        value: [0.25, 4.0],
                        min: 0.05,
                        max: 6.0,
                    },
                },
                {
                    collapsed: true,
                }
            ),
            "d Line": folder(
                {
                    dLineRandomize: {
                        label: "Randomize Enabled",
                        value: true,
                        onChange: handleDLineRandomizeChange,
                    },
                    dLineEqualsOuterGeometryRadius: {
                        label: "d = r",
                        value: true,
                    },
                    dLineRandomizeRadius: {
                        label: "Randomize Radius",
                        value: true,
                        onChange: (v) =>
                            store.disableInputAtPath(
                                "d Line.dLineRadiusRange",
                                !v
                            ),
                        render: () => !get("dLineEqualsOuterGeometryRadius"),
                    },
                    dLineRadiusRange: {
                        label: "Radius Range",
                        value: [0.25, 4.0],
                        min: 0.05,
                        max: 6.0,
                        render: () => !get("dLineEqualsOuterGeometryRadius"),
                    },
                },
                {
                    collapsed: true,
                }
            ),
            Curve: folder(
                {
                    curveRandomize: {
                        label: "Randomize Enabled",
                        value: true,
                        onChange: handleCurveRandomizeChange,
                    },
                    curveRandomizeTheta: {
                        label: "Randomize Theta",
                        value: true,
                    },
                    curveRandomizePhi: {
                        label: "Randomize Phi",
                        value: true,
                    },
                    curveRandomizeTStart: {
                        label: "Randomize t Start",
                        value: false,
                        onChange: (v) =>
                            store.disableInputAtPath(
                                "Curve.curveTStartRange",
                                !v
                            ),
                    },
                    curveTStartRange: {
                        label: "t Start Range",
                        value: [-50, 50],
                        min: -200,
                        max: 180,
                    },
                    curveRandomizeTInterval: {
                        label: "Rand. t Interval",
                        value: false,
                        onChange: (v) =>
                            store.disableInputAtPath(
                                "Curve.curveTIntervalRange",
                                !v
                            ),
                        render: () =>
                            useSaved.getState().currentPlot.calculationType ===
                            "Fixed Interval",
                    },
                    curveTIntervalRange: {
                        label: "t Interval Range",
                        value: [20, 200],
                        min: 20,
                        max: 400,
                        render: () =>
                            useSaved.getState().currentPlot.calculationType ===
                            "Fixed Interval",
                    },
                },
                {
                    collapsed: true,
                }
            ),
            "Randomize Plot": button(handleRandomizePlot, { disabled: true }),
        }),
        { store },
        [randomizeIn, autoRandomizeTypeOptions, currentAutoRandomizeType]
    );

    useEffect(() => {
        if (randomizeIn) {
            if (autoRandomizeType === "Every n Seconds") {
                set({ randomizingInSeconds: randomizeIn + "s" });
            }
        }
    });

    return (
        <LevaPanel
            store={store}
            fill
            flat
            theme={{ colors: { highlight1: "#ffffff" } }}
            titleBar={{
                title: "Curve Randomization",
                drag: false,
                filter: false,
            }}
            collapsed={false}
        />
    );
}
