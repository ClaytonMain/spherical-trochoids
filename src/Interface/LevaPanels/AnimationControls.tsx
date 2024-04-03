import { LevaPanel, useControls, useCreateStore } from "leva";
import { useEffect, useState } from "react";
import { useSaved } from "../../stores/useSaved";
import { useTemporary } from "../../stores/useTemporary";

export default function AnimationControls() {
    const [store] = useState(useCreateStore());
    const t = useTemporary((state) => state.t);
    const currentPlot = useSaved((state) => state.currentPlot);
    const calculationType = currentPlot.calculationType;
    const tRange = currentPlot.curveTRange;

    useEffect(() => {
        useTemporary.setState((state) => {
            state.levaStores.animation = store;
        });
    }, [store]);

    const renderFixedInterval = () => {
        if (calculationType === "Fixed Interval") {
            return true;
        } else if (calculationType === "Endless") {
            return false;
        }
        return true;
    };

    const renderEndless = () => {
        if (calculationType === "Fixed Interval") {
            return false;
        } else if (calculationType === "Endless") {
            return true;
        }
        return true;
    };

    const handleFixedIntervalTChange = (v: number) => {
        if (calculationType === "Fixed Interval") {
            useTemporary.setState({ t: v });
        }
    };

    const [, set] = useControls(
        () => ({
            animate: {
                label: "Animate",
                value: true,
            },
            speed: {
                label: "Speed",
                value: 1,
                min: 0.1,
                max: 20,
            },
            fixedIntervalT: {
                label: "fixed interval t",
                value: t,
                min: tRange[0],
                max: tRange[1],
                onChange: (v) => handleFixedIntervalTChange(v),
                onEditStart: () => useTemporary.setState({ scrubbing: true }),
                onEditEnd: () => useTemporary.setState({ scrubbing: false }),
                render: renderFixedInterval,
            },
            endlessT: {
                label: "endless t",
                value: t,
                disabled: true,
                render: renderEndless,
            },
            setEndlessTTo: {
                label: 'Set "t" to:',
                value: 3,
                disabled: true,
                render: renderEndless,
            },
        }),
        { store },
        [t, tRange]
    );

    useEffect(() => {
        if (t) {
            if (calculationType === "Fixed Interval") {
                set({ fixedIntervalT: t });
            } else if (calculationType === "Endless") {
                set({ endlessT: t });
            }
        }
    }, [t, set, calculationType]);

    return (
        <LevaPanel
            store={store}
            fill
            flat
            theme={{ colors: { highlight1: "#ffffff" } }}
            titleBar={{
                title: "Animation",
                drag: false,
                filter: false,
            }}
            collapsed={false}
        />
    );
}
