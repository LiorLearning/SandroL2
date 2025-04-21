import { GROUND_LEVEL } from './constants.js';
import { isColliding } from './utils.js';

export default class Blaze {
    constructor(x, patrolStart, patrolEnd, platform = null) {
        this.x = x;
        this.y = platform ? platform.y - 70 : GROUND_LEVEL - 30; // Higher off ground than endermen
        this.width = 50;
        this.height = 50;
        this.baseSpeed = 0.6; // Slightly faster than endermen
        this.speed = this.baseSpeed;
        this.direction = 1;
        this.patrolStart = patrolStart || x - 150;
        this.patrolEnd = patrolEnd || x + 150;
        this.platform = platform;
        this.isFalling = false;
        this.fallVelocity = 0;
        this.frameCount = 0;
        this.animationSpeed = 8; // Faster animation
        this.currentFrame = 0;
        this.totalFrames = 4;
        this.particles = []; // Array to store fire particles
        
        // Health properties
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.isDamaged = false;
        this.damageTimer = 0;
        this.damageDuration = 500; // Duration to show damage effect in milliseconds
        
        // Floating properties (blazes hover in the air)
        this.floatingOffset = 0;
        this.floatingSpeed = 0.02;
        this.floatingHeight = 10;
    }

    update(deltaTime) {
        // Horizontal movement
        this.x += this.speed * this.direction;
        
        // Implement floating/hovering motion
        this.floatingOffset += this.floatingSpeed;
        const floatingY = Math.sin(this.floatingOffset) * this.floatingHeight;
        
        // Update Y position based on platform and floating
        if (this.platform) {
            const onPlatform = this.x + this.width > this.platform.x && 
                             this.x < this.platform.x + this.platform.width;
                             
            if (!onPlatform) {
                this.isFalling = true;
                this.platform = null;
                this.fallVelocity = 0;
            } else {
                // Hover above platform
                this.y = this.platform.y - this.height + floatingY;
            }
        }
        
        // Handle falling
        if (this.isFalling) {
            this.fallVelocity += 0.2; // Slower fall due to hovering
            this.y += this.fallVelocity;
            
            if (this.y >= GROUND_LEVEL - 30) {
                this.y = GROUND_LEVEL - 30;
                this.isFalling = false;
                this.fallVelocity = 0;
                // Create fire particles when landing
                this._createFireParticles();
            }
        } else if (!this.platform) {
            // Hover above ground
            this.y = GROUND_LEVEL - 30 + floatingY;
        }
        
        // Patrol boundaries
        if (this.x <= this.patrolStart) {
            this.direction = 1;
        } else if (this.x >= this.patrolEnd) {
            this.direction = -1;
        }
        
        // Update particles
        this._updateParticles();
        
        // Update animation
        this.frameCount++;
        if (this.frameCount >= this.animationSpeed) {
            this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
            this.frameCount = 0;
        }
        
        // Update damage state
        if (this.isDamaged) {
            this.damageTimer += deltaTime;
            if (this.damageTimer >= this.damageDuration) {
                this.isDamaged = false;
            }
        }
        
        // Occasionally create ambient fire particles
        if (Math.random() < 0.05) {
            this._createFireParticles(1); // Create just one ambient particle
        }
    }

    checkCollision(player) {
        const blazeBounds = {
            x: this.x + 7,
            y: this.y + 10,
            width: this.width - 14,
            height: this.height - 12
        };
        
        const playerBounds = player.getBounds();
        
        if (player.velocityY < -4) {
            blazeBounds.height -= 10;
        }
        
        return isColliding(playerBounds, blazeBounds);
    }

    render(ctx, cameraOffset, assetLoader) {
        const screenX = this.x - cameraOffset;
        
        // Don't render if off screen (optimization)
        if (screenX < -this.width || screenX > ctx.canvas.width) {
            return;
        }
        
        ctx.save();
        
        // Render particles first (behind the blaze)
        this._renderParticles(ctx, cameraOffset);
        
        // Apply floating effect
        const floatingY = Math.sin(this.floatingOffset) * this.floatingHeight;
        
        // Get blaze texture from asset loader
        const blazeTexture = assetLoader?.getAsset('blaze');
        if (blazeTexture) {
            const blazeWidth = this.width * 1.5;
            const blazeHeight = this.height * 1.6;
            const blazeX = screenX - (blazeWidth - this.width) / 2;
            const blazeY = this.y - (blazeHeight - this.height);
            
            ctx.save();
            const centerX = blazeX + blazeWidth / 2;
            const centerY = blazeY + blazeHeight / 2;
            
            ctx.translate(centerX, centerY);
            
            // Face direction
            if (this.direction < 0) {
                ctx.scale(-1, 1);
            }
            
            // Add floating effect
            const wobbleAngle = Math.sin(this.currentFrame * (Math.PI / 2)) * 0.05;
            ctx.rotate(wobbleAngle);
            
            // Apply damage effects
            if (this.isDamaged) {
                // Flickering opacity for damage effect
                ctx.globalAlpha = 0.5 + Math.sin(this.damageTimer * 0.2) * 0.2;
                // Add blue tint for damage (contrasting with fire)
                ctx.filter = 'brightness(1.3) hue-rotate(180deg)';
            } else {
                // Reduced opacity based on health
                const healthPercent = this.health / this.maxHealth;
                ctx.globalAlpha = 0.6 + (healthPercent * 0.4); // From 0.6 to 1.0 opacity
            }
            
            // Draw the blaze
            ctx.drawImage(blazeTexture, -blazeWidth / 2, -blazeHeight / 2, blazeWidth, blazeHeight);
            ctx.restore();
            
            // Draw health bar
            this._renderHealthBar(ctx, screenX);
            
            // Add glow effect for fire
            if (!this.isDamaged) {
                ctx.globalCompositeOperation = 'lighter';
                ctx.globalAlpha = 0.2 + Math.sin(Date.now() * 0.005) * 0.1;
                
                const glowGradient = ctx.createRadialGradient(
                    screenX + this.width/2, this.y + this.height/2, 0,
                    screenX + this.width/2, this.y + this.height/2, this.width
                );
                
                glowGradient.addColorStop(0, 'rgba(255, 200, 0, 0.4)');
                glowGradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
                
                ctx.fillStyle = glowGradient;
                ctx.fillRect(
                    screenX - this.width/2, 
                    this.y - this.height/2,
                    this.width * 2,
                    this.height * 2
                );
                
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1;
            }
        } else {
            // Fallback rendering if no texture
            ctx.fillStyle = this.isDamaged ? '#AA5555' : '#FF8800';
            ctx.fillRect(screenX, this.y, this.width, this.height);
            this._renderHealthBar(ctx, screenX);
        }
        
        ctx.restore();
    }

    _renderHealthBar(ctx, screenX) {
        const barWidth = 40;
        const barHeight = 6;
        const barX = screenX - 5;
        const barY = this.y - 30;
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Draw health
        const healthPercent = this.health / this.maxHealth;
        const healthWidth = barWidth * healthPercent;
        
        // Health bar gradient (orange to yellow)
        const gradient = ctx.createLinearGradient(barX, barY, barX + healthWidth, barY);
        gradient.addColorStop(0, '#ff9900');  // Orange
        gradient.addColorStop(1, '#ffcc00');  // Yellow
        
        ctx.fillStyle = gradient;
        ctx.fillRect(barX, barY, healthWidth, barHeight);
        
        // Draw border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    takeDamage(amount) {
        this.health -= amount;
        this.isDamaged = true;
        this.damageTimer = 0;
        
        // Create damage particles
        this._createDamageParticles();
        
        return this.health <= 0; // Return true if blaze should be defeated
    }

    _createFireParticles(count = 10) {
        // Create fire particles
        const particleCount = count || 5 + Math.floor(Math.random() * 6);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: this.x + this.width / 2 + (Math.random() - 0.5) * this.width * 0.8,
                y: this.y + this.height / 2 + (Math.random() - 0.5) * this.height * 0.8,
                size: 2 + Math.random() * 3,
                speedX: -0.5 + Math.random(),
                speedY: -1 - Math.random() * 1.5,
                life: 30 + Math.random() * 30,
                color: Math.random() < 0.7 ? 
                    `rgba(255, ${150 + Math.floor(Math.random() * 100)}, 0, 0.8)` : 
                    `rgba(255, 255, ${100 + Math.floor(Math.random() * 155)}, 0.8)`
            });
        }
    }

    _createDamageParticles() {
        // Create particles when blaze is hit (blue particles to contrast with fire)
        const particleCount = 8 + Math.floor(Math.random() * 5);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: this.x + this.width / 2 + (Math.random() - 0.5) * this.width,
                y: this.y + this.height / 2 + (Math.random() - 0.5) * this.height,
                size: 2 + Math.random() * 3,
                speedX: -3 + Math.random() * 6,
                speedY: -4 - Math.random() * 2,
                life: 30 + Math.random() * 20,
                color: 'rgba(100, 100, 255, 0.8)' // Blue damage particles
            });
        }
    }

    _updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.speedY += 0.05; // Slower rise and fall for fire particles
            p.life--;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    _renderParticles(ctx, cameraOffset) {
        for (const p of this.particles) {
            const screenX = p.x - cameraOffset;
            
            // Skip off-screen particles
            if (screenX < -p.size || screenX > ctx.canvas.width + p.size) {
                continue;
            }
            
            // Calculate alpha based on remaining life
            const alpha = p.life / 30;
            const size = p.size * (1 + (1 - alpha) * 0.5); // Particles grow slightly as they fade
            
            // Draw particle
            ctx.fillStyle = p.color || `rgba(255, ${150 + Math.floor(Math.random() * 100)}, 0, ${alpha})`;
            ctx.beginPath();
            ctx.arc(screenX, p.y, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Add glow for fire particles
            if (!p.color || p.color.includes('255, ')) { // Only for fire particles, not damage particles
                ctx.globalCompositeOperation = 'lighter';
                ctx.globalAlpha = alpha * 0.5;
                
                const glowSize = size * 2;
                const glowGradient = ctx.createRadialGradient(
                    screenX, p.y, 0,
                    screenX, p.y, glowSize
                );
                
                glowGradient.addColorStop(0, 'rgba(255, 200, 0, 0.5)');
                glowGradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
                
                ctx.fillStyle = glowGradient;
                ctx.beginPath();
                ctx.arc(screenX, p.y, glowSize, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = 1;
            }
        }
    }
} 