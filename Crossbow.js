export default class Crossbow {
    constructor(x, y, direction, assetLoader) {
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 10;
        this.direction = direction; // 1 for right, -1 for left
        this.speed = 12; // Faster than hammer
        this.active = true;
        this.assetLoader = assetLoader;
        this.rotationAngle = 0;
        this.rotationSpeed = 0.1; // Less rotation than hammer
        this.initialX = x; // Store initial position for distance calculation
        this.isArrow = true; // Flag to identify this as an arrow/bolt
        
        // Add hit effect properties
        this.isHitting = false;
        this.hitTimer = 0;
        this.hitDuration = 150; // milliseconds
        this.hitParticles = [];
        
        // Add shield effect (for display only)
        this.hasShield = true;
        this.shieldTimer = 0; 
        this.shieldCooldown = 3000; // milliseconds
        
        // For collision detection
        this.hitbox = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    update(deltaTime) {
        // Move the arrow in the shot direction
        this.x += this.speed * this.direction;
        
        // Slight rotation for arrow/bolt flight
        this.rotationAngle = 0.1 * this.direction;
        
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
        
        // Update shield cooldown
        if (this.shieldTimer > 0) {
            this.shieldTimer -= deltaTime;
        }
        
        // Deactivate arrow after traveling a certain distance
        if (Math.abs(this.x - this.initialX) > 700) { // Longer range than hammer
            this.active = false;
        }
    }
    
    triggerHitEffect() {
        this.isHitting = true;
        this.hitTimer = 0;
        
        // Create particles (different from hammer - more speedy particles)
        for (let i = 0; i < 10; i++) {
            this.hitParticles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                vx: (Math.random() - 0.5) * 7,
                vy: (Math.random() - 0.5) * 7,
                size: 1 + Math.random() * 2,
                life: 150 + Math.random() * 200,
                color: Math.random() < 0.5 ? 
                    'rgba(255, 200, 0, 0.8)' : 
                    'rgba(255, 100, 0, 0.8)'
            });
        }
    }
    
    activateShield() {
        if (this.shieldTimer <= 0) {
            this.shieldTimer = this.shieldCooldown;
            return true;
        }
        return false;
    }
    
    checkBlazeCollision(blaze) {
        if (!this.active) return false;
        
        // Simple rectangular collision detection
        const collision = (
            this.x < blaze.x + blaze.width &&
            this.x + this.width > blaze.x &&
            this.y < blaze.y + blaze.height &&
            this.y + this.height > blaze.y
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
                const alpha = Math.min(1, particle.life / 150);
                
                ctx.fillStyle = particle.color || `rgba(255, 200, 0, ${alpha})`;
                ctx.beginPath();
                ctx.arc(particleX, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Add glow effect
                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = `rgba(255, 150, 0, ${alpha * 0.5})`;
                ctx.beginPath();
                ctx.arc(particleX, particle.y, particle.size * 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
            }
        }
        
        // Move to center of arrow for rotation
        ctx.translate(screenX + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotationAngle);
        
        // Add trail effect
        if (!this.isHitting) {
            ctx.globalCompositeOperation = 'lighter';
            const trailGradient = ctx.createLinearGradient(
                -this.width, 0,
                -this.width * 3 * this.direction, 0
            );
            trailGradient.addColorStop(0, 'rgba(255, 200, 0, 0.7)');
            trailGradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
            
            ctx.fillStyle = trailGradient;
            ctx.fillRect(
                -this.width * 3 * this.direction, 
                -this.height / 2, 
                this.width * 2, 
                this.height
            );
            ctx.globalCompositeOperation = 'source-over';
        }
        
        // Add hit glow effect
        if (this.isHitting) {
            ctx.shadowColor = 'orange';
            ctx.shadowBlur = 15;
        }
        
        // Draw the arrow image if loaded
        const arrowImage = this.assetLoader.getAsset('arrow');
        if (arrowImage) {
            // If hitting, increase size briefly
            const scaleFactor = this.isHitting ? 1.3 : 1;
            const effectiveWidth = this.width * scaleFactor * 1.5;
            const effectiveHeight = this.height * scaleFactor * 1.5;
            
            ctx.drawImage(
                arrowImage, 
                -effectiveWidth / 2, 
                -effectiveHeight / 2, 
                effectiveWidth, 
                effectiveHeight
            );
        } else {
            // Fallback if image not loaded
            ctx.fillStyle = this.isHitting ? '#FFA500' : '#A86032';
            
            // Draw arrow shape
            ctx.beginPath();
            ctx.moveTo(this.width/2, 0);  // Tip of arrow
            ctx.lineTo(-this.width/2, -this.height/2); // Left back corner
            ctx.lineTo(-this.width/3, 0); // Notch
            ctx.lineTo(-this.width/2, this.height/2); // Right back corner
            ctx.closePath();
            ctx.fill();
            
            // Add fletching
            ctx.fillStyle = this.isHitting ? '#FFCC00' : '#553300';
            ctx.fillRect(-this.width/2, -this.height/2, this.width/4, this.height);
        }
        
        ctx.restore();
    }
    
    // Method to render shield effect (from player)
    renderShield(ctx, playerX, playerY, cameraOffset, facing) {
        if (this.shieldTimer <= 0) return; // Only render when shield is active
        
        const screenX = playerX - cameraOffset;
        const shieldProgress = this.shieldTimer / this.shieldCooldown;
        
        // Shield positioning based on player facing
        const shieldX = screenX + (facing === 1 ? 20 : -20);
        const shieldY = playerY + 15;
        
        ctx.save();
        
        // Shield glow and transparency based on remaining time
        ctx.globalAlpha = Math.min(1, shieldProgress * 1.5);
        
        // Draw shield
        const shieldImage = this.assetLoader.getAsset('shield');
        
        if (shieldImage) {
            // Flip based on facing direction
            ctx.translate(shieldX, shieldY);
            if (facing === -1) {
                ctx.scale(-1, 1);
            }
            
            // Size of shield
            const shieldWidth = 30;
            const shieldHeight = 40;
            
            ctx.drawImage(
                shieldImage,
                -shieldWidth/2,
                -shieldHeight/2,
                shieldWidth,
                shieldHeight
            );
        } else {
            // Fallback shield rendering
            ctx.fillStyle = '#AAAAAA';
            ctx.strokeStyle = '#555555';
            ctx.lineWidth = 2;
            
            // Shield shape
            ctx.beginPath();
            ctx.arc(shieldX, shieldY, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Shield emblem
            ctx.fillStyle = '#884400';
            ctx.beginPath();
            ctx.arc(shieldX, shieldY, 7, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add shield glow
        ctx.globalCompositeOperation = 'lighter';
        const glowGradient = ctx.createRadialGradient(
            shieldX, shieldY, 0,
            shieldX, shieldY, 25
        );
        glowGradient.addColorStop(0, 'rgba(200, 200, 255, 0.5)');
        glowGradient.addColorStop(1, 'rgba(100, 100, 255, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(shieldX, shieldY, 25, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
} 