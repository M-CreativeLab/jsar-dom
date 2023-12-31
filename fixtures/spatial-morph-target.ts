const scene = spatialDocument.scene;
const sphereElement = spatialDocument.querySelector('sphere');

const sphere = sphereElement.asNativeType();
const sphere2 = BABYLON.Mesh.CreateSphere('sphere2', 16, 2, scene);
sphere2.setEnabled(false);
sphere2.updateMeshPositions(function scrambleUp(data) {
  for (let index = 0; index < data.length; index++) {
    data[index] += 0.4 * Math.random();
  }
});

const manager = new BABYLON.MorphTargetManager();
sphere.morphTargetManager = manager;

const target0 = BABYLON.MorphTarget.FromMesh(sphere2, 'sphere2', 0.25);
manager.addTarget(target0);
let angle = 0;

scene.registerBeforeRender(function () {
  target0.influence = Math.sin(angle) * Math.sin(angle);
  angle += 0.01;
});
