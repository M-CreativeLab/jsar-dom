import wallPic from '../textures/wall.jpeg';

const scene = spatialDocument.scene;
const wall = spatialDocument.getSpatialObjectById('box1');

createImageBitmap(new Blob([wallPic], { type: 'image/jpeg' })).then((bitmap) => {
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const wallTexture = new BABYLON.RawTexture(
    imageData.data,
    imageData.width,
    imageData.height,
    BABYLON.Engine.TEXTUREFORMAT_RGBA,
    scene,
    false,
    false,
    BABYLON.Texture.TRILINEAR_SAMPLINGMODE);

  const wallMaterial = wall.asNativeType<BABYLON.Mesh>().material as BABYLON.StandardMaterial;
  wallMaterial.diffuseTexture = wallTexture;
});
