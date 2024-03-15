import { LevaPanel, folder, useControls, useCreateStore } from "leva";
import { useEffect, useState } from "react";
import { inputKeys } from "../../SphericalTrochoid/shared";
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

    const [controls, set] = useControls(
        () => ({
            "Current Plot": folder({
                currentPlot: justText({
                    text: new Array(inputKeys.length).fill("").join("\n"),
                }),
            }),
            History: folder({
                historyNote1: {
                    label: "Note",
                    value: "TODO: Would like to display history in a list, but need to figure out how.",
                    rows: true,
                    editable: false,
                },
            }),
        }),
        { store }
    );

    useEffect(() => {
        const unsubscribePlotHistory = useSaved.subscribe(
            (state) => state.plotHistory[0],
            (value) => {
                set({
                    currentPlot: {
                        text: Object.keys(value)
                            // @ts-expect-error accessing by "k"
                            .map((k) => `${k}: ${value[k]}`)
                            .join("\n"),
                    },
                });
            }
        );
        return () => {
            unsubscribePlotHistory();
        };
    });

    console.log("Parameter History Panel:", controls);

    return (
        <LevaPanel
            store={store}
            fill
            flat
            titleBar={{
                title: "Parameter History",
                drag: false,
                filter: false,
            }}
            collapsed={false}
        />
    );
}
