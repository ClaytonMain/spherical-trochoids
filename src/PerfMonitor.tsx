import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import { PerfHeadless, getPerf, usePerf } from "r3f-perf";
import { useEffect, useRef } from "react";

/**
 * Not using this because, ironically, it was causing the FPS to
 * degrade over time, lol.
 */

export const PerfMonitor = () => {
    const [, set] = useControls("Performance Monitor", () => ({
        maxMemory: {
            value: -1.0,
            pad: 3,
            disabled: true,
        },
        gpu: {
            value: -1.0,
            pad: 3,
            disabled: true,
        },
        cpu: {
            value: -1.0,
            pad: 3,
            disabled: true,
        },
        mem: {
            value: -1.0,
            pad: 3,
            disabled: true,
        },
        fps: {
            value: -1.0,
            pad: 3,
            disabled: true,
        },
    }));

    const log = usePerf((state) => state.log);

    useEffect(() => {
        if (log) {
            set({
                maxMemory: log.maxMemory,
                gpu: log.gpu,
                cpu: log.cpu,
                mem: log.mem,
                fps: log.fps,
            });
        }
    }, [log, set]);

    // usePerf()

    // useFrame(() => {
    //     console.log(perfRef);

    //     if (log) {
    //         set({
    //             maxMemory: log.maxMemory,
    //             gpu: log.gpu,
    //             cpu: log.cpu,
    //             mem: log.mem,
    //             fps: log.fps,
    //         });
    //     }
    // });

    const perfRef = useRef();

    return <PerfHeadless logsPerSecond={1} />;
};

export default PerfMonitor;
