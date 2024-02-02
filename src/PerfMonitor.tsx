import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { useTemporary } from "./stores/useTemporary.tsx";

export const PerfMonitor = () => {
    const perfMonitorVisible = useTemporary(
        (state) => state.perfMonitorVisible
    );

    const perfControls = useControls("Performance Monitor", {
        visible: {
            value: perfMonitorVisible,
            onChange: (perfMonitorVisible) =>
                useTemporary.setState({ perfMonitorVisible }),
        },
        position: {
            options: ["top-left", "bottom-right", "bottom-left"],
        },
    });
    return perfMonitorVisible && <Perf position={perfControls.position} />;
};

export default PerfMonitor;
