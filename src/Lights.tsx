import { DataInput } from "leva/dist/declarations/src/types";
import { useTemporary } from "./stores/useTemporary";

const Lights = () => {
    const lightsStore = useTemporary((state) => state.levaStores.lights);

    const ambientEnabled = lightsStore?.useStore(
        (state) =>
            (state.data["Ambient.ambientEnabled"] as DataInput).value as boolean
    );
    const ambientIntensity = lightsStore?.useStore(
        (state) =>
            (state.data["Ambient.ambientIntensity"] as DataInput)
                .value as number
    );
    const ambientColor = lightsStore?.useStore(
        (state) =>
            (state.data["Ambient.ambientColor"] as DataInput)
                .value as THREE.Color
    );

    const directionalEnabled = lightsStore?.useStore(
        (state) =>
            (
                state.data[
                    "Directional Light.directionalLightEnabled"
                ] as DataInput
            ).value as boolean
    );
    const directionalIntensity = lightsStore?.useStore(
        (state) =>
            (
                state.data[
                    "Directional Light.directionalLightIntensity"
                ] as DataInput
            ).value as number
    );
    const directionalColor = lightsStore?.useStore(
        (state) =>
            (state.data["Directional Light.directionalLightColor"] as DataInput)
                .value as THREE.Color
    );
    const directionalPosition = lightsStore?.useStore(
        (state) =>
            (
                state.data[
                    "Directional Light.directionalLightPosition"
                ] as DataInput
            ).value as [number, number, number]
    );

    return (
        <>
            <ambientLight
                visible={ambientEnabled}
                intensity={ambientIntensity}
                color={ambientColor}
            />
            <directionalLight
                visible={directionalEnabled}
                intensity={directionalIntensity}
                color={directionalColor}
                position={directionalPosition}
            />
        </>
    );
};

export default Lights;
