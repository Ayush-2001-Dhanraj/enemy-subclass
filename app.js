/** @type {HTMLCanvasElement} */

document.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const CANVAS_WIDTH = (canvas.width = 500);
  const CANVAS_HEIGHT = (canvas.height = 700);

  class Game {
    constructor() {
      this.enemies = [];
    }
    update() {}
    draw() {}
    #addnewEnemy() {}
  }

  class Enemy {
    constructor() {}
    update() {}
    draw() {}
  }

  function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    requestAnimationFrame(animate);
  }

  animate();
});
