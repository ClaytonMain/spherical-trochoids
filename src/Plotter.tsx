import { MeshlineLiveCurve, TrailCurve } from "./Curves.tsx";
import TController from "./TController.tsx";

export const Plotter = () => {
    return (
        <>
            <TController />
            {/* <TrailCurve /> */}
            <MeshlineLiveCurve />
        </>
    );
};

export default Plotter;
