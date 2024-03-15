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

    const [controls] = useControls(
        () => ({
            autoRotate: {
                label: "Auto Rotate",
                value: true,
            },
            speed: {
                label: "Speed",
                value: 1,
                min: -20,
                max: 20,
            },
            cameraSpeedNote: {
                label: "Note",
                value: "Not sure if I want speed on a slider or not.",
                editable: false,
                rows: true,
            },
        }),
        { store }
    );
    console.log("Camera controls:", controls);

    return (
        <LevaPanel
            store={store}
            fill
            flat
            titleBar={{
                title: "Camera",
                drag: false,
                filter: false,
            }}
            collapsed={true}
        />
    );
}
