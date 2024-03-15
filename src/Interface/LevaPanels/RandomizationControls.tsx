import { LevaPanel, button, folder, useControls, useCreateStore } from "leva";
import { useEffect, useState } from "react";
import { useTemporary } from "../../stores/useTemporary";

export default function RandomizationControls() {
    const [store] = useState(useCreateStore());

    useEffect(() => {
        useTemporary.setState((state) => {
            state.levaStores.randomization = store;
        });
    }, [store]);

    const [controls] = useControls(
        () => ({
            randAtTMax: {
                label: "Rand @ t Max",
                value: true,
            },
            randEveryNSeconds: {
                label: "Rand Every n Seconds",
                value: 30,
            },
            "Allow Randomization": folder({
                "Inner Geometry": folder({
                    allowRandomizationInnerGeometryShape: {
                        label: "Shape",
                        value: true,
                    },
                    allowRandomizationInnerGeometryRadius1: {
                        label: "Radius 1",
                        value: true,
                    },
                    allowRandomizationInnerGeometryRadius2: {
                        label: "Radius 2",
                        value: true,
                    },
                }),
                "Outer Geometry": folder({
                    allowRandomizationOuterGeometryShape: {
                        label: "Shape",
                        value: true,
                    },
                    allowRandomizationOuterGeometryRadius: {
                        label: "Radius",
                        value: true,
                    },
                }),
                "d Line": folder({
                    allowRandomizationDLineRadius: {
                        label: "Radius",
                        value: true,
                    },
                }),
                Curve: folder({
                    allowRandomizationCurveTheta: {
                        label: "Theta",
                        value: true,
                    },
                    allowRandomizationCurvePhi: {
                        label: "Phi",
                        value: true,
                    },
                    allowRandomizationCurveTRange: {
                        label: "t Range",
                        value: true,
                    },
                    allowRandomizationCurveTStart: {
                        label: "t Start",
                        value: true,
                    },
                }),
            }),
            "Randomize Plot": button(() => null),
        }),
        { store }
    );
    console.log("Randomization controls:", controls);

    return (
        <LevaPanel
            store={store}
            fill
            flat
            titleBar={{
                title: "Randomization",
                drag: false,
                filter: false,
            }}
            collapsed={true}
        />
    );
}
