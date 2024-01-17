spatialDocument.addEventListener('spaceReady', () => {
  const scene = spatialDocument.scene;
  const animations = scene.animationGroups
    .filter(ag => ag.name.startsWith('model.'));

  if (animations.length > 0) {
    animations[0].start(true);
  }
});
