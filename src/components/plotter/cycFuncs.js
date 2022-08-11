import * as THREE from "three";
import * as math from "mathjs";

export function randomizeParamInput(paramInput) {
  function rSign() {
    // Randomly assign positive or negative.
    return Math.floor(Math.random() * 2) ? "" : "-";
  };
  
  function rInt(min, max) {
    // Generate random integer in [min, max].
    return Math.floor(Math.random() * max) + min;
  };
  
  function rFact() {
    // Generate random factor.
    return math.evaluate(`${rSign()}${rInt(1, 5)}/${rInt(1, 5)}`).toFixed(2);
  };
  // Establish possible functions for theta and phi.
  const funcList = [
    `${rFact()}sin(${rFact()}t)`,
    `${rFact()}cos(${rFact()}t)`,
    `${rFact()}sin(${rFact()}t)`,
    `${rFact()}cos(${rFact()}t)`,
    `${rFact()}t`,
    `${rFact()}t`,
    `${rFact()}t`,
    `${rFact()}t`,
    `${rFact()}t`,
    `${rFact()}t`,
  ];

  const lilR = `${rInt(1, 4)}`;
  const d = paramInput.dEqLilR ? lilR : `${rInt(1, 4)}`;

  return {
    ...paramInput,
    theta: funcList[Math.floor(Math.random() * funcList.length)],
    phi: funcList[Math.floor(Math.random() * funcList.length)],
    bigR: `${rInt(2, 8)}`,
    lilR,
    d,
  }
}

function cleanEval(v) {
  switch(v) {
    case Infinity:
      return Number.MAX_SAFE_INTEGER/1000;
    case -Infinity:
      return -Number.MIN_SAFE_INTEGER/1000;
    case Number.isNaN:
      return 0;
    case undefined:
      return 0;
    default:
      return v || 0;
  }
}

export function evalParam(p) {
  try {
    cleanEval(math.evaluate(p.toLowerCase(), { t: 0 }));
    return true;
  } catch (error) {
    return false;
  }
}

export function calcCyc(paramInput) {
  const theta = math.parse(paramInput.theta.toLowerCase());
  const phi = math.parse(paramInput.phi.toLowerCase());
  const bigR = parseFloat(paramInput.bigR);
  const lilR = parseFloat(paramInput.lilR);
  const d = parseFloat(paramInput.d);
  const start = parseFloat(paramInput.start);
  const end = parseFloat(paramInput.end);
  const step = parseFloat(paramInput.step);

  const dTheta = math.derivative(theta, "t");
  const dPhi = math.derivative(phi, "t");
  const normDiv = `sqrt((${dPhi})^2+(${dTheta})^2*cos(${phi})^2)`;

  let sinTheta;
  let cosTheta;
  let sinPhi;
  let cosPhi;
  let normDivEval;
  let rrInt;
  let cosRrInt;
  let sinRrInt;
  let dThetaEval;
  let dPhiEval;
  let normX
  let normY
  let normZ
  let tan
  let tanX
  let tanY
  let tanZ
  let norm
  let cross;
  let integral = 0;
  const cycPos = [];
  const circPos = [];
  const circMatrix = [];
  const circAngle = [];

  for (
    let t = start;
    t < end + step;
    t += Math.abs(step) * Math.sign(end - start)
  ) {
    // I'm sure there's a better way to do this, but all the cleanEval calls
    // are to (hopefully) ensure all the calculations return easy-to-work-with
    // values.
    sinTheta = cleanEval(math.evaluate(`sin(${theta})`, { t }));
    cosTheta = cleanEval(math.evaluate(`cos(${theta})`, { t }));

    sinPhi = cleanEval(math.evaluate(`sin(${phi})`, { t }));
    cosPhi = cleanEval(math.evaluate(`cos(${phi})`, { t }));

    normDivEval = cleanEval(math.evaluate(normDiv, { t }));

    rrInt = cleanEval((bigR / lilR) * integral);
    integral += cleanEval(normDivEval * step);
    cosRrInt = cleanEval(Math.cos(rrInt));
    sinRrInt = cleanEval(Math.sin(rrInt));
    dThetaEval = cleanEval(dTheta.evaluate({ t }));
    dPhiEval = cleanEval(dPhi.evaluate({ t }));

    circPos.push(
      new THREE.Vector3(
        cleanEval((bigR + lilR) * cosTheta * cosPhi),
        cleanEval((bigR + lilR) * sinTheta * cosPhi),
        cleanEval((bigR + lilR) * sinPhi)
      )
    );

    normX = cleanEval(cosTheta * cosPhi);
    normY = cleanEval(sinTheta * cosPhi);
    normZ = cleanEval(sinPhi);

    tanX =
      cleanEval(-(dThetaEval * sinTheta * cosPhi + dPhiEval * cosTheta * sinPhi) /
      normDivEval);
    tanY =
      cleanEval((dThetaEval * cosTheta * cosPhi - dPhiEval * sinTheta * sinPhi) /
      normDivEval);
    tanZ = cleanEval((dPhiEval * cosPhi) / normDivEval);

    norm = new THREE.Vector3(normX, normY, normZ);
    tan = new THREE.Vector3(tanX, tanY, tanZ);
    cross = new THREE.Vector3().crossVectors(norm, tan);

    circMatrix.push(new THREE.Matrix4().makeBasis(norm, tan, cross));

    circAngle.push(cleanEval(rrInt));

    cycPos.push(
      new THREE.Vector3(
        cleanEval(cosTheta * cosPhi * (bigR + lilR - d * cosRrInt) +
          d *
            sinRrInt *
            ((dThetaEval * sinTheta * cosPhi +
              dPhiEval * cosTheta * sinPhi) /
              normDivEval)),
        cleanEval(sinTheta * cosPhi * (bigR + lilR - d * cosRrInt) -
          d *
            sinRrInt *
            ((dThetaEval * cosTheta * cosPhi -
              dPhiEval * sinTheta * sinPhi) /
              normDivEval)),
        cleanEval(sinPhi * (bigR + lilR - d * cosRrInt) -
          d * sinRrInt * ((dPhiEval * cosPhi) / normDivEval))
      )
    );
  }

  return {
    cycPos,
    circPos,
    circMatrix,
    circAngle,
  };
}
