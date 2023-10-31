/** @type {HTMLCanvasElement} */

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const CANVAS_WIDTH = (canvas.width = 500);
  const CANVAS_HEIGHT = (canvas.height = 700);

  class Game {
    constructor(ctx, height, width) {
      this.ctx = ctx;
      this.height = height;
      this.width = width;
      this.enemies = [];
      this.enemyInterval = 100;
      this.enemyTimer = 0;
      this.enemyTypes = ["ghost", "worm", "spider"];
    }
    update(deltaTime) {
      if (this.enemyTimer > this.enemyInterval) {
        this.#addnewEnemy();
        this.enemyTimer = 0;
        this.enemies = this.enemies.filter((obj) => !obj.markedForRemoval);
      } else {
        this.enemyTimer += deltaTime;
      }
      this.enemies.forEach((obj) => obj.update(deltaTime));
    }
    draw() {
      this.enemies.forEach((obj) => obj.draw());
    }
    #addnewEnemy() {
      const randomEnemy =
        this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
      if (randomEnemy == "worm") this.enemies.push(new Worm(this));
      else if (randomEnemy == "ghost") this.enemies.push(new Ghost(this));
      else if (randomEnemy == "spider") this.enemies.push(new Spider(this));
      // this.enemies.sort((a, b) => {
      //   return a.y - b.y;
      // });
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.markedForRemoval = false;
      this.frame = 0;
      this.frameInterval = 100;
      this.frameTimer = 0;
    }
    update(deltaTime) {
      this.x -= this.vx * deltaTime;
      if (this.frameTimer > this.frameInterval) {
        if (this.frame < this.maxFrames) this.frame++;
        else this.frame = 0;
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      if (this.x + this.width < 0) this.markedForRemoval = true;
    }
    draw() {
      this.game.ctx.drawImage(
        this.image,
        this.frame * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  class Worm extends Enemy {
    constructor(game) {
      super(game);
      this.spriteHeight = 171;
      this.spriteWidth = 229;
      this.size = Math.random() * 0.2 + 0.2;
      this.width = this.spriteWidth * this.size;
      this.height = this.spriteHeight * this.size;
      this.x = this.game.width;
      this.y = this.game.height - this.height;
      this.image = worm;
      this.vx = Math.random() * 0.1 + 0.1;
      this.maxFrames = 5;
    }
  }

  class Ghost extends Enemy {
    constructor(game) {
      super(game);
      this.spriteHeight = 206;
      this.spriteWidth = 261;
      this.size = Math.random() * 0.2 + 0.1;
      this.width = this.spriteWidth * this.size;
      this.height = this.spriteHeight * this.size;
      this.x = this.game.width;
      this.y = Math.random() * this.game.height * 0.6;
      this.image = ghost;
      this.vx = Math.random() * 0.2 + 0.1;
      this.maxFrames = 5;
      this.angle = 0;
      this.curve = Math.random() * 1 + 0.5;
    }
    update(deltaTime) {
      super.update(deltaTime);
      this.y += Math.sin(this.angle) * this.curve;
      this.angle += 0.03;
    }
    draw() {
      this.game.ctx.save();
      this.game.ctx.globalAlpha = 0.5;
      super.draw();
      this.game.ctx.restore();
    }
  }

  class Spider extends Enemy {
    constructor(game) {
      super(game);
      this.spriteHeight = 175;
      this.spriteWidth = 310;
      this.size = Math.random() * 0.2 + 0.2;
      this.width = this.spriteWidth * this.size;
      this.height = this.spriteHeight * this.size;
      this.x = Math.random() * (this.game.width - this.width);
      this.y = 0 - this.height;
      this.image = spider;
      this.vx = 0;
      this.vy = Math.random() * 0.1 + 0.1;
      this.maxLength = Math.random() * this.game.height;
      this.maxFrames = 5;
    }
    update(deltaTime) {
      super.update(deltaTime);
      this.y += this.vy * deltaTime;
      if (this.y > this.maxLength) this.vy *= -1;
      if (this.y + this.height < 0) this.markedForRemoval = true;
    }
    draw() {
      this.game.ctx.beginPath();
      this.game.ctx.moveTo(this.x + this.width / 2, 0);
      this.game.ctx.lineTo(this.x + this.width / 2, this.y);
      this.game.ctx.stroke();
      super.draw();
    }
  }

  let lastTime = 1;
  const game = new Game(ctx, CANVAS_HEIGHT, CANVAS_WIDTH);

  function animate(timeStamp) {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.update(deltaTime);
    game.draw();
    requestAnimationFrame(animate);
  }

  animate(0);
});
