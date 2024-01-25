const scene = spatialDocument.scene;

// Material
const matPlan = new BABYLON.StandardMaterial('matPlan1', scene);
matPlan.backFaceCulling = false;
matPlan.emissiveColor = new BABYLON.Color3(0.2, 1, 0.2);

const matBB = new BABYLON.StandardMaterial('matBB', scene);
matBB.emissiveColor = new BABYLON.Color3(1, 1, 1);
matBB.wireframe = true;

// Intersection point
const pointToIntersect = new BABYLON.Vector3(-30, 0, 0);
const mOrigin = BABYLON.Mesh.CreateSphere('origin', 4, 0.3, scene);
mOrigin.position = pointToIntersect;
mOrigin.material = matPlan;

// Create two planes
const plan1 = BABYLON.MeshBuilder.CreatePlane('plane1', {
  size: 20,
  sideOrientation: BABYLON.Mesh.DOUBLESIDE,
}, scene);
plan1.position = new BABYLON.Vector3(13, 0, 0);
plan1.rotation.x = -Math.PI / 4;
plan1.material = matPlan;

const plan2 = BABYLON.MeshBuilder.CreatePlane('plane2', {
  size: 20,
  sideOrientation: BABYLON.Mesh.DOUBLESIDE,
}, scene);
plan2.position = new BABYLON.Vector3(-13, 0, 0);
plan2.rotation.x = -Math.PI / 4;
plan2.material = matPlan;

// AABB - Axis aligned bounding box
const planAABB = BABYLON.Mesh.CreateBox('AABB', 20, scene);
planAABB.material = matBB;
planAABB.position = new BABYLON.Vector3(13, 0, 0);
planAABB.scaling = new BABYLON.Vector3(1, Math.cos(Math.PI / 4), Math.cos(Math.PI / 4));

// OBB - Object boundind box
const planOBB = BABYLON.Mesh.CreateBox('OBB', 20, scene);
planOBB.scaling = new BABYLON.Vector3(1, 1, 0.05);
planOBB.parent = plan2;
planOBB.material = matBB;

// Balloons
const balloon1 = BABYLON.Mesh.CreateSphere('balloon1', 10, 2.0, scene);
const balloon2 = BABYLON.Mesh.CreateSphere('balloon2', 10, 2.0, scene);
const balloon3 = BABYLON.Mesh.CreateSphere('balloon3', 10, 2.0, scene);
balloon1.material = new BABYLON.StandardMaterial('matBallon1', scene);
balloon2.material = new BABYLON.StandardMaterial('matBallon2', scene);
balloon3.material = new BABYLON.StandardMaterial('matBallon3', scene);

balloon1.position = new BABYLON.Vector3(6, 5, 0);
balloon2.position = new BABYLON.Vector3(-6, 5, 0);
balloon3.position = new BABYLON.Vector3(-30, 5, 0);

//Animation
var alpha = Math.PI;
scene.registerBeforeRender(function () {

  //Balloon 1 intersection -- Precise = false
  if (balloon1.intersectsMesh(plan1, false)) {
    balloon1.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
  } else {
    balloon1.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
  }

  //Balloon 2 intersection -- Precise = true
  if (balloon2.intersectsMesh(plan2, true)) {
    balloon2.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
  } else {
    balloon2.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
  }

  //balloon 3 intersection on single point
  if (balloon3.intersectsPoint(pointToIntersect)) {
    balloon3.material.emissiveColor = new BABYLON.Color3(1, 0, 0);
  } else {
    balloon3.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
  }

  alpha += 0.01;
  balloon1.position.y += Math.cos(alpha) / 10;
  balloon2.position.y = balloon1.position.y;
  balloon3.position.y = balloon1.position.y;
});
