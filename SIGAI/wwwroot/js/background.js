const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

// Configuración inicial
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Paleta de colores institucional (puedes ajustarla)
const colorPalette = {
    primary: '#0056b3',       // Azul universitario
    secondary: '#00aaff',     // Azul claro
    accent: '#ff7e00',        // Naranja institucional
    light: 'rgba(0, 170, 255, 0.3)',
    dark: '#003366'
};

let particles = [];

class Particle {
    constructor() {
        this.reset(true);
        this.connections = [];
    }

    reset(initial = false) {
        this.x = initial ? Math.random() * canvas.width : canvas.width * 0.1 + Math.random() * canvas.width * 0.8;
        this.y = initial ? Math.random() * canvas.height : canvas.height * 0.1 + Math.random() * canvas.height * 0.8;
        this.radius = Math.random() * 2.5 + 1;
        this.baseV = (Math.random() * 0.5 + 0.2) * (Math.random() > 0.5 ? 1 : -1);
        this.vx = this.baseV * (Math.random() * 0.3 + 0.7);
        this.vy = this.baseV * (Math.random() * 0.3 + 0.7);
        this.life = Math.random() * 300 + 100;
        this.maxLife = this.life;
        this.color = this.getParticleColor();
    }

    getParticleColor() {
        const colors = [colorPalette.secondary, colorPalette.accent, colorPalette.light];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;

        // Rebote suavizado en bordes
        if (this.x < 0 || this.x > canvas.width) {
            this.vx *= -0.8;
            this.x = this.x < 0 ? 0 : canvas.width;
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.vy *= -0.8;
            this.y = this.y < 0 ? 0 : canvas.height;
        }

        // Renovar partículas viejas
        if (this.life <= 0) {
            this.reset();
        }
    }

    draw() {
        const lifeRatio = this.life / this.maxLife;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.6 * lifeRatio + 0.4;
        ctx.arc(this.x, this.y, this.radius * (0.5 + 0.5 * lifeRatio), 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function connectLines() {
    const connectionDistance = Math.min(canvas.width, canvas.height) * 0.15;

    for (let i = 0; i < particles.length; i++) {
        particles[i].connections = [];

        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < connectionDistance) {
                const opacity = 1 - (dist / connectionDistance);
                particles[i].connections.push({
                    target: particles[j],
                    opacity: opacity
                });
            }
        }
    }

    // Dibujar conexiones
    particles.forEach(particle => {
        particle.connections.forEach(connection => {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 122, 204, ${connection.opacity * 0.3})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(connection.target.x, connection.target.y);
            ctx.stroke();
        });
    });
}

function animate() {
    ctx.fillStyle = colorPalette.dark;
    ctx.globalAlpha = 0.05;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;

    particles.forEach(p => {
        p.move();
        p.draw();
    });

    connectLines();

    requestAnimationFrame(animate);
}

function initParticles() {
    const particleCount = Math.floor((canvas.width * canvas.height) / 10000);
    particles = [];

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Optimización para ventana responsiva
const resizeDebounce = (func, delay) => {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
};

window.addEventListener('resize', resizeDebounce(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}, 100));

// Interacción con el mouse
const mouse = { x: null, y: null, radius: 100 };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;

    particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
            p.vx = dx * 0.02;
            p.vy = dy * 0.02;
        }
    });
});

initParticles();
animate();