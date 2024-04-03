import AnimationControls from "./AnimationControls";
import CameraControls from "./CameraControls";
import ParametersControls from "./InputControls";
import LightControls from "./LightControls";
import ParameterHistoryPanel from "./ParameterHistoryPanel";
import RandomizationControls from "./RandomizationControls";
import StyleControls from "./StyleControls";

export default function LevaPanels() {
    return (
        <>
            <CameraControls />
            <AnimationControls />
            <ParameterHistoryPanel />
            <ParametersControls />
            <RandomizationControls />
            <StyleControls />
            <LightControls />
        </>
    );
}
