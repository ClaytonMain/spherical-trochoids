import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { folder, useControls, Leva} from "leva";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MeshLine, MeshLineMaterial } from "three.meshline";
import { DoubleSide, Vector3, Object3D } from "three";
import "./Plotter.css";
import ControlPanel from "../controlPanel/ControlPanel";
import { useStore } from "../../store";

const CYCLOIDCOLOR = "#4d7c8a";
const SPHERECOLOR = "#fe5f55";
const CIRCLECOLOR = "#f0b67f";

extend({ OrbitControls });
extend({ MeshLine, MeshLineMaterial });

function Cycloid() {
  const ind = useStore(state => state.ind);
  const cycPos = useStore(state => state.calculations.cycPos);
  const mesh = useRef();
  const material = useRef();
  const geometry = useRef();

  useControls({
    Style: folder({
      Cycloid: folder({
        Color: {
          value: CYCLOIDCOLOR,
          onChange: v => material.current && material.current.color.set(v),
        },
        Visible: {
          value: true,
          onChange: v => {
            if (material.current) {
              material.current.visible = v;
            }
          },
        },
        Width: {
          value: 0.08,
          min: 0,
          max: 0.5,
          onChange: v => {
            if (material.current) {
              material.current.lineWidth = v;
            }
          },
        },
      }),
    }),
  });

  useFrame(() => {
    geometry.current.drawRange.count = ind * 6;
  });

  return (
    <mesh ref={mesh}>
      <meshLine attach="geometry" ref={geometry} points={cycPos} />
      <meshLineMaterial attach="material" ref={material} />
    </mesh>
  );
}

function Sphere() {
  const bigR = useStore(state => state.paramDisp.bigR);
  const mesh = useRef();
  const material = useRef();

  useControls({
    Style: folder({
      Sphere: folder({
        Color: {
          value: SPHERECOLOR,
          onChange: v => material.current && material.current.color.set(v),
        },
        Opacity: {
          value: 0.95,
          min: 0.0,
          max: 1.0,
          step: 0.01,
          onChange: v => {
            if (material.current) {
              material.current.opacity = v;
            }
          },
        },
        Visible: {
          value: true,
          onChange: v => {
            if (material.current) {
              material.current.visible = v;
            }
          },
        },
      }),
    }),
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry attach="geometry" args={[bigR, 32, 32]} />
      <meshStandardMaterial
        attach="material"
        ref={material}
        toneMapped={false}
        transparent
        depthTest
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

function Circle() {
  const lilR = useStore(state => state.paramDisp.lilR);
  const circPos = useStore(state => state.calculations.circPos);
  const circMatrix = useStore(state => state.calculations.circMatrix);
  const circAngle = useStore(state => state.calculations.circAngle);
  const material = useRef();
  const mesh = useRef();
  const ind = useRef(useStore.getState().ind);

  useControls({
    Style: folder({
      Circle: folder({
        Color: {
          value: CIRCLECOLOR,
          onChange: v => material.current && material.current.color.set(v),
        },
        Visible: {
          value: true,
          onChange: v => {
            if (material.current) {
              material.current.visible = v;
            }
          },
        },
      }),
    }),
  });

  useEffect(() =>
    useStore.subscribe(state => {
      ind.current = state.ind;
    })
  );
  useFrame(() => {
    if (circPos[ind.current]) {
      mesh.current.position.set(
        circPos[ind.current].x,
        circPos[ind.current].y,
        circPos[ind.current].z
      );
      mesh.current.setRotationFromMatrix(circMatrix[ind.current]);
      mesh.current.rotateZ(circAngle[ind.current] + Math.PI / 2);
    }
  });
  return (
    <mesh ref={mesh}>
      <circleGeometry attach="geometry" args={[lilR, 32]} />
      <meshStandardMaterial
        attach="material"
        ref={material}
        side={DoubleSide}
      />
      <DLine />
    </mesh>
  );
}

function DLine() {
  const d = useStore(state => state.paramDisp.d);
  const verts = [new Vector3(0, 0, 0), new Vector3(0, d, 0)];
  const mesh = useRef();
  const material = useRef();
  const geometry = useRef();

  useControls({
    Style: folder({
      "d Line": folder({
        Color: {
          value: CYCLOIDCOLOR,
          onChange: v => material.current && material.current.color.set(v),
        },
        Visible: {
          value: true,
          onChange: v => {
            if (material.current) {
              material.current.visible = v;
            }
          },
        },
        Width: {
          value: 0.08,
          min: 0,
          max: 0.5,
          onChange: v => {
            if (material.current) {
              material.current.lineWidth = v;
            }
          },
        },
      }),
    }),
  });

  return (
    <mesh ref={mesh}>
      <meshLine attach="geometry" ref={geometry} points={verts} />
      <meshLineMaterial attach="material" ref={material} />
    </mesh>
  );
}

function CameraControls() {
  const {
    camera,
    gl: { domElement },
  } = useThree();
  const controls = useRef();
  useFrame(() => {
    controls.current.update();
  });
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      enableDamping
      enablePan={false}
      autoRotate={useStore(state => state.autoRotate)}
      autoRotateSpeed={useStore(state => state.autoRotateSpeed)}
    />
  );
}

Object3D.DefaultUp.set(0, 0, 1);

function Scene() {
  return (
    <Canvas camera={{ position: [10, 10, 10] }} linear>
      <CameraControls position={[10, 10, 10]} />
      <ControlPanel />
      <ambientLight intensity={1} />
      <Sphere />
      <Cycloid />
      <Circle />
    </Canvas>
  );
}

function Plotter() {
  return (
    <div className="canvasWrapper">
      <Leva titleBar={{title: "👈 Click to Toggle Panel"}} />
      <Scene />
    </div>
  );
}

export default Plotter;
