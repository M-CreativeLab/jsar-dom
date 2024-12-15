import splattingPic from '../textures/splatting.jpg'

const plane = spatialDocument.querySelector('plane') as any;
const panel = plane.shadowRoot;
const div = panel.querySelector('div');
const images = div.querySelectorAll('img');
const img1 = images[0];
const img2 = images[1];
const p = div.querySelector('p');

spatialDocument.addEventListener('spaceReady', () => {
  createImageBitmap(new Blob([splattingPic], { type: 'image/jpeg' })).then(async (bitmap) => {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    if (ctx == null) {
      return;
    }

    const shape = getRandomShape();
    const leftImageData = getShapeFromImage(bitmap, shape);
    const rightImageData = cutShapeFromImage(bitmap, shape);

    const leftImageURL = await convertImageDataToDataURL(leftImageData);
    const rightImageURL = await convertImageDataToDataURL(rightImageData);

    img1.src = leftImageURL;
    img2.src = rightImageURL;
  });
})

moveImageWithRay();

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

function moveImageWithRay() {
  div.addEventListener('raymove', (event) => {
    const mouseX = Math.round(event.x);
    const gapX = mouseX - 128;
    img1.style.transform = `translateX(${gapX}px)`;
    if (gapX >= 763 && gapX <= 773) {
      p.textContent = 'Success!';
      p.style.color = 'white';
    } else {
      p.textContent = '';
    }
  })
}

function cutShapeFromImage(image, shape: string) {
  const canvas = new OffscreenCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  ctx.globalCompositeOperation = 'destination-out';

  if (shape === 'rect') {
    ctx.fillRect(1/4 * image.width, 1/4 * image.height, 1/2 * image.width, 1/2 * image.height);
  } else if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(image.width / 2, image.height / 2, Math.min(image.width, image.height) / 4, 0, 2 * Math.PI);
    ctx.fill();
  } else if (shape === 'triangle') {
    ctx.beginPath();
    ctx.moveTo(1/2 * image.width, 1/4 * image.height);
    ctx.lineTo(1/4 * image.width, 3/4 * image.height);
    ctx.lineTo(3/4 * image.width, 3/4 * image.height);
    ctx.closePath();
    ctx.fill();
  }

  const imageData = ctx.getImageData(0, 0, image.width, image.height);

  return imageData
}

function getShapeFromImage(image, shape: string) {
  const canvas = new OffscreenCanvas(image.width, image.height);
  const ctx = canvas.getContext('2d');

  if (shape === 'rect') {
    ctx.beginPath();
    ctx.rect(1/4 * image.width, 1/4 * image.height, 1/2 * image.width, 1/2 * image.height);
    ctx.clip();
  } else if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(image.width / 2, image.height / 2, Math.min(image.width, image.height) / 4, 0, 2 * Math.PI);
    ctx.clip();
  } else if (shape === 'triangle') {
    ctx.beginPath();
    ctx.moveTo(1/2 * image.width, 1/4 * image.height);
    ctx.lineTo(1/4 * image.width, 3/4 * image.height);
    ctx.lineTo(3/4 * image.width, 3/4 * image.height);
    ctx.closePath();
    ctx.clip();
  }

  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, image.width, image.height);

  return imageData;
}

function getRandomShape() {
  const shapes = ['rect', 'circle', 'triangle'];
  const randomIndex = Math.floor(Math.random() * shapes.length);
  return shapes[randomIndex];
}
