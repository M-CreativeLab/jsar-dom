import splattingPic from '../textures/splatting.jpg'

spatialDocument.addEventListener('spaceReady', () => {
  const plane = spatialDocument.querySelector('plane') as any;
  createImageBitmap(new Blob([splattingPic], { type: 'image/jpeg' })).then(async (bitmap) => {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      return;
    }

    const panel = plane.shadowRoot;
    const div = panel.querySelector('div');
    const images = div.querySelectorAll('img');
    const img1 = images[0];
    const img2 = images[1];

    const leftImageData = getShapeFromImage(bitmap, 'rect');
    const rightImageData = cutShapeFromImage(bitmap, 'rect');

    const leftImageURL = await convertImageDataToDataURL(leftImageData);
    const rightImageURL = await convertImageDataToDataURL(rightImageData);
    // console.log('leftImageURL', leftImageURL);
    // console.log('rightImageURL', rightImageURL);

    img1.src = leftImageURL;
    img2.src = rightImageURL;

    // console.log('img1.style', img1.style);

    // const imageData = rightImageData;

    // const imageData = combineImages(leftImageData, rightImageData);

    // console.log('imageData', imageData);
    // const planeTexture = new BABYLON.RawTexture(
    //     imageData.data,
    //     imageData.width,
    //     imageData.height,
    //     BABYLON.Engine.TEXTUREFORMAT_RGBA,
    //     spatialDocument.scene,
    //     false,
    //     false,
    //     BABYLON.Texture.TRILINEAR_SAMPLINGMODE
    // );
  
    // const mat = new BABYLON.StandardMaterial('plane', spatialDocument.scene);
    // mat.diffuseTexture = planeTexture;
    // mat.diffuseColor = new BABYLON.Color3(255, 255, 255);
    // plane.asNativeType().material = mat;
  });
})

async function convertImageDataToDataURL(imageData: ImageData): Promise<string> {
  const canvas = new OffscreenCanvas(imageData.width, imageData.height);
  const ctx = canvas.getContext('2d');
  if (ctx == null) {
    throw new Error('Could not get 2D context');
  }
  ctx.putImageData(imageData, 0, 0);
  const blob = await new Promise<Blob>((resolve) => {
    canvas.convertToBlob().then(resolve);
  });

  const dataURL = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });

  return dataURL;
}

function moveImageWithRay(img) {
  const originMouseX  = img.style.originX;
  img.addEventListener('mouseclick', (event) => {
    const currentMouseX = event.x;
    if (currentMouseX < originMouseX + 20 && currentMouseX > originMouseX - 20) {

    }
    const gapX = originMouseX - currentMouseX;
    img.style.transform = `translateX(${gapX}px)`;
  })
  img.addEventListener('mouseLeave', (event) => {
    const currentMouseX = event.x;
    const gapX = originMouseX - currentMouseX;
    img.style.transform = `translateX(${gapX}px)`;
  })
}

function cutShapeFromImage(image, shape: string) {
  const canvas = new OffscreenCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);

  // 设置合成操作为'destination-out'，这样后续的绘制操作会从已有的内容中删除像素
  ctx.globalCompositeOperation = 'destination-out';

  if (shape === 'rect') {
    ctx.fillRect(1/4 * image.width, 1/4 * image.height, 1/2 * image.width, 1/2 * image.height);
  }

  const imageData = ctx.getImageData(0, 0, image.width, image.height);

  return imageData
}

function getShapeFromImage(image, shape: string) {
  const canvas = new OffscreenCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');

  // ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, image.width, image.height);

  // 定义剪辑区域
  if (shape === 'rect') {
    ctx.beginPath();
    ctx.rect(1/4 * image.width, 1/4 * image.height, 1/2 * image.width, 1/2 * image.height);
    ctx.clip();
  }

  // 在剪辑区域内绘制图像
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, image.width, image.height);

  return imageData;
}
