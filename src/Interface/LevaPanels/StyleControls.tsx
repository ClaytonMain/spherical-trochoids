import { LevaPanel, folder, useControls, useCreateStore } from "leva";
import { useEffect, useState } from "react";
import { defaultStyleValues } from "../../SphericalTrochoid/configs";
import { useSaved } from "../../stores/useSaved";
import { useTemporary } from "../../stores/useTemporary";
import { justText } from "../LevaPlugins/JustText";

export default function StyleControls() {
    const [store] = useState(useCreateStore());

    useEffect(() => {
        useTemporary.setState((state) => {
            state.levaStores.style = store;
        });
    }, [store]);

    const meshOptions = [
        "MeshBasicMaterial",
        "MeshStandardMaterial",
        "MeshNormalMaterial",
    ];

    const [innerGeometryMaterialNote, setInnerGeometryMaterialNote] =
        useState("");
    const [outerGeometryMaterialNote, setOuterGeometryMaterialNote] =
        useState("");
    const [dLineMaterialNote, setDLineMaterialNote] = useState("");
    const [dPointMaterialNote, setDPointMaterialNote] = useState("");

    const materialNotes = {
        MeshBasicMaterial: "Note: Selected material not affected by lights.",
        MeshNormalMaterial: "Note: Selected material not affected by lights.",
    };
    const getMaterialNote = (materialType: string) => {
        if (materialType in materialNotes) {
            // @ts-expect-error Doesn't like indexing by string.
            return materialNotes[materialType] as string;
        }
        return "";
    };
    const colorMaterialTypes = ["MeshBasicMaterial", "MeshStandardMaterial"];
    const emissiveMaterialTypes = ["MeshStandardMaterial"];
    const metalnessMaterialTypes = ["MeshStandardMaterial"];
    const roughnessMaterialTypes = ["MeshStandardMaterial"];
    const flatShadingMaterialTypes = [
        "MeshStandardMaterial",
        "MeshNormalMaterial",
    ];

    // These identifiers are so looooooooooong :(
    const matIdentifiers = {
        "Inner Geometry": "Inner Geometry.innerGeometryMaterial",
        "Outer Geometry": "Outer Geometry.outerGeometryMaterial",
        "d Line": "d Line.dLineMaterial",
        "d Point": "d Point.dPointMaterial",
    };

    const calculationType = useSaved(
        (state) => state.currentPlot.calculationType
    );

    const [{ backgroundColor }, set] = useControls(
        () => ({
            // Presets: folder(
            //     {
            //         presetsNote: justText({
            //             text: "Not yet.",
            //         }),
            //     },
            //     { collapsed: true }
            // ),

            Background: folder(
                {
                    backgroundColor: {
                        label: "Color",
                        value: defaultStyleValues.backgroundColor,
                    },
                },
                { collapsed: true }
            ),

            "Inner Geometry": folder(
                {
                    innerGeometryVisible: {
                        label: "Visible",
                        value: defaultStyleValues.innerGeometryVisible,
                    },
                    innerGeometryMaterial: {
                        label: "Material",
                        value: defaultStyleValues.innerGeometryMaterial,
                        options: meshOptions,
                        onChange: (v) =>
                            setInnerGeometryMaterialNote(getMaterialNote(v)),
                    },
                    innerGeometryMaterialNote: justText({
                        text: innerGeometryMaterialNote,
                        render: (get) =>
                            get(matIdentifiers["Inner Geometry"]) in
                            materialNotes,
                    }),
                    innerGeometryColor: {
                        label: "Color",
                        value: defaultStyleValues.innerGeometryColor,
                        render: (get) =>
                            colorMaterialTypes.includes(
                                get(matIdentifiers["Inner Geometry"])
                            ),
                    },
                    innerGeometryEmissive: {
                        label: "Emissive",
                        value: defaultStyleValues.innerGeometryEmissive,
                        render: (get) =>
                            emissiveMaterialTypes.includes(
                                get(matIdentifiers["Inner Geometry"])
                            ),
                    },
                    innerGeometryEmissiveIntensity: {
                        label: "Emissive Intensity",
                        value: defaultStyleValues.innerGeometryEmissiveIntensity,
                        min: 0.1,
                        max: 10,
                        render: (get) =>
                            emissiveMaterialTypes.includes(
                                get(matIdentifiers["Inner Geometry"])
                            ),
                    },
                    innerGeometryMetalness: {
                        label: "Metalness",
                        value: defaultStyleValues.innerGeometryMetalness,
                        min: 0.01,
                        max: 1.0,
                        render: (get) =>
                            metalnessMaterialTypes.includes(
                                get(matIdentifiers["Inner Geometry"])
                            ),
                    },
                    innerGeometryRoughness: {
                        label: "Roughness",
                        value: defaultStyleValues.innerGeometryRoughness,
                        min: 0.01,
                        max: 1.0,
                        render: (get) =>
                            roughnessMaterialTypes.includes(
                                get(matIdentifiers["Inner Geometry"])
                            ),
                    },
                    innerGeometryFlatShading: {
                        label: "Flat Shading",
                        value: defaultStyleValues.innerGeometryFlatShading,
                        render: (get) =>
                            flatShadingMaterialTypes.includes(
                                get(matIdentifiers["Inner Geometry"])
                            ),
                    },
                    innerGeometryWireframe: {
                        label: "Wireframe",
                        value: defaultStyleValues.innerGeometryWireframe,
                    },
                },
                { collapsed: true }
            ),

            "Outer Geometry": folder(
                {
                    outerGeometryVisible: {
                        label: "Visible",
                        value: defaultStyleValues.outerGeometryVisible,
                    },
                    outerGeometryMaterial: {
                        label: "Material",
                        value: defaultStyleValues.outerGeometryMaterial,
                        options: meshOptions,
                        onChange: (v) =>
                            setOuterGeometryMaterialNote(getMaterialNote(v)),
                    },
                    outerGeometryMaterialNote: justText({
                        text: outerGeometryMaterialNote,
                        render: (get) =>
                            get(matIdentifiers["Outer Geometry"]) in
                            materialNotes,
                    }),
                    outerGeometryColor: {
                        label: "Color",
                        value: defaultStyleValues.outerGeometryColor,
                        render: (get) =>
                            colorMaterialTypes.includes(
                                get(matIdentifiers["Outer Geometry"])
                            ),
                    },
                    outerGeometryEmissive: {
                        label: "Emissive",
                        value: defaultStyleValues.outerGeometryEmissive,
                        render: (get) =>
                            emissiveMaterialTypes.includes(
                                get(matIdentifiers["Outer Geometry"])
                            ),
                    },
                    outerGeometryEmissiveIntensity: {
                        label: "Emissive Intensity",
                        value: defaultStyleValues.outerGeometryEmissiveIntensity,
                        min: 0.1,
                        max: 10,
                        render: (get) =>
                            emissiveMaterialTypes.includes(
                                get(matIdentifiers["Outer Geometry"])
                            ),
                    },
                    outerGeometryMetalness: {
                        label: "Metalness",
                        value: defaultStyleValues.outerGeometryMetalness,
                        min: 0.01,
                        max: 1.0,
                        render: (get) =>
                            metalnessMaterialTypes.includes(
                                get(matIdentifiers["Outer Geometry"])
                            ),
                    },
                    outerGeometryRoughness: {
                        label: "Roughness",
                        value: defaultStyleValues.outerGeometryRoughness,
                        min: 0.01,
                        max: 1.0,
                        render: (get) =>
                            roughnessMaterialTypes.includes(
                                get(matIdentifiers["Outer Geometry"])
                            ),
                    },
                    outerGeometryFlatShading: {
                        label: "Flat Shading",
                        value: defaultStyleValues.outerGeometryFlatShading,
                        render: (get) =>
                            flatShadingMaterialTypes.includes(
                                get(matIdentifiers["Outer Geometry"])
                            ),
                    },
                    outerGeometryWireframe: {
                        label: "Wireframe",
                        value: defaultStyleValues.outerGeometryWireframe,
                    },
                },
                { collapsed: true }
            ),

            "d Line": folder(
                {
                    dLineVisible: {
                        label: "Visible",
                        value: defaultStyleValues.dLineVisible,
                    },
                    dLineWidth: {
                        label: "Width",
                        value: defaultStyleValues.dLineWidth,
                        min: 0.001,
                        max: 1,
                    },
                    dLineMaterial: {
                        label: "Material",
                        value: defaultStyleValues.dLineMaterial,
                        options: meshOptions,
                        onChange: (v) =>
                            setDLineMaterialNote(getMaterialNote(v)),
                    },
                    dLineMaterialNote: justText({
                        text: dLineMaterialNote,
                        render: (get) =>
                            get(matIdentifiers["d Line"]) in materialNotes,
                    }),
                    dLineColor: {
                        label: "Color",
                        value: defaultStyleValues.dLineColor,
                        render: (get) =>
                            colorMaterialTypes.includes(
                                get(matIdentifiers["d Line"])
                            ),
                    },
                    dLineEmissive: {
                        label: "Emissive",
                        value: defaultStyleValues.dLineEmissive,
                        render: (get) =>
                            emissiveMaterialTypes.includes(
                                get(matIdentifiers["d Line"])
                            ),
                    },
                    dLineEmissiveIntensity: {
                        label: "Emissive Intensity",
                        value: defaultStyleValues.dLineEmissiveIntensity,
                        min: 0.1,
                        max: 10,
                        render: (get) =>
                            emissiveMaterialTypes.includes(
                                get(matIdentifiers["d Line"])
                            ),
                    },
                    dLineMetalness: {
                        label: "Metalness",
                        value: defaultStyleValues.dLineMetalness,
                        min: 0.01,
                        max: 1.0,
                        render: (get) =>
                            metalnessMaterialTypes.includes(
                                get(matIdentifiers["d Line"])
                            ),
                    },
                    dLineRoughness: {
                        label: "Roughness",
                        value: defaultStyleValues.dLineRoughness,
                        min: 0.01,
                        max: 1.0,
                        render: (get) =>
                            roughnessMaterialTypes.includes(
                                get(matIdentifiers["d Line"])
                            ),
                    },
                    dLineFlatShading: {
                        label: "Flat Shading",
                        value: defaultStyleValues.dLineFlatShading,
                        render: (get) =>
                            flatShadingMaterialTypes.includes(
                                get(matIdentifiers["d Line"])
                            ),
                    },
                    dLineWireframe: {
                        label: "Wireframe",
                        value: defaultStyleValues.dLineWireframe,
                    },
                },
                { collapsed: true }
            ),

            "d Point": folder(
                {
                    dPointVisible: {
                        label: "Visible",
                        value: defaultStyleValues.dPointVisible,
                    },
                    dPointRadius: {
                        label: "Radius",
                        value: defaultStyleValues.dPointRadius,
                        min: 0.001,
                        max: 1,
                    },
                    dPointMaterial: {
                        label: "Material",
                        value: defaultStyleValues.dPointMaterial,
                        options: meshOptions,
                        onChange: (v) =>
                            setDPointMaterialNote(getMaterialNote(v)),
                    },
                    dPointMaterialNote: justText({
                        text: dPointMaterialNote,
                        render: (get) =>
                            get(matIdentifiers["d Point"]) in materialNotes,
                    }),
                    dPointColor: {
                        label: "Color",
                        value: defaultStyleValues.dPointColor,
                        render: (get) =>
                            colorMaterialTypes.includes(
                                get(matIdentifiers["d Point"])
                            ),
                    },
                    dPointEmissive: {
                        label: "Emissive",
                        value: defaultStyleValues.dPointEmissive,
                        render: (get) =>
                            emissiveMaterialTypes.includes(
                                get(matIdentifiers["d Point"])
                            ),
                    },
                    dPointEmissiveIntensity: {
                        label: "Emissive Intensity",
                        value: defaultStyleValues.dPointEmissiveIntensity,
                        min: 0.1,
                        max: 10,
                        render: (get) =>
                            emissiveMaterialTypes.includes(
                                get(matIdentifiers["d Point"])
                            ),
                    },
                    dPointMetalness: {
                        label: "Metalness",
                        value: defaultStyleValues.dPointMetalness,
                        min: 0.01,
                        max: 1.0,
                        render: (get) =>
                            metalnessMaterialTypes.includes(
                                get(matIdentifiers["d Point"])
                            ),
                    },
                    dPointRoughness: {
                        label: "Roughness",
                        value: defaultStyleValues.dPointRoughness,
                        min: 0.01,
                        max: 1.0,
                        render: (get) =>
                            roughnessMaterialTypes.includes(
                                get(matIdentifiers["d Point"])
                            ),
                    },
                    dPointFlatShading: {
                        label: "Flat Shading",
                        value: defaultStyleValues.dPointFlatShading,
                        render: (get) =>
                            flatShadingMaterialTypes.includes(
                                get(matIdentifiers["d Point"])
                            ),
                    },
                    dPointWireframe: {
                        label: "Wireframe",
                        value: defaultStyleValues.dPointWireframe,
                    },
                },
                { collapsed: true }
            ),

            Curve: folder(
                {
                    curveVisible: {
                        label: "Visible",
                        value: defaultStyleValues.curveVisible,
                    },
                    curveDrawType: {
                        label: "Curve Draw Type",
                        value: defaultStyleValues.curveDrawType,
                        options: ["From Start Point", "Trail"],
                        disabled: calculationType === "Endless",
                    },
                    curveDrawTypeNote: justText({
                        text: 'Just a heads-up: the "Trail" curve type is a bit... buggy at the moment. Especially for fast-moving curves. Sorry about that!',
                        render: (get) => get("Curve.curveDrawType") === "Trail",
                    }),
                    curveColor: {
                        label: "Color",
                        value: defaultStyleValues.curveColor,
                    },
                    curveWidth: {
                        label: "Width",
                        value: defaultStyleValues.curveWidth,
                        min: 0.01,
                        max: 5,
                    },
                    curveTrailLength: {
                        label: "Trail Length",
                        value: defaultStyleValues.curveTrailLength,
                        min: 0.1,
                        max: 1000,
                        render: (get) => get("Curve.curveDrawType") === "Trail",
                    },
                    curveTrailDecay: {
                        label: "Trail Decay",
                        value: defaultStyleValues.curveTrailDecay,
                        min: 0.01,
                        max: 1,
                        render: (get) => get("Curve.curveDrawType") === "Trail",
                    },
                },
                { collapsed: true }
            ),

            Effects: folder(
                {
                    Bloom: folder({
                        effectsBloomEnabled: {
                            label: "Enabled",
                            value: true,
                        },
                        effectsBloomIntensity: {
                            label: "Intensity",
                            value: 0.5,
                            min: 0,
                            max: 10,
                        },
                        effectsBloomLuminanceThreshold: {
                            label: "Luminance Threshold",
                            value: 0.47,
                            min: 0,
                            max: 1,
                        },
                        effectsBloomLuminanceSmoothing: {
                            label: "Luminance Smoothing",
                            value: 0.68,
                            min: 0,
                            max: 1,
                        },
                        effectsBloomMipmapBlur: {
                            label: "Mipmap Blur",
                            value: true,
                        },
                    }),
                    "Chromatic Abberation": folder({
                        effectsChromaticAbberationEnabled: {
                            label: "Enabled",
                            value: true,
                        },
                        effectsChromaticAbberationOffset: {
                            label: "Offset",
                            value: [0.11, 0],
                        },
                    }),
                },
                { collapsed: true }
            ),
        }),
        { store }
    );

    useEffect(() => {
        if (innerGeometryMaterialNote) {
            set({
                innerGeometryMaterialNote: { text: innerGeometryMaterialNote },
            });
        }
        if (outerGeometryMaterialNote) {
            set({
                outerGeometryMaterialNote: { text: outerGeometryMaterialNote },
            });
        }
        if (dLineMaterialNote) {
            set({
                dLineMaterialNote: { text: dLineMaterialNote },
            });
        }
        if (dPointMaterialNote) {
            set({
                dPointMaterialNote: { text: dPointMaterialNote },
            });
        }
    }, [
        set,
        innerGeometryMaterialNote,
        outerGeometryMaterialNote,
        dLineMaterialNote,
        dPointMaterialNote,
    ]);

    useEffect(() => {
        if (calculationType === "Endless") {
            set({ curveDrawType: "Trail" });
            store.disableInputAtPath("Curve.curveDrawType", true);
        } else if (calculationType === "Fixed Interval") {
            store.disableInputAtPath("Curve.curveDrawType", false);
        }
    }, [set, calculationType, store]);

    useEffect(() => {
        document.body.style.backgroundColor = backgroundColor;
    }, [backgroundColor]);

    return (
        <LevaPanel
            store={store}
            fill
            flat
            theme={{
                colors: { highlight1: "#ffffff" },
            }}
            titleBar={{
                title: "Style",
                drag: false,
                filter: false,
            }}
            collapsed={false}
        />
    );
}
