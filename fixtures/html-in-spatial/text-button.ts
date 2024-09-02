import wallPic from '../textures/wall.jpeg';

async function createAudioPlayer(name: string) {
  const arrayBuffer = await import(`../assets/${name}`);
  const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
  const objectUrl = URL.createObjectURL(blob);
  return (volume?: number) => {
    const audio = new Audio(objectUrl);
    if (volume) {
      audio.volume = volume;
    }
    audio.play();
  };
}

const audios = {} as Record<string, (volume?: number) => void>;
(async function () {
  audios['Do'] = await createAudioPlayer('40.mp3');
  audios['Ri'] = await createAudioPlayer('42.mp3');
  audios['Mi'] = await createAudioPlayer('44.mp3');
  audios['Fa'] = await createAudioPlayer('45.mp3');
})();

spatialDocument.addEventListener('spaceReady', () => {
  const wall = spatialDocument.getElementById('box1') as any;
  createImageBitmap(new Blob([wallPic], { type: 'image/jpeg' })).then((bitmap) => {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      return;
    }

    ctx.fillStyle = 'yellow';
    ctx.fillRect(0, 0, 200, 100);

    ctx.drawImage(bitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const wallTexture = new BABYLON.RawTexture(
      imageData.data,
      imageData.width,
      imageData.height,
      BABYLON.Engine.TEXTUREFORMAT_RGBA,
      spatialDocument.scene,
      false,
      false,
      BABYLON.Texture.TRILINEAR_SAMPLINGMODE);

    const mat = new BABYLON.StandardMaterial('wall', spatialDocument.scene);
    mat.diffuseTexture = wallTexture;
    mat.diffuseColor = new BABYLON.Color3(1, 0, 0);
    wall.asNativeType().material = mat;
  });
});


const guiPlane = document.getElementById('gui');
const panel = guiPlane.shadowRoot;

const subChildren = panel.querySelectorAll('.sub');
for (let sub of subChildren) {
  const subElement = sub as HTMLElement;
  subElement.addEventListener('mouseenter', () => {
    subElement.style.backgroundColor = 'rgba(100,0,120,.95)';
  });
  subElement.addEventListener('mouseleave', () => {
    subElement.style.backgroundColor = 'rgba(60,33,33,.95)';
  });
  subElement.addEventListener('mouseup', () => {
    subElement.style.backgroundColor = 'rgba(30,33,33,.95)';
    if (subElement.textContent == null) {
      console.warn(`No text content found in the element`);
      return;
    }
    const playAudio = audios[subElement.textContent];
    if (playAudio) {
      playAudio(1.0);
    }
  });
}
