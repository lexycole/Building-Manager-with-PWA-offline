import React, { Suspense } from "react";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useProgress, Html, Stage, useGLTF } from "@react-three/drei";
import { getModelPathFromId } from "../../utils/helpers/modelPaths";

const Building3D = (props) => {
  const buildingName = props.name;

  return (
    <Canvas>

      <Suspense fallback={<Loader />}>
        <Stage>
          <Model buildingId={buildingName} />
        </Stage>
      </Suspense>

      <OrbitControls />
    </Canvas>
  );
};

const Model = ({ buildingId }) => {
  const file = getModelPathFromId(buildingId)
  const model = useGLTF(file)
  return <primitive object={model.scene} />
}

function Loader() {
  const { active, progress } = useProgress();

  return (
    <Html center>
      {progress} % loaded {active}
    </Html>
  );
}

export default Building3D;
