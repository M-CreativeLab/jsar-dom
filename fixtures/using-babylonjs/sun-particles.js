const scene = spatialDocument.scene;
BABYLON.ParticleHelper.CreateAsync('sun', scene).then((set) => {
  set.start();
});
