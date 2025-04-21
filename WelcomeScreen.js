import { CANVAS_WIDTH, CANVAS_HEIGHT, GAME_STATE } from './constants.js';

class WelcomeScreen {
    constructor(game, assetLoader) {
        this.game = game;
        this.assetLoader = assetLoader;
        
        // Button properties with pixel-art styling
        this.startButton = {
            x: CANVAS_WIDTH / 2 - 100,
            y: CANVAS_HEIGHT / 2 + 20,
            width: 200,
            height: 40,
            text: "START GAME",
            hovered: false
        };

        this.creditsButton = {
            x: CANVAS_WIDTH / 2 - 100,
            y: CANVAS_HEIGHT / 2 + 80,
            width: 200,
            height: 40,
            text: "CREDITS: SANDRO",
            hovered: false
        };

        this.setupListeners();
    }

    setupListeners() {
        this.mouseMoveHandler = this.handleMouseMove.bind(this);
        this.clickHandler = this.handleClick.bind(this);
        this.touchHandler = this.handleTouch.bind(this);
        
        this.game.canvas.addEventListener('mousemove', this.mouseMoveHandler);
        this.game.canvas.addEventListener('click', this.clickHandler);
        this.game.canvas.addEventListener('touchstart', this.touchHandler);
    }

    removeListeners() {
        this.game.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
        this.game.canvas.removeEventListener('click', this.clickHandler);
        this.game.canvas.removeEventListener('touchstart', this.touchHandler);
    }

    handleMouseMove(event) {
        const rect = this.game.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.game.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.game.canvas.height / rect.height);

        this.startButton.hovered = this.isPointInButton(mouseX, mouseY, this.startButton);
        this.creditsButton.hovered = this.isPointInButton(mouseX, mouseY, this.creditsButton);
    }

    handleClick(event) {
        const rect = this.game.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.game.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.game.canvas.height / rect.height);

        if (this.isPointInButton(mouseX, mouseY, this.startButton)) {
            this.game.gameState = GAME_STATE.PLAYING;
            this.game.audioManager.play('collect', 1.0);
        }
    }

    handleTouch(event) {
        event.preventDefault();
        const rect = this.game.canvas.getBoundingClientRect();
        const touch = event.touches[0];
        const touchX = (touch.clientX - rect.left) * (this.game.canvas.width / rect.width);
        const touchY = (touch.clientY - rect.top) * (this.game.canvas.height / rect.height);

        if (this.isPointInButton(touchX, touchY, this.startButton)) {
            this.game.gameState = GAME_STATE.PLAYING;
            this.game.audioManager.play('collect', 1.0);
        }
    }

    isPointInButton(x, y, button) {
        return x >= button.x && x <= button.x + button.width &&
               y >= button.y && y <= button.y + button.height;
    }

    render(ctx) {
        // Dark End background with gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        gradient.addColorStop(0, '#0f0f1a');
        gradient.addColorStop(1, '#12122d');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Add subtle End stone texture pattern
        this.renderEndTexture(ctx);
        
        // Render floating End particles
        this.renderEndParticles(ctx);

        // Title with Ender Eye glow effect
        const time = Date.now() / 1000;
        ctx.save();
        
        // Glow effect
        ctx.shadowColor = '#9966ff';
        ctx.shadowBlur = 20 + Math.sin(time * 2) * 5;
        ctx.fillStyle = '#bb99ff';
        ctx.font = 'bold 64px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('THE EYES OF ENDER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3);

        // Subtitle
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#cccccc';
        ctx.font = '24px "Press Start 2P", monospace';
        ctx.fillText('Level 3', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3 + 50);

        ctx.restore();

        // Render buttons
        this.renderPixelButton(ctx, this.startButton);
        this.renderPixelButton(ctx, this.creditsButton);

        // Bottom right text
        ctx.fillStyle = '#666666';
        ctx.font = '12px "Press Start 2P", monospace';
        ctx.textAlign = 'right';
        ctx.fillText('Journey to The End', CANVAS_WIDTH - 20, CANVAS_HEIGHT - 20);
    }

    renderPixelButton(ctx, button) {
        ctx.save();

        // Button background with pixel border
        const gradient = ctx.createLinearGradient(button.x, button.y, button.x, button.y + button.height);
        if (button.hovered) {
            gradient.addColorStop(0, '#9966ff');
            gradient.addColorStop(1, '#6633cc');
            ctx.shadowColor = '#aa88ff';
            ctx.shadowBlur = 15;
        } else {
            gradient.addColorStop(0, '#221144');
            gradient.addColorStop(1, '#110033');
            ctx.shadowColor = '#9966ff';
            ctx.shadowBlur = 5;
        }

        // Pixel-style border
        ctx.fillStyle = gradient;
        ctx.fillRect(button.x, button.y, button.width, button.height);
        
        // Pixel corners
        ctx.fillStyle = button.hovered ? '#aa88ff' : '#332255';
        ctx.fillRect(button.x - 2, button.y - 2, 4, 4);
        ctx.fillRect(button.x + button.width - 2, button.y - 2, 4, 4);
        ctx.fillRect(button.x - 2, button.y + button.height - 2, 4, 4);
        ctx.fillRect(button.x + button.width - 2, button.y + button.height - 2, 4, 4);

        // Button text
        ctx.fillStyle = button.hovered ? '#ffffff' : '#cccccc';
        ctx.font = '16px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(button.text, button.x + button.width / 2, button.y + button.height / 2);

        ctx.restore();
    }

    renderEndTexture(ctx) {
        // Create subtle End stone texture pattern
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * CANVAS_WIDTH;
            const y = Math.random() * CANVAS_HEIGHT;
            const size = 1 + Math.random() * 3;
            
            ctx.fillStyle = `rgba(220, 220, 240, ${Math.random() * 0.1})`;
            ctx.fillRect(x, y, size, size);
        }
    }

    renderEndParticles(ctx) {
        const time = Date.now() / 1000;
        
        // Create floating End particles
        for (let i = 0; i < 20; i++) {
            const x = (Math.sin(time * 0.5 + i) * 0.5 + 0.5) * CANVAS_WIDTH;
            const y = ((Math.cos(time * 0.3 + i) * 0.5 + 0.5) * CANVAS_HEIGHT * 0.8) + 
                     (Math.sin(time * 2 + i) * 5);
            
            // Particle glow
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 10);
            gradient.addColorStop(0, 'rgba(153, 102, 255, 0.2)');
            gradient.addColorStop(1, 'rgba(102, 51, 204, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fill();
            
            // Particle core
            ctx.fillStyle = '#bb99ff';
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

export { WelcomeScreen as default };
