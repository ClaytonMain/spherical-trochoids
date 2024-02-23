import { useControls } from "leva";
import { useTemporary } from "../stores/useTemporary";
import SphericalTrochoid from "./SphericalTrochoid/SphericalTrochoid";

interface PlotControlsProps {
    plotId: number;
}

const PlotControls = ({ plotId }: PlotControlsProps) => {
    const setActivePlotType = useTemporary((state) => state.setActivePlotType);
    useControls(`Plot ${plotId}`, {
        plotType: {
            label: "Plot Type",
            options: ["Spherical Trochoid", "None"],
            onChange: (value) => setActivePlotType(plotId, value),
        },
    });
    return null;
};

interface PlotProps {
    plotId: number;
}

const Plot = ({ plotId }: PlotProps) => {
    const plotIsActive = useTemporary((state) => state.plots[plotId].isActive);
    const sphericalTrochoidIsActive = useTemporary(
        (state) => state.plots[plotId].sphericalTrochoid.isActive
    );
    return (
        <>
            {plotIsActive && <PlotControls plotId={plotId} />}
            {plotIsActive && sphericalTrochoidIsActive && (
                <SphericalTrochoid plotId={plotId} />
            )}
        </>
    );
};

export default Plot;
