
const container = spatialDocument.querySelector('#box-bound');
const gamePanel = spatialDocument.querySelector('#game-panel');

let movingBlock: BABYLON.Mesh = null;
function createNewBlock() {
  const block = spatialDocument.createElement('cube');
  block.size = 0.1;
  container.appendChild(block);

  const blockMesh = block.asNativeType() as BABYLON.Mesh;
  blockMesh.position = new BABYLON.Vector3(0, 0.45, 0);
  return block;
}

function fallDown() {
  if (movingBlock == null) {
    return;
  }
  movingBlock.position.y -= 0.1;
  if (movingBlock.position.y < -0.45) {
    movingBlock = null;
  }
}

const startBtn = gamePanel.shadowRoot.querySelector('#start-btn');
if (startBtn) {
  startBtn.addEventListener('mouseup', () => {
    movingBlock = createNewBlock().asNativeType<BABYLON.Mesh>();
  });
}

setInterval(() => {
  fallDown();
}, 1000);
