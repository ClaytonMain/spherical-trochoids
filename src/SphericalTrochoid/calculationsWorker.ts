import { InputTypes, createParser } from "./sharedFunctions";

/**
 * Just a reminder, the calculations are (mostly) performed in the
 * "calculationsWorker.ts" file, but most of the math function & variable
 * definitions are actually in the "shared.tsx" file.
 */

self.onmessage = (message) => {
    const calculated = calculatePoints(message.data);
    self.postMessage(calculated);
};

const calculatePoints = (inputs: InputTypes) => {
    let calculationStatus = "failed";
    const parser = createParser(inputs);

    if (!parser) return { calculationStatus };

    let curvePoints = new Float32Array();
    let lValues = new Float32Array();
    let transformMatrixValues = new Float32Array();

    if (inputs.calculationType == "Fixed Interval") {
        const numberOfPoints = Math.ceil(
            (inputs.curveTRange[1] - inputs.curveTRange[0]) / inputs.stepSize
        );
        curvePoints = new Float32Array(numberOfPoints * 3);
        lValues = new Float32Array(numberOfPoints);
        transformMatrixValues = new Float32Array(numberOfPoints * 16);

        let i = 0;
        let curveVec = null;
        let transformMatrix = null;

        for (
            let t = inputs.curveTRange[0];
            t <= inputs.curveTRange[1];
            t += inputs.stepSize
        ) {
            parser.set("t", t);

            if (inputs.outerGeometryShape === "Circle") {
                parser.evaluate("alpha = L / r");
                curveVec = parser.evaluate("curveVec(t)").toArray();
                // curveVec = parser.evaluate("contactPoint(t)").toArray();
            } else if (inputs.outerGeometryShape === "Sphere") {
                parser.evaluate(
                    "outerRotationMatrix = rotationMatrix(dAlpha, outerCenterBasisZ(t))\
                        * outerRotationMatrix"
                );
                transformMatrix = parser
                    .evaluate("flatten(transpose(transformMatrix(t)))")
                    .toArray();
                curveVec = parser.evaluate("curveVec(t)").toArray();
                // curveVec = parser.evaluate("contactPoint(t)").toArray();
            } else {
                return { calculationStatus };
            }

            curvePoints[i * 3 + 0] = curveVec[0];
            curvePoints[i * 3 + 1] = curveVec[1];
            curvePoints[i * 3 + 2] = curveVec[2];

            lValues[i] = parser.evaluate("L");

            if (inputs.outerGeometryShape === "Sphere") {
                transformMatrixValues[i * 16 + 0] = transformMatrix[0];
                transformMatrixValues[i * 16 + 1] = transformMatrix[1];
                transformMatrixValues[i * 16 + 2] = transformMatrix[2];
                transformMatrixValues[i * 16 + 3] = transformMatrix[3];
                transformMatrixValues[i * 16 + 4] = transformMatrix[4];
                transformMatrixValues[i * 16 + 5] = transformMatrix[5];
                transformMatrixValues[i * 16 + 6] = transformMatrix[6];
                transformMatrixValues[i * 16 + 7] = transformMatrix[7];
                transformMatrixValues[i * 16 + 8] = transformMatrix[8];
                transformMatrixValues[i * 16 + 9] = transformMatrix[9];
                transformMatrixValues[i * 16 + 10] = transformMatrix[10];
                transformMatrixValues[i * 16 + 11] = transformMatrix[11];
                transformMatrixValues[i * 16 + 12] = transformMatrix[12];
                transformMatrixValues[i * 16 + 13] = transformMatrix[13];
                transformMatrixValues[i * 16 + 14] = transformMatrix[14];
                transformMatrixValues[i * 16 + 15] = transformMatrix[15];
            }

            i += 1;

            if (inputs.outerGeometryShape === "Circle") {
                parser.evaluate("L = L + norm(contactPointDt(t)) * stepSize");
            } else if (inputs.outerGeometryShape === "Sphere") {
                parser.evaluate(
                    "dAlpha = norm(outerCenterDt(t)) / r * stepSize"
                );
            }
        }
    }

    calculationStatus = "success";

    return {
        calculationStatus,
        curvePoints,
        lValues,
        transformMatrixValues,
        inputs,
    };
};
