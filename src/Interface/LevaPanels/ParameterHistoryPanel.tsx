import { LevaPanel, folder, useControls, useCreateStore } from "leva";
import { useEffect, useState } from "react";
import { inputKeys } from "../../SphericalTrochoid/sharedFunctions";
import { useSaved } from "../../stores/useSaved";
import { useTemporary } from "../../stores/useTemporary";
import { justText } from "../LevaPlugins/JustText";

export default function ParameterHistoryPanel() {
    const [store] = useState(useCreateStore());

    useEffect(() => {
        useTemporary.setState((state) => {
            state.levaStores.parameterHistory = store;
        });
    }, [store]);

    const [, set] = useControls(
        () => ({
            "Current Plot": folder(
                {
                    currentPlot: justText({
                        text: new Array(inputKeys.length + 1)
                            .fill("")
                            .join("\n"),
                    }),
                },
                { collapsed: false }
            ),
            History: folder(
                {
                    plotHistory1: justText({
                        text: new Array(inputKeys.length + 1)
                            .fill("")
                            .join("\n"),
                    }),
                    plotHistory2: justText({
                        text: new Array(inputKeys.length + 1)
                            .fill("")
                            .join("\n"),
                    }),
                    plotHistory3: justText({
                        text: new Array(inputKeys.length + 1)
                            .fill("")
                            .join("\n"),
                    }),
                },
                { collapsed: true }
            ),
        }),
        { store }
    );

    useEffect(() => {
        const unsubscribePlotHistory = useSaved.subscribe(
            (state) => state.currentPlot,
            (value) => {
                set({
                    currentPlot: {
                        text: Object.keys(value)
                            // @ts-expect-error accessing by "k"
                            .map((k) => `${k}: ${value[k]}`)
                            .join("\n"),
                    },
                    plotHistory1: {
                        text: Object.keys(useSaved.getState().plotHistory[1])
                            .map(
                                (k) =>
                                    `${k}: ${
                                        // @ts-expect-error accessing by "k"
                                        useSaved.getState().plotHistory[1][k]
                                    }`
                            )
                            .join("\n"),
                    },
                    plotHistory2: {
                        text: Object.keys(useSaved.getState().plotHistory[2])
                            .map(
                                (k) =>
                                    `${k}: ${
                                        // @ts-expect-error accessing by "k"
                                        useSaved.getState().plotHistory[2][k]
                                    }`
                            )
                            .join("\n"),
                    },
                    plotHistory3: {
                        text: Object.keys(useSaved.getState().plotHistory[3])
                            .map(
                                (k) =>
                                    `${k}: ${
                                        // @ts-expect-error accessing by "k"
                                        useSaved.getState().plotHistory[3][k]
                                    }`
                            )
                            .join("\n"),
                    },
                });
            }
        );
        return () => {
            unsubscribePlotHistory();
        };
    });

    return (
        <LevaPanel
            store={store}
            fill
            flat
            theme={{ colors: { highlight1: "#ffffff" } }}
            titleBar={{
                title: "Parameter History",
                drag: false,
                filter: false,
            }}
            collapsed={false}
        />
    );
}
