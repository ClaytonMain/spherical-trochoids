import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import { useSaved } from "./stores/useSaved";
import { useTemporary } from "./stores/useTemporary";

const CameraDistanceController = () => {
    const autoZoomToFit = useTemporary((state) => state.autoZoomToFit);
    const repositionCamera = useTemporary((state) => state.repositionCamera);
    const currentPlot = useSaved((state) => state.currentPlot);
    const shape = currentPlot.innerGeometryShape;
    const R1 = currentPlot.innerGeometryRadius1;
    const R2 = shape === "Torus" ? currentPlot.innerGeometryRadius2 : 0;
    const r = currentPlot.outerGeometryRadius;
    const d = currentPlot.dLineRadius;
    const targetDistance = (R1 + R2 + r + Math.max(0, Math.abs(d - r))) * 3;

    useEffect(() => {
        if (repositionCamera) {
            const timeoutId = setTimeout(() => {
                useTemporary.setState({ repositionCamera: false });
            }, 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [autoZoomToFit, repositionCamera]);

    useFrame((state) => {
        if (!repositionCamera) return;
        if (autoZoomToFit) {
            state.camera.position.lerpVectors(
                state.camera.position,
                state.camera.position
                    .clone()
                    .multiplyScalar(
                        targetDistance / state.camera.position.length()
                    ),
                0.015
            );
        }
    });

    return <></>;
};

export default CameraDistanceController;
