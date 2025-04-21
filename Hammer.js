export default class Hammer {
    constructor(x, y, direction, assetLoader) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.direction = direction; // 1 for right, -1 for left
        this.speed = 8;
        this.active = true;
        this.assetLoader = assetLoader;
        this.rotationAngle = 0;
        this.rotationSpeed = 0.2;
        
        // Add hit effect properties
        this.isHitting = false;
        this.hitTimer = 0;
        this.hitDuration = 200; // milliseconds
        this.hitParticles = [];
        
        // For collision detection
        this.hitbox = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    update(deltaTime) {
        // Move the hammer in the throw direction
        this.x += this.speed * this.direction;
        
        // Rotate the hammer for spinning effect
        this.rotationAngle += this.rotationSpeed * this.direction;
        
        // Update hitbox position
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
        
        // Update hit effect
        if (this.isHitting) {
            this.hitTimer += deltaTime;
            if (this.hitTimer >= this.hitDuration) {
                this.isHitting = false;
            }
            
            // Update hit particles
            for (let i = this.hitParticles.length - 1; i >= 0; i--) {
                const particle = this.hitParticles[i];
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life -= deltaTime;
                
                if (particle.life <= 0) {
                    this.hitParticles.splice(i, 1);
                }
            }
        }
        
        // Deactivate hammer after traveling a certain distance
        if (Math.abs(this.x - this.initialX) > 500) {
            this.active = false;
        }
    }
    
    triggerHitEffect() {
        this.isHitting = true;
        this.hitTimer = 0;
        
        // Create particles
        for (let i = 0; i < 15; i++) {
            this.hitParticles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                size: 1 + Math.random() * 3,
                life: 200 + Math.random() * 300
            });
        }
    }
    
    checkEndermanCollision(enderman) {
        if (!this.active) return false;
        
        // Simple rectangular collision detection
        const collision = (
            this.x < enderman.x + enderman.width &&
            this.x + this.width > enderman.x &&
            this.y < enderman.y + enderman.height &&
            this.y + this.height > enderman.y
        );
        
        // Trigger hit effect if there's a collision
        if (collision) {
            this.triggerHitEffect();
        }
        
        return collision;
    }
    
    render(ctx, cameraOffset) {
        if (!this.active) return;
        
        const screenX = this.x - cameraOffset;
        
        // Don't render if off screen
        if (screenX < -this.width || screenX > ctx.canvas.width) {
            return;
        }
        
        ctx.save();
        
        // Render hit particles
        if (this.isHitting) {
            for (const particle of this.hitParticles) {
                const particleX = particle.x - cameraOffset;
                const alpha = Math.min(1, particle.life / 200);
                
                ctx.fillStyle = `rgba(255, 80, 80, ${alpha})`;
                ctx.beginPath();
                ctx.arc(particleX, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Move to center of hammer for rotation
        ctx.translate(screenX + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotationAngle);
        
        // Add hit glow effect
        if (this.isHitting) {
            ctx.shadowColor = 'red';
            ctx.shadowBlur = 15;
        }
        
        // Draw the hammer image if loaded
        const hammerImage = this.assetLoader.getAsset('hammer');
        if (hammerImage) {
            // If hitting, increase size briefly
            const scaleFactor = this.isHitting ? 1.5 : 1;
            const effectiveWidth = this.width * scaleFactor;
            const effectiveHeight = this.height * scaleFactor;
            
            ctx.drawImage(
                hammerImage, 
                -effectiveWidth / 2, 
                -effectiveHeight / 2, 
                effectiveWidth, 
                effectiveHeight
            );
        } else {
            // Fallback if image not loaded
            ctx.fillStyle = this.isHitting ? '#ff5555' : '#888';
            const scaleFactor = this.isHitting ? 1.5 : 1;
            ctx.fillRect(
                -this.width * scaleFactor / 2, 
                -this.height * scaleFactor / 2, 
                this.width * scaleFactor, 
                this.height * scaleFactor
            );
        }
        
        ctx.restore();
    }
} 