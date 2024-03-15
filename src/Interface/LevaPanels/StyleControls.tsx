import { LevaPanel, folder, useControls, useCreateStore } from "leva";
import { useEffect, useState } from "react";
import { useTemporary } from "../../stores/useTemporary";

export default function StyleControls() {
    const [store] = useState(useCreateStore());

    useEffect(() => {
        useTemporary.setState((state) => {
            state.levaStores.style = store;
        });
    }, [store]);

    const [controls] = useControls(
        () => ({
            Presets: folder(
                {
                    presetsNote1: {
                        label: "Note",
                        value: "TODO: Figure this out.",
                        editable: false,
                        rows: true,
                    },
                },
                { collapsed: false }
            ),
            Background: folder(
                {
                    backgroundColor: {
                        label: "Color",
                        value: "#ff7f50",
                    },
                },
                { collapsed: false }
            ),
            "Inner Geometry": folder(
                {
                    innerGeometryColor: {
                        label: "Color",
                        value: "#4169e1",
                    },
                    innerGeometryTexture: {
                        label: "Texture",
                        value: "Some Texture",
                        options: ["Some Texture", "Some Other Texture"],
                    },
                },
                { collapsed: false }
            ),
            "Outer Geometry": folder(
                {
                    outerGeometryColor: {
                        label: "Color",
                        value: "#f44034",
                    },
                    outerGeometryTexture: {
                        label: "Texture",
                        value: "Some Texture",
                        options: ["Some Texture", "Some Other Texture"],
                    },
                },
                { collapsed: false }
            ),
            "d Line": folder(
                {
                    dLineColor: {
                        label: "Color",
                        value: "#009688",
                    },
                    dLineTexture: {
                        label: "Texture",
                        value: "Some Texture",
                        options: ["Some Texture", "Some Other Texture"],
                    },
                    dLineWidth: {
                        label: "Width",
                        value: 1,
                    },
                },
                { collapsed: false }
            ),
            "d Point": folder(
                {
                    dPointColor: {
                        label: "Color",
                        value: "#ff2fa2",
                    },
                    dPointTexture: {
                        label: "Texture",
                        value: "Some Texture",
                        options: ["Some Texture", "Some Other Texture"],
                    },
                    dPointRadius: {
                        label: "Radius",
                        value: 1,
                    },
                },
                { collapsed: false }
            ),
            Curve: folder(
                {
                    curveColor: {
                        label: "Color",
                        value: "#ff9900",
                    },
                    curveDrawType: {
                        label: "Draw Type",
                        value: "Trail",
                        options: ["Trail", "From Start Point"],
                    },
                    curveWidth: {
                        label: "Width",
                        value: 1,
                    },
                    // curveTexture: {
                    //     label: "Texture",
                    //     value: "Some Texture",
                    //     options: ["Some Texture", "Some Other Texture"],
                    // },
                },
                { collapsed: false }
            ),
        }),
        { store }
    );
    console.log("Style controls:", controls);

    return (
        <LevaPanel
            store={store}
            fill
            flat
            titleBar={{
                title: "Style",
                drag: false,
                filter: false,
            }}
            collapsed={true}
        />
    );
}
