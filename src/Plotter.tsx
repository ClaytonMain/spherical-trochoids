import Plot from "./plots/Plot.tsx";
// import { useTemporary } from "./stores/useTemporary.tsx";

/**
 * Plotter plots the plots. Overkill for this project since it'll
 * only ever be the one plot, but will be useful in a future project.
 */
const Plotter = () => {
    /**
     * TODO: Make plot parameters reference store.
     */
    // const plots = useTemporary((state) => state.plots);

    return (
        <>
            <Plot plotId={0} />
        </>
    );
};

export default Plotter;
