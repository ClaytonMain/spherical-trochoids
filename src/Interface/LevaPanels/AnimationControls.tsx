import { LevaPanel, useControls, useCreateStore } from "leva";
import { useEffect, useState } from "react";
import { useSaved } from "../../stores/useSaved";
import { useTemporary } from "../../stores/useTemporary";

export default function AnimationControls() {
    const [store] = useState(useCreateStore());
    const t = useTemporary((state) => state.t);
    const tRange = useSaved((state) => state.plotHistory[0].curveTRange);

    useEffect(() => {
        useTemporary.setState((state) => {
            state.levaStores.animation = store;
        });
    }, [store]);

    const [, set] = useControls(
        () => ({
            animate: {
                label: "Animate",
                value: true,
            },
            speed: {
                label: "Speed",
                value: 1,
                min: -20,
                max: 20,
            },
            fixedIntervalT: {
                label: "fixed interval t",
                value: t,
                min: tRange[0],
                max: tRange[1],
                onChange: (v) => useTemporary.setState({ t: v }),
                onEditStart: () => useTemporary.setState({ scrubbing: true }),
                onEditEnd: () => useTemporary.setState({ scrubbing: false }),
            },
            endlessT: {
                label: "endless t",
                value: t,
                disabled: true,
            },
            setEndlessTTo: {
                label: 'Set "t" to:',
                value: 3,
                disabled: true,
            },
        }),
        { store },
        [t, tRange]
    );

    useEffect(() => {
        if (t) {
            set({ fixedIntervalT: t, endlessT: t });
        }
    }, [t, set]);

    return (
        <LevaPanel
            store={store}
            fill
            flat
            titleBar={{
                title: "Animation",
                drag: false,
                filter: false,
            }}
            collapsed={false}
        />
    );
}
