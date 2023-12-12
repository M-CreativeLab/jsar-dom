const scene = spaceDocument.scene;
const maneGroup = spaceDocument.getNodeById('lion_mane');
const redMat = spaceDocument.getMaterialById('red');
const maneParts = [];

for (let j = 0; j < 4; j++) {
  for (let k = 0; k < 4; k++) {
    const manePart = BABYLON.MeshBuilder.CreateBox(`mane_${j}x${k}`, {
      width: 40,
      height: 40,
      depth: 15,
    }, scene);
    manePart.material = redMat;
    manePart.position = new BABYLON.Vector3((j * 40) - 60, (k * 40) - 60, 0);
    manePart.parent = maneGroup;

    let amp;
    let zOffset;
    const periodOffset = Math.random() * Math.PI * 2;

    if ((j == 0 && k == 0) || (j == 0 && k == 3) || (j == 3 && k == 0) || (j == 3 && k == 3)) {
      amp = -10 - Math.floor(Math.random() * 5);
      zOffset = -5;
    } else if (j == 0 || k == 0 || j == 3 || k == 3) {
      amp = -5 - Math.floor(Math.random() * 5);
      zOffset = 0;
    } else {
      amp = 0;
      zOffset = 0;
    }

    maneParts.push({
      mesh: manePart,
      amp,
      zOffset,
      periodOffset,
      xInit: manePart.position.x,
      yInit: manePart.position.y,
    });
  }
}

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function rule3(v, vmin, vmax, tmin, tmax) {
  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + (pc * dt);
  return tv;
}

function toRadian(degree) {
  return degree * Math.PI / 180;
}

class FanController {
  isBlowing = false;
  speed = 0;
  lion = null;

  #container = spaceDocument.getNodeById('fan');
  #propeller = spaceDocument.getNodeById('fan_propeller');

  #speedAcc = 0;
  #targetPositionX = 0;
  #targetPositionY = 0;

  update(x, y) {
    this.#container.lookAt(this.lion.head.position);
    this.#targetPositionX = -rule3(x, -200, 200, -250, 250);
    this.#targetPositionY = -rule3(y, -200, 200, 250, -250);

    this.#container.position.x += (this.#targetPositionX - this.#container.position.x) / 10;
    this.#container.position.y += (this.#targetPositionY - this.#container.position.y) / 10;

    const speed = this.isBlowing ? 0.3 : 0.01;
    if (this.isBlowing && speed < .5) {
      this.#speedAcc += 0.001;
      this.speed += this.#speedAcc;
    } else {
      this.#speedAcc = 0;
      this.speed *= .98;
    }
    this.#propeller.rotation.z += this.speed;
  }
}

class LionController {
  #fan = null;
  #head = spaceDocument.getNodeById('lion_head');
  #leftEye = spaceDocument.getNodeById('lion_eyeL');
  #rightEye = spaceDocument.getNodeById('lion_eyeR');
  #leftIris = spaceDocument.getNodeById('lion_irisL');
  #rightIris = spaceDocument.getNodeById('lion_irisR');
  #leftKnee = spaceDocument.getNodeById('lion_kneeL');
  #rightKnee = spaceDocument.getNodeById('lion_kneeR');
  #mane = maneGroup;
  #leftEar = spaceDocument.getNodeById('lion_earL');
  #rightEar = spaceDocument.getNodeById('lion_earR');
  #mustaches = [
    spaceDocument.getNodeById('lion_mustache1_root'),
    spaceDocument.getNodeById('lion_mustache2_root'),
    spaceDocument.getNodeById('lion_mustache3_root'),
    spaceDocument.getNodeById('lion_mustache4_root'),
    spaceDocument.getNodeById('lion_mustache5_root'),
    spaceDocument.getNodeById('lion_mustache6_root'),
  ];

  #windTime = 0;

  #targetHeadRotationX;
  #targetHeadRotationY;
  #targetHeadPositionX;
  #targetHeadPositionY;
  #targetHeadPositionZ;

  #targetEyeScale;
  #targetIrisScalingY;
  #targetIrisScalingZ;
  #targetIrisPositionY;
  #targetLeftIrisPositionZ;
  #targetRightIrisPositionZ;

  #targetRightKneeRotationZ;
  #targetLeftKneeRotationZ;

  get head() {
    return this.#head;
  }

  constructor(fan) {
    this.#fan = fan;
  }

  updateBody(speed) {
    /** Update head position and rotation */
    this.#head.rotation.x += (this.#targetHeadRotationX - this.#head.rotation.x) / speed;
    this.#head.rotation.y += (this.#targetHeadRotationY - this.#head.rotation.y) / speed;
    this.#head.position.x += (this.#targetHeadPositionX - this.#head.position.x) / speed;
    this.#head.position.y += (this.#targetHeadPositionY - this.#head.position.y) / speed;
    this.#head.position.z += (this.#targetHeadPositionZ - this.#head.position.z) / speed;

    /** Update eyes */
    this.#leftEye.scaling.y += (this.#targetEyeScale - this.#leftEye.scaling.y) / (speed * 2);
    this.#rightEye.scaling.y = this.#leftEye.scaling.y;

    /** Update irises */
    this.#leftIris.scaling.y += (this.#targetIrisScalingY - this.#leftIris.scaling.y) / (speed * 2);
    this.#rightIris.scaling.y = this.#leftIris.scaling.y;
    this.#leftIris.scaling.z += (this.#targetIrisScalingZ - this.#leftIris.scaling.z) / (speed * 2);
    this.#rightIris.scaling.z = this.#leftIris.scaling.z;
    this.#leftIris.position.y += (this.#targetIrisPositionY - this.#leftIris.position.y) / speed;
    this.#rightIris.position.y = this.#leftIris.position.y;
    this.#leftIris.position.z += (this.#targetLeftIrisPositionZ - this.#leftIris.position.z) / speed;
    this.#rightIris.position.z += (this.#targetRightIrisPositionZ - this.#rightIris.position.z) / speed;

    /** Update knees */
    this.#leftKnee.rotation.z += (this.#targetLeftKneeRotationZ - this.#leftKnee.rotation.z) / speed;
    this.#rightKnee.rotation.z += (this.#targetRightKneeRotationZ - this.#rightKnee.rotation.z) / speed;
  }

  lookAt(x, y) {
    this.#targetHeadRotationX = toRadian(-rule3(y, -200, 200, -30, 30));
    this.#targetHeadRotationY = toRadian(-rule3(x, -200, 200, -30, 30));
    this.#targetHeadPositionX = rule3(x, -200, 200, 70, -70);
    this.#targetHeadPositionY = rule3(y, -140, 260, 20, 100);
    this.#targetHeadPositionZ = 0;

    this.#targetEyeScale = 1;
    this.#targetIrisScalingY = 1;
    this.#targetIrisScalingZ = 1;
    this.#targetIrisPositionY = rule3(y, -200, 200, 35, 15);
    this.#targetLeftIrisPositionZ = rule3(x, -200, 200, 130, 110);
    this.#targetRightIrisPositionZ = rule3(x, -200, 200, 110, 130);

    this.#targetLeftKneeRotationZ = toRadian(-rule3(x, -200, 200, 20 - 22.5, 20 + 22.5));
    this.#targetRightKneeRotationZ = toRadian(-rule3(x, -200, 200, -20 - 22.5, -20 + 22.5));

    this.updateBody(10);

    this.#mane.rotation.y = 0;
    this.#mane.rotation.x = 0;

    for (let manePart of maneParts) {
      const { mesh, xInit, yInit } = manePart;
      mesh.position.x = xInit;
      mesh.position.y = yInit;
      mesh.position.z = 0;
    }

    for (let mustache of this.#mustaches) {
      mustache.rotation.y = 0;
    }
  }

  setCool(x, y) {
    this.#targetHeadRotationX = toRadian(rule3(y, -200, 200, -30, 30));
    this.#targetHeadRotationY = toRadian(rule3(x, -200, 200, -30, 30));
    this.#targetHeadPositionX = rule3(x, -200, 200, 70, -70);
    this.#targetHeadPositionY = rule3(y, -140, 260, 20, 100);
    this.#targetHeadPositionZ = 100;

    this.#targetEyeScale = 0.1;
    this.#targetIrisScalingY = 0.1;
    this.#targetIrisScalingZ = 3;
    this.#targetIrisPositionY = 20;
    this.#targetLeftIrisPositionZ = 120;
    this.#targetRightIrisPositionZ = 120;

    this.#targetLeftKneeRotationZ = toRadian(rule3(x, -200, 200, 20 - 22.5, 20 + 22.5));
    this.#targetRightKneeRotationZ = toRadian(rule3(x, -200, 200, -20 - 22.5, -20 + 22.5));

    this.updateBody(10);

    let dt = 20000 / (x * x + y * y);
    dt = Math.max(Math.min(dt, 1), .5);
    this.#windTime += dt;

    for (let manePart of maneParts) {
      const { mesh, amp, zOffset, periodOffset } = manePart;
      mesh.position.z = zOffset + Math.sin(this.#windTime + periodOffset) * amp * dt * 2;
    }
    this.#leftEar.rotation.x = Math.cos(this.#windTime) * Math.PI / 16 * dt;
    this.#rightEar.rotation.x = -Math.cos(this.#windTime) * Math.PI / 16 * dt;

    for (let i = 0; i < this.#mustaches.length; i++) {
      const mesh = this.#mustaches[i];
      const amp = (i < 3) ? -(Math.PI / 8) : (Math.PI / 8);
      mesh.rotation.y = amp + Math.cos(this.#windTime + i) * dt * amp;
    }
  }

  toDegree(radian) {
    return radian * 180 / Math.PI;
  }
}

const fan = new FanController();
const lion = new LionController(fan);
fan.lion = lion;

const { screenWidth, screenHeight } = spaceDocument;
let isBlowing = false;
let targetX = 0;
let targetY = 0;

(function render() {
  fan.isBlowing = isBlowing;
  fan.update(targetX, targetY);

  if (isBlowing) {
    lion.setCool(targetX, targetY);
  } else {
    lion.lookAt(targetX, targetY);
  }
  setTimeout(render, 16);
})();

async function createAudioPlayer(name) {
  const arrayBuffer = await import(`../assets/${name}`);
  const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
  const objectUrl = URL.createObjectURL(blob);
  return (volume) => {
    const audio = new Audio(objectUrl);
    if (volume) {
      audio.volume = volume;
    }
    audio.play();
    return audio;
  };
}

const fanElement = document.querySelector('#fan_sphere');
fanElement.addEventListener('rayenter', () => {
  fanElement.asNativeType().renderOverlay = true;
});
fanElement.addEventListener('rayleave', () => {
  fanElement.asNativeType().renderOverlay = false;
});

let blowingAudio;
fanElement.addEventListener('raydown', async (event) => {
  isBlowing = true;
  if (blowingAudio) {
    blowingAudio.load();
    blowingAudio.play();
  } else {
    const player = await createAudioPlayer('fan.mp3');
    blowingAudio = player(1.0);
  }
});
fanElement.addEventListener('rayup', (event) => {
  isBlowing = false;
  if (blowingAudio) {
    blowingAudio.pause();
  }
});

// spaceDocument.watchInputEvent();
// spaceDocument.addEventListener('mouse', (event) => {
//   const { inputData } = event;
//   if (inputData.Action === 'move') {
//     targetX = inputData.PositionX - screenWidth / 2;
//     targetY = inputData.PositionY - screenHeight / 2;
//   } else if (inputData.Action === 'down') {
//     isBlowing = true;
//   } else if (inputData.Action === 'up') {
//     isBlowing = false;
//   }
// });

// let lastIndexFingerTipX = 0;
// let lastUpdateTimestamp = 0;

// spaceDocument.addEventListener('handtracking', (event) => {
//   const { inputData } = event;
//   if (inputData.Type === 1) {
//     // right hand
//     const joints = inputData.Joints;
//     if (joints?.length > 8) {
//       const indexFingerTip = joints[8];
//       targetX = indexFingerTip.x * 800;
//       targetY = indexFingerTip.y * 800;

//       const fingerDistanceX = indexFingerTip.x - lastIndexFingerTipX;
//       const timeDiff = Date.now() - lastUpdateTimestamp;
//       if (timeDiff > 1000 && fingerDistanceX > 0.01) {
//         isBlowing = !isBlowing;
//         lastUpdateTimestamp = Date.now();
//       }
//       lastIndexFingerTipX = indexFingerTip.x;
//     }
//   }
// });
