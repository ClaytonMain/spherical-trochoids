import { LevaPanel, useControls, useCreateStore } from "leva";
import { useEffect, useState } from "react";
import { useTemporary } from "../../stores/useTemporary";

export default function CameraControls() {
    const [store] = useState(useCreateStore());

    useEffect(() => {
        useTemporary.setState((state) => {
            state.levaStores.camera = store;
        });
    }, [store]);

    useControls(
        () => ({
            autoRotate: {
                label: "Auto Rotate",
                value: true,
                onChange: (v) => useTemporary.setState({ autoRotate: v }),
            },
            speed: {
                label: "Speed",
                value: 1,
                min: -30,
                max: 30,
                step: 0.5,
                onChange: (v) => useTemporary.setState({ autoRotateSpeed: v }),
            },
            autoZoom: {
                label: "Auto Zoom to Fit",
                value: true,
                onChange: (v) => useTemporary.setState({ autoZoomToFit: v }),
            },
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
                title: "Camera",
                drag: false,
                filter: false,
            }}
            collapsed={false}
        />
    );
}
