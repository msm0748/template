window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Particle {
    constructor(effect, x, y, color) {
      this.effect = effect;
      this.x = Math.random() * this.effect.width;
      this.y = 0;
      this.originX = Math.floor(x);
      this.originY = Math.floor(y);
      this.color = color;
      this.size = this.effect.gap;
      this.vx = 0;
      this.vy = 0;
      this.ease = 0.1; // 이미지 표현 속도
      this.friction = 0.9;
      this.dx = 0;
      this.dy = 0;
      this.distance = 0;
      this.force = 0;
      this.angle = 0;
    }
    draw(context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
      this.dx = this.effect.mouse.x - this.x;
      this.dy = this.effect.mouse.y - this.y;
      this.distance = this.dx * this.dx + this.dy * this.dy;
      this.force = -this.effect.mouse.radius / this.distance;

      if (this.distance < this.effect.mouse.radius) {
        this.angle = Math.atan2(this.dy, this.dx);
        this.vx += this.force * Math.cos(this.angle);
        this.vy += this.force * Math.sin(this.angle);
      }

      this.x += this.vx * this.friction + (this.originX - this.x) * this.ease;
      this.y += this.vy * this.friction + (this.originY - this.y) * this.ease;
    }
    warp() {
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.ease = 0.05;
    }
  }

  class MessageDisplay {
    constructor(messageElementId) {
      this.messageElement = document.getElementById(messageElementId);
    }

    showMessage() {
      this.messageElement.style.display = 'block';
    }

    hideMessage() {
      this.messageElement.style.display = 'none';
    }
  }

  const messageDisplay = new MessageDisplay('message');
  const maxBrokenPercentage = 91; // Define the maximum broken percentage here (n% in this case).

  class Effect {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.particlesArray = [];
      this.image = document.getElementById('image1');
      this.centerX = this.width * 0.5;
      this.centerY = this.height * 0.5;
      this.x = this.centerX - this.image.width * 0.5;
      this.y = this.centerY - this.image.height * 0.5;
      this.gap = 2; // 해상도
      this.mouse = {
        radius: 5000,
        x: undefined,
        y: undefined,
      };
      this.brokenPercentage = 0;
      window.addEventListener('click', (event) => {
        this.mouse.x = event.x;
        this.mouse.y = event.y;
        this.particlesArray.forEach((particle) => {
          particle.dx = this.mouse.x - particle.x;
          particle.dy = this.mouse.y - particle.y;
          particle.distance = particle.dx * particle.dx + particle.dy * particle.dy;
          particle.force = -this.mouse.radius / particle.distance;

          if (particle.distance < this.mouse.radius) {
            particle.angle = Math.atan2(particle.dy, particle.dx);
            particle.vx += particle.force * Math.cos(particle.angle);
            particle.vy += particle.force * Math.sin(particle.angle);
          }
        });
      });
    }
    init(context) {
      context.drawImage(this.image, this.x, this.y);
      const pixels = context.getImageData(0, 0, this.width, this.height).data;
      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          const index = (y * this.width + x) * 4;
          const red = pixels[index];
          const green = pixels[index + 1];
          const blue = pixels[index + 2];
          const alpha = pixels[index + 3];
          const color = `rgb(${red},${green},${blue})`;

          if (alpha > 0) {
            this.particlesArray.push(new Particle(this, x, y, color));
          }
        }
      }
    }
    draw(context) {
      this.particlesArray.forEach((particle) => particle.draw(context));

      const pixels = context.getImageData(0, 0, this.width, this.height).data;
      let totalPixels = 0;
      let brokenPixels = 0;

      for (let i = 0; i < pixels.length; i += 4) {
        const alpha = pixels[i + 3];
        if (alpha === 0) {
          brokenPixels++;
        }
        totalPixels++;
      }

      const brokenPercentage = (brokenPixels / totalPixels) * 100;
      this.brokenPercentage = brokenPercentage;
      console.log(brokenPercentage);

      if (brokenPercentage < maxBrokenPercentage) {
        messageDisplay.showMessage();
      } else {
        messageDisplay.hideMessage();
      }
    }
    update() {
      this.particlesArray.forEach((particle) => particle.update());
    }
    warp() {
      this.particlesArray.forEach((particle) => particle.warp());
    }
  }

  const effect = new Effect(canvas.width, canvas.height);
  effect.init(ctx);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(ctx);
    effect.update();
    const currentBrokenPercentage = effect.brokenPercentage;
    if (currentBrokenPercentage >= maxBrokenPercentage) {
      window.requestAnimationFrame(animate);
    } else {
      // Stop the animation when broken percentage exceeds the threshold
      console.log('Animation stopped. Image is too broken.');
    }
  }
  animate();
});
