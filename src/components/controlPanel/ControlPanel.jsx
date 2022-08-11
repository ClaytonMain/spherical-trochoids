import { React, useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { folder, useControls, button, LevaInputs } from "leva";
import { Color } from "three";
import { useStore } from "../../store";
import { randomizeParamInput, evalParam } from "../plotter/cycFuncs";

function AnimationControls() {
  const paramDisp = useRef(useStore.getState().paramDisp);
  const setScrubbing = useStore(state => state.setScrubbing);
  const animateCurve = useRef(useStore.getState().animateCurve);
  const tVal = useRef(useStore.getState().tVal);
  const curveSpeed = useStore(state => state.curveSpeed);
  const autoRotateSpeed = useStore(state => state.autoRotateSpeed);
  const autoRotate = useStore(state => state.autoRotate);
  const onEditStart = () => {
    setScrubbing(true);
  };
  const onEditEnd = () => {
    setScrubbing(false);
  };
  const [, set] = useControls(
    () => ({
      Animation: folder({
        Curve: folder({
          tValControl: {
            label: "t",
            hint: 'The current value of "t" for the displayed curve.',
            value: tVal.current,
            min: paramDisp.current.start,
            max: paramDisp.current.end,
            step: paramDisp.current.step,
            onChange: v => useStore.setState({ tVal: v }),
            transient: false,
            onEditStart,
            onEditEnd,
          },
          animateCurveControl: {
            label: "Animate",
            hint: "Check to animate the curve, uncheck to pause the curve animation (basically a play / pause button).",
            value: animateCurve.current,
            onChange: v => useStore.setState({ animateCurve: v }),
            transient: false,
          },
          curveSpeedControl: {
            label: "Speed",
            hint: 'The speed at which "t" in incremented (playback speed). Does nothing when "Animate" is unchecked.',
            oneLineLabels: true,
            value: curveSpeed,
            min: 0.1,
            max: 20,
            step: 0.1,
            onChange: v => useStore.setState({ curveSpeed: v }),
          },
        }),
        Camera: folder({
          autoRotateControl: {
            label: "Rotate",
            hint: "Check to auto-rotate the camera around the central sphere. Uncheck to disable auto-rotate.",
            value: autoRotate,
            onChange: v => useStore.setState({ autoRotate: v }),
          },
          rotateSpeedControl: {
            label: "Speed",
            hint: 'The speed at which to rotate the camera. Use a negative value to rotate in the opposite direction. Does nothing when "Rotate" is unchecked.',
            value: autoRotateSpeed,
            min: -20,
            max: 20,
            step: 0.1,
            onChange: v => useStore.setState({ autoRotateSpeed: v }),
          },
        }),
      }),
    }),
    [paramDisp.current, animateCurve.current]
  );

  useEffect(() => {
    useStore.subscribe(state => {
      tVal.current = state.tVal;
      paramDisp.current = state.paramDisp;
      animateCurve.current = state.animateCurve;
    });
  });

  useFrame(() => {
    set({
      tValControl: tVal.current,
      animateCurveControl: animateCurve.current,
    });
  });
  return null;
}

function Parameters() {
  const paramInput = useRef(useStore.getState().paramInput);
  const paramDisp = useRef(useStore.getState().paramDisp);
  const setParamDisp = useStore(state => state.setParamDisp);
  const setCalculations = useStore(state => state.setCalculations);
  const setParamInput = useStore(state => state.setParamInput);
  const calculateValues = useStore(state => state.calculateValues);
  const autoRandomize = useStore(state => state.autoRandomize);
  const isEditing = useRef(useStore.getState().isEditing);
  const enterWhileEdit = useRef(useStore.getState().enterWhileEdit);
  const animateCurve = useRef(useStore.getState().animateCurve);
  const inputIssues = useRef({});

  const handleSubmit = () => {
    if (!Object.keys(inputIssues.current).length) {
      setParamDisp(paramInput.current);
      setCalculations(calculateValues(paramInput.current));
    }
  };

  const setParamInputSubset = v => {
    setParamInput({ ...paramInput.current, ...v });
    if (enterWhileEdit.current) {
      handleSubmit();
      useStore.setState({ enterWhileEdit: false });
    }
  };

  const handleChange = (v, e) => {
    switch (true) {
      case ["theta", "phi"].includes(e.key):
        if (evalParam(v)) {
          delete inputIssues.current[e.key];
          setParamInputSubset({ [e.key]: v });
        } else {
          inputIssues.current[e.key] = true;
          setParamInputSubset({ [e.key]: "Invalid input!" });
        }
        break;
      case e.key === "start" && v >= paramInput.current.end:
        setParamInputSubset({ start: v - 1, end: v });
        break;
      case e.key === "end" && v <= paramInput.current.start:
        setParamInputSubset({ end: v + 1, start: v });
        break;
      case e.key === "lilR" && paramInput.current.dEqLilR:
        setParamInputSubset({ lilR: v, d: v });
        break;
      case e.key === "d" && paramInput.current.dEqLilR:
        setParamInputSubset({ d: v, lilR: v });
        break;
      default:
        setParamInputSubset({ [e.key]: v });
    }
  };

  const onEditStart = () => {
    useStore.setState({ isEditing: true });
  };

  const onEditEnd = () => {
    useStore.setState({ isEditing: false, enterWhileEdit: false });
  };

  const handleRandomize = () => {
    const newParamDisp = randomizeParamInput(paramInput.current);
    setParamDisp(newParamDisp);
    setCalculations(calculateValues(newParamDisp));
  };

  useEffect(() => {
    const keyDownHandler = e => {
      switch (e.key.toLowerCase()) {
        case "enter":
          if (isEditing.current) {
            useStore.setState({ enterWhileEdit: true });
          } else {
            handleSubmit();
          }
          break;
        case "r":
          handleRandomize();
          break;
        case " ":
          useStore.setState({ animateCurve: !animateCurve.current });
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  });

  const paramBounds = {
    t: [0, 300],
    bigR: [0.1, 10],
    lilR: [-10, 10],
    d: [-10, 10],
    step: [0.01, 0.1],
  };

  const [, set] = useControls(() => ({
    Parameters: folder({
      "Current Parameters (Display-Only)": folder({
        currTheta: {
          label: "Theta",
          hint: 'The "Theta" function for the current curve.',
          value: paramDisp.current.theta,
          type: LevaInputs.STRING,
          disabled: true,
        },
        currPhi: {
          label: "Phi",
          hint: 'The "Phi" function for the current curve.',
          value: paramDisp.current.phi,
          type: LevaInputs.STRING,
          disabled: true,
        },
        currBigR: {
          label: "R",
          hint: "The current radius of the central sphere.",
          value: paramDisp.current.bigR,
          type: LevaInputs.NUMBER,
          min: paramBounds.bigR[0],
          max: paramBounds.bigR[1],
          disabled: true,
        },
        currLilR: {
          label: "r",
          hint: "The current radius of the circle rolling on the central sphere.",
          value: paramDisp.current.lilR,
          type: LevaInputs.NUMBER,
          min: paramBounds.lilR[0],
          max: paramBounds.lilR[1],
          disabled: true,
        },
        currD: {
          label: "d",
          hint: "The current distance from the center of the circle to the point from which the curve is drawn.",
          value: paramDisp.current.d,
          type: LevaInputs.NUMBER,
          min: paramBounds.d[0],
          max: paramBounds.d[1],
          disabled: true,
        },
        currStart: {
          label: "Start",
          hint: 'The current start / minimum value for "t".',
          value: paramDisp.current.start,
          type: LevaInputs.NUMBER,
          min: paramBounds.t[0],
          max: paramBounds.t[1],
          disabled: true,
        },
        currEnd: {
          label: "End",
          hint: 'The current end / maximum value for "t".',
          value: paramDisp.current.end,
          type: LevaInputs.NUMBER,
          min: paramBounds.t[0],
          max: paramBounds.t[1],
          disabled: true,
        },
        currStep: {
          label: "step",
          hint: "The step value used when calculating the current curve.",
          value: paramDisp.current.step,
          type: LevaInputs.NUMBER,
          min: paramBounds.step[0],
          max: paramBounds.step[1],
          disabled: true,
        },
      }),
      Input: folder({
        theta: {
          label: "Theta",
          hint: 'A function with respect to the variable "t" controlling the angle of rotation within the XZ plane.',
          value: paramInput.current.theta,
          type: LevaInputs.STRING,
          onChange: (v, _, e) => handleChange(v, e),
          transient: false,
          onEditStart,
          onEditEnd,
        },
        phi: {
          label: "Phi",
          hint: 'A function with respect to the variable "t" controlling the angle of rotation within the XY plane.',
          value: paramInput.current.phi,
          type: LevaInputs.STRING,
          onChange: (v, _, e) => handleChange(v, e),
          transient: false,
          onEditStart,
          onEditEnd,
        },
        bigR: {
          label: "R",
          hint: "The radius of the central sphere.",
          value: paramInput.current.bigR,
          type: LevaInputs.NUMBER,
          min: paramBounds.bigR[0],
          max: paramBounds.bigR[1],
          onChange: (v, _, e) => handleChange(v, e),
          transient: false,
          onEditStart,
          onEditEnd,
        },
        lilR: {
          label: "r",
          hint: "The radius of the circle rolling on the central sphere. Setting this to a negative value will cause the circle to roll inside of the central sphere.",
          value: paramInput.current.lilR,
          type: LevaInputs.NUMBER,
          min: paramBounds.lilR[0],
          max: paramBounds.lilR[1],
          onChange: (v, _, e) => handleChange(v, e),
          transient: false,
          onEditStart,
          onEditEnd,
        },
        dEqLilR: {
          label: "d = r",
          hint: 'Forces "d" to equal "r". Input for "d" is disabled while this is checked. Also forces the randomization function to keep "d" equal to "r".',
          value: paramInput.current.dEqLilR,
          type: LevaInputs.BOOLEAN,
          onChange: (v, _, e) => handleChange(v, e),
          transient: false,
          onEditStart,
          onEditEnd,
        },
        d: {
          value: paramInput.current.d,
          hint: "The distance from the center of the circle to the point from which the curve is drawn.",
          type: LevaInputs.NUMBER,
          min: paramBounds.d[0],
          max: paramBounds.d[1],
          onChange: (v, _, e) => handleChange(v, e),
          transient: false,
          onEditStart,
          onEditEnd,
        },
        start: {
          label: "Start",
          hint: 'The start / minimum value for "t". Also used in the randomization function. Warning: Increasing the distance between the start and end values and / or setting a very small step size can negatively impact performance and possibly cause your browser to run slowly or crash.',
          value: paramInput.current.start,
          type: LevaInputs.NUMBER,
          min: paramBounds.t[0],
          max: paramBounds.t[1],
          step: 1,
          onChange: (v, _, e) => handleChange(v, e),
          transient: false,
          onEditStart,
          onEditEnd,
        },
        end: {
          label: "End",
          hint: 'The end / maximum value for "t". Also used in the randomization function. Warning: Increasing the distance between the start and end values and / or setting a very small step size can negatively impact performance and possibly cause your browser to run slowly or crash.',
          value: paramInput.current.end,
          type: LevaInputs.NUMBER,
          min: paramBounds.t[0],
          max: paramBounds.t[1],
          step: 1,
          onChange: (v, _, e) => handleChange(v, e),
          transient: false,
          onEditStart,
          onEditEnd,
        },
        step: {
          label: "Step",
          hint: "The step value used when calculating the curve. A smaller value will result in a smoother curve (usually), but at the cost of performance. Also used in the randomization function. Warning: Increasing the distance between the start and end values and / or setting a very small step size can negatively impact performance and possibly cause your browser to run slowly or crash.",
          value: paramInput.current.step,
          type: LevaInputs.NUMBER,
          min: paramBounds.step[0],
          max: paramBounds.step[1],
          step: 0.01,
          onChange: (v, _, e) => handleChange(v, e),
          transient: false,
          onEditStart,
          onEditEnd,
        },
        Submit: button(handleSubmit),
      }),
      Randomize: button(handleRandomize),
      autoRandomizeControl: {
        label: "Auto Randomize",
        hint: 'Automatically generates a semi-randomized curve once the "t" value within "Animation > Curve" reaches its maximum value.',
        value: autoRandomize,
        onChange: v => useStore.setState({ autoRandomize: v }),
      },
    }),
  }));

  useStore(state => state.paramDisp);

  useEffect(() => {
    useStore.subscribe(
      state => {
        paramInput.current = state.paramInput;
        paramDisp.current = state.paramDisp;
        isEditing.current = state.isEditing;
        enterWhileEdit.current = state.enterWhileEdit;
        animateCurve.current = state.animateCurve;
      },
      // This set seems really, uhh, inefficient? But it works, so...
      set({
        theta: useStore.getState().paramInput.theta,
        phi: useStore.getState().paramInput.phi,
        lilR: useStore.getState().paramInput.lilR,
        d: useStore.getState().paramInput.d,
        dEqLilR: useStore.getState().paramInput.dEqLilR,
        start: useStore.getState().paramInput.start,
        end: useStore.getState().paramInput.end,
        currTheta: useStore.getState().paramDisp.theta,
        currPhi: useStore.getState().paramDisp.phi,
        currBigR: useStore.getState().paramDisp.bigR,
        currLilR: useStore.getState().paramDisp.lilR,
        currD: useStore.getState().paramDisp.d,
        currStart: useStore.getState().paramDisp.start,
        currEnd: useStore.getState().paramDisp.end,
        currStep: useStore.getState().paramDisp.step,
      })
    );
  });
  return null;
}

function StyleControls() {
  const scene = useThree(state => state.scene);
  useControls({
    Style: folder({
      Background: folder({
        Color: {
          // value: "#3a3042",
          value: "#eef5db",
          onChange: v => {
            if (scene) {
              scene.background = new Color(v);
            }
          },
        },
      }),
    }),
  });
  return null;
}

function ControlPanel() {
  return (
    <>
      <AnimationControls />
      <Parameters />
      <StyleControls />
    </>
  );
}

export default ControlPanel;
