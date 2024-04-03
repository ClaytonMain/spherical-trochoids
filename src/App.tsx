import { Environment, Loader, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Object3D } from "three";
import CameraDistanceController from "./CameraDistanceController";
import Effects from "./Effects";
import Interface from "./Interface/Interface";
import Lightformers from "./Lightformers";
import Lights from "./Lights";
import ShortcutWrapper from "./ShortcutWrapper/ShortcutWrapper";
import SphericalTrochoid from "./SphericalTrochoid/SphericalTrochoid";
import { useTemporary } from "./stores/useTemporary";

function App() {
    Object3D.DEFAULT_UP.set(0, 0, 1);
    const autoRotate = useTemporary((state) => state.autoRotate);
    const autoRotateSpeed = useTemporary((state) => state.autoRotateSpeed);
    const backgroundColor = useTemporary((state) =>
        state.levaStores.style?.get("Background.backgroundColor")
    );

    return (
        <Suspense fallback={<Loader />}>
            <ShortcutWrapper>
                <Canvas
                    shadows
                    camera={{ position: [8, -11, 5], near: 0.1, far: 100 }}
                    style={{ background: backgroundColor }}
                >
                    <OrbitControls
                        makeDefault
                        enableDamping
                        enablePan={false}
                        autoRotate={autoRotate}
                        autoRotateSpeed={autoRotateSpeed}
                        minDistance={3.0}
                        maxDistance={70.0}
                    />
                    <CameraDistanceController />
                    <Lights />
                    <SphericalTrochoid />
                    <Environment
                        frames={Infinity}
                        resolution={256}
                    >
                        <Lightformers />
                    </Environment>
                    <Effects />
                </Canvas>
                <Interface />
            </ShortcutWrapper>
        </Suspense>
    );
}

export default App;
