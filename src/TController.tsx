import { useFrame } from "@react-three/fiber";
import { useTemporary } from "./stores/useTemporary";

export const TController = () => {
    const tMin = useTemporary((state) => state.tMin);
    const tMax = useTemporary((state) => state.tMax);
    const checkedTMin = Math.min(tMin, tMax);
    const checkedTMax = Math.max(tMin, tMax);
    const tRange = checkedTMax - checkedTMin;

    useFrame((_, delta) => {
        useTemporary.setState({
            t:
                ((useTemporary.getState().t + delta - checkedTMin) % tRange) +
                checkedTMin,
        });
    });
    return null;
};

export default TController;
