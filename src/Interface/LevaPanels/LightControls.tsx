import { LevaPanel, folder, useControls, useCreateStore } from "leva";
import { useEffect, useState } from "react";
import { defaultLightValues } from "../../SphericalTrochoid/configs";
import { useTemporary } from "../../stores/useTemporary";

export default function LightControls() {
    const [store] = useState(useCreateStore());

    useEffect(() => {
        useTemporary.setState((state) => {
            state.levaStores.lights = store;
        });
    }, [store]);

    useControls(
        () => ({
            Ambient: folder(
                {
                    ambientEnabled: {
                        label: "Enabled",
                        value: defaultLightValues.ambientEnabled,
                    },
                    ambientIntensity: {
                        label: "Intensity",
                        value: defaultLightValues.ambientIntensity,
                        min: 0.01,
                        max: 10,
                    },
                    ambientColor: {
                        label: "Color",
                        value: defaultLightValues.ambientColor,
                    },
                },
                { collapsed: false }
            ),
            "Directional Light": folder(
                {
                    directionalLightEnabled: {
                        label: "Enabled",
                        value: defaultLightValues.directionalLightEnabled,
                    },
                    directionalLightIntensity: {
                        label: "Intensity",
                        value: defaultLightValues.directionalLightIntensity,
                        min: 0.01,
                        max: 20,
                    },
                    directionalLightColor: {
                        label: "Color",
                        value: defaultLightValues.directionalLightColor,
                    },
                    // @ts-expect-error this is fine.
                    directionalLightPosition: {
                        label: "Position",
                        value: defaultLightValues.directionalLightPosition,
                    },
                },
                { collapsed: false }
            ),
            "Lightformer 1": folder(
                {
                    lightformer1Enabled: {
                        label: "Enabled",
                        value: defaultLightValues.lightformer1Enabled,
                    },
                    lightformer1Form: {
                        label: "Form",
                        value: defaultLightValues.lightformer1Form,
                        options: ["ring", "rect", "circle"],
                    },
                    lightformer1Intensity: {
                        label: "Intensity",
                        value: defaultLightValues.lightformer1Intensity,
                        min: 0.01,
                        max: 10,
                    },
                    lightformer1Color: {
                        label: "Color",
                        value: defaultLightValues.lightformer1Color,
                    },
                    lightformer1Scale: {
                        label: "Scale",
                        value: defaultLightValues.lightformer1Scale,
                        min: 1,
                        max: 100,
                    },
                    // @ts-expect-error this is fine.
                    lightformer1Position: {
                        label: "Position",
                        value: defaultLightValues.lightformer1Position,
                    },
                },
                { collapsed: false }
            ),
            "Lightformer 2": folder(
                {
                    lightformer2Enabled: {
                        label: "Enabled",
                        value: defaultLightValues.lightformer2Enabled,
                    },
                    lightformer2Form: {
                        label: "Form",
                        value: defaultLightValues.lightformer2Form,
                        options: ["ring", "rect", "circle"],
                    },
                    lightformer2Intensity: {
                        label: "Intensity",
                        value: defaultLightValues.lightformer2Intensity,
                        min: 0.01,
                        max: 10,
                    },
                    lightformer2Color: {
                        label: "Color",
                        value: defaultLightValues.lightformer2Color,
                    },
                    lightformer2Scale: {
                        label: "Scale",
                        value: defaultLightValues.lightformer2Scale,
                        min: 1,
                        max: 100,
                    },
                    // @ts-expect-error this is fine.
                    lightformer2Position: {
                        label: "Position",
                        value: defaultLightValues.lightformer2Position,
                    },
                },
                { collapsed: false }
            ),
            "Lightformer 3": folder(
                {
                    lightformer3Enabled: {
                        label: "Enabled",
                        value: defaultLightValues.lightformer3Enabled,
                    },
                    lightformer3Form: {
                        label: "Form",
                        value: defaultLightValues.lightformer3Form,
                        options: ["ring", "rect", "circle"],
                    },
                    lightformer3Intensity: {
                        label: "Intensity",
                        value: defaultLightValues.lightformer3Intensity,
                        min: 0.01,
                        max: 10,
                    },
                    lightformer3Color: {
                        label: "Color",
                        value: defaultLightValues.lightformer3Color,
                    },
                    lightformer3Scale: {
                        label: "Scale",
                        value: defaultLightValues.lightformer3Scale,
                        min: 1,
                        max: 100,
                    },
                    // @ts-expect-error this is fine.
                    lightformer3Position: {
                        label: "Position",
                        value: defaultLightValues.lightformer3Position,
                    },
                },
                { collapsed: true }
            ),
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
                title: "Lights",
                drag: false,
                filter: false,
            }}
            collapsed={false}
        />
    );
}
