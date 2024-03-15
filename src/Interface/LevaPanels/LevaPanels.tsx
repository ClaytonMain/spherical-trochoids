import AnimationControls from "./AnimationControls";
import CameraControls from "./CameraControls";
import ParametersControls from "./InputControls";
import ParameterHistoryPanel from "./ParameterHistoryPanel";
import RandomizationControls from "./RandomizationControls";
import StyleControls from "./StyleControls";

/**
 * TODO:
 *  - Less of a "todo" and more of a note: Might be able to handle
 *      the displayed field changes between "Fixed Interval" and
 *      "Endless" by just showing and hiding separate LevaPanel
 *      components. Not sure if that's a bad idea or not, but don't
 *      want to forget the idea.
 */

export default function LevaPanels() {
    return (
        <>
            <CameraControls />
            <AnimationControls />
            <ParameterHistoryPanel />
            <ParametersControls />
            <RandomizationControls />
            <StyleControls />
        </>
    );
}
