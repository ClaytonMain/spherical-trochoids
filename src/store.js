import zustand from "zustand";
import * as THREE from "three";
import { calcCyc, randomizeParamInput } from "./components/plotter/cycFuncs";

const defaultParamInput = {
  theta: "2*t",
  phi: "t",
  bigR: 4,
  lilR: 1,
  dEqLilR: true,
  d: 1,
  start: 0.0,
  end: 50.0,
  step: 0.01,
};

const clock = new THREE.Clock();
let delta = 0;
const interval = 1 / 60;
let nextT = 0;

const [useStore, api] = zustand((set, get) => ({
  isEditing: false,
  enterWhileEdit: false,
  curveSpeed: 1,
  animateCurve: true,
  scrubbing: false,
  paramDisp: defaultParamInput,
  paramInput: defaultParamInput,
  setParamDisp: f => set({ paramDisp: f }),
  setParamInput: f => set({ paramInput: f }),
  calculateValues: f => calcCyc(f),
  setCalculations: c => set({ calculations: c }),
  tVal: 0,
  ind: 5000,
  autoRotate: true,
  autoRotateSpeed: 0.5,
  calculations: calcCyc(defaultParamInput),
  autoRandomize: true,
  advance() {
    delta += clock.getDelta();
    // If enough time has passed:
    if (delta > interval) {
      // If we want to animate the curve & the timeline isn't being scrubbed:
      if (get().animateCurve && !get().scrubbing) {
        // Get the next t value.
        nextT = get().tVal + get().paramDisp.step * get().curveSpeed;
        // Check if the next tVal > end:
        if (nextT > get().paramDisp.end) {
          // If autoRandomize, randomize.
          if (get().autoRandomize) {
            const newParamInput = randomizeParamInput(get().paramDisp);
            const newCalculations = get().calculateValues(newParamInput);
            set({
              paramDisp: newParamInput,
              calculations: newCalculations,
            });
          }
          // Regardless of autoRandomize, update tVal to start.
          set(state => ({
            tVal: parseFloat(state.paramDisp.start),
          }));
        } else if (nextT < get().paramDisp.start) {
          set(state => ({
            tVal: parseFloat(state.paramDisp.start),
          }));
        } else {
          // If tVal <= end update tVal.
          set({ tVal: nextT });
        }
      }
      set(state => ({
        ind: Math.round(
          Math.abs(state.tVal - state.paramDisp.start) / state.paramDisp.step
        ),
      }));
      delta %= interval;
    }
  },
  setScrubbing: v => set({ scrubbing: v }),
}));

export { useStore, api };
