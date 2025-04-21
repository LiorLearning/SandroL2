function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
import { GROUND_LEVEL } from './constants.js';
import { isColliding } from './utils.js';
var Zombie = /*#__PURE__*/ function() {
    "use strict";
    function Zombie(x, patrolStart, patrolEnd) {
        var platform = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
        _class_call_check(this, Zombie);
        this.x = x;
        this.y = platform ? platform.y - 50 : GROUND_LEVEL - 10; // Adjusted to match visual position of zombie
        this.width = 30; // Slightly wider to match zombie image
        this.height = 50; // Taller to match zombie image
        this.baseSpeed = 0.5;
        this.speed = this.baseSpeed;
        this.direction = 1; // 1 for right, -1 for left
        this.goldNuggetsCollected = 0;
        // Patrol zone
        this.patrolStart = patrolStart || x - 150;
        this.patrolEnd = patrolEnd || x + 150;
        // Platform the zombie is on (if any)
        this.platform = platform;
        // Falling animation properties
        this.isFalling = false;
        this.fallVelocity = 0;
        // Animation
        this.frameCount = 0;
        this.animationSpeed = 10;
        this.currentFrame = 0;
        this.totalFrames = 4; // 4 frame simple animation
    }
    _create_class(Zombie, [
        {
            key: "update",
            value: function update(deltaTime) {
                // Move zombie based on direction
                this.x += this.speed * this.direction;
                // Add falling state and velocity for animation
                this.isFalling = false;
                this.fallVelocity = this.fallVelocity || 0;
                // Check if zombie is about to walk off platform edge
                if (this.platform) {
                    var onPlatform = this.x + this.width > this.platform.x && this.x < this.platform.x + this.platform.width;
                    if (!onPlatform) {
                        // Zombie walked off the platform edge, start falling animation
                        this.isFalling = true;
                        this.platform = null;
                        this.fallVelocity = 0; // Initialize fall velocity
                    } else {
                        // Stay on platform
                        this.y = this.platform.y - this.height;
                    }
                }
                // Handle falling animation
                if (this.isFalling) {
                    // Apply gravity to falling velocity
                    this.fallVelocity += 0.4;
                    this.y += this.fallVelocity;
                    // Check if zombie reached ground level
                    if (this.y >= GROUND_LEVEL - 5) {
                        this.y = GROUND_LEVEL - 5;
                        this.isFalling = false;
                        this.fallVelocity = 0;
                    }
                } else if (!this.platform) {
                    // If on ground, stay at ground level
                    this.y = GROUND_LEVEL - 5;
                }
                // Change direction if reaching patrol boundary
                if (this.x <= this.patrolStart) {
                    this.direction = 1; // Move right
                } else if (this.x >= this.patrolEnd) {
                    this.direction = -1; // Move left
                }
                // Update animation frame
                this.frameCount++;
                if (this.frameCount >= this.animationSpeed) {
                    this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
                    this.frameCount = 0;
                }
                ;
            }
        },
        {
            key: "updateSpeed",
            value: function updateSpeed(goldNuggets) {
                this.goldNuggetsCollected = goldNuggets;
                var speedIncreases = Math.floor(this.goldNuggetsCollected / 6);
                this.speed = Math.min(this.baseSpeed + speedIncreases * 0.1, 1.2);
            }
        },
        {
            key: "checkCollision",
            value: function checkCollision(player) {
                // Create optimized collision bounds to match the visual appearance of the zombie sprite
                // The full body zombie image has some transparent space around it, so adjust collision accordingly
                var zombieBounds = {
                    x: this.x + 7,
                    y: this.y + 10,
                    width: this.width - 14,
                    height: this.height - 12 // Reduce height to match the actual body in the sprite
                };
                // Also check if player is jumping over the zombie - higher jump = better chance to clear
                var playerBounds = player.getBounds();
                // If player is moving upward quickly, give additional leeway for jumping over zombies
                if (player.velocityY < -4) {
                    // Player is jumping upward strongly, increase their chance to clear the zombie
                    zombieBounds.height -= 10; // Further reduce collision height
                }
                return isColliding(playerBounds, zombieBounds);
            }
        },
        {
            key: "render",
            value: function render(ctx, cameraOffset, assetLoader) {
                // Skip rendering zombies that are off screen
                const screenX = this.x - cameraOffset;
                if (screenX < -this.width || screenX > ctx.canvas.width) {
                    return;
                }
                
                ctx.save();
                
                // Apply rotation when falling
                if (this.isFalling) {
                    const centerX = screenX + this.width / 2;
                    const centerY = this.y + this.height / 2;
                    const rotationAngle = Math.min(this.fallVelocity * 0.05, 0.3);
                    
                    ctx.translate(centerX, centerY);
                    ctx.rotate(rotationAngle * this.direction);
                    ctx.translate(-centerX, -centerY);
                }
                
                // Get zombie texture from asset loader
                const zombieTexture = assetLoader?.getAsset('full body zombie minecraft');
                
                if (zombieTexture) {
                    // Draw the zombie image instead of rendering shapes
                    const zombieWidth = this.width * 1.5;
                    const zombieHeight = this.height * 1.6;
                    
                    // Calculate zombie position (centered)
                    const zombieX = screenX - (zombieWidth - this.width) / 2;
                    const zombieY = this.y - (zombieHeight - this.height);
                    
                    ctx.save();
                    
                    // Center of zombie for transformations
                    const centerX = zombieX + zombieWidth / 2;
                    const centerY = zombieY + zombieHeight / 2;
                    
                    ctx.translate(centerX, centerY);
                    
                    // Flip horizontally if moving left
                    if (this.direction < 0) {
                        ctx.scale(-1, 1);
                    }
                    
                    // Add slight wobble for walking animation
                    const wobbleAngle = Math.sin(this.currentFrame * (Math.PI / 2)) * 0.05;
                    ctx.rotate(wobbleAngle);
                    
                    // Add falling rotation if needed
                    if (this.isFalling) {
                        const fallRotation = Math.min(this.fallVelocity * 0.05, 0.3) * this.direction;
                        ctx.rotate(fallRotation);
                    }
                    
                    // Draw zombie image centered at origin (after transformations)
                    ctx.drawImage(zombieTexture, -zombieWidth / 2, -zombieHeight / 2, zombieWidth, zombieHeight);
                    
                    ctx.restore();
                } else {
                    // Fallback to simple colored rectangle if texture not available
                    ctx.fillStyle = '#009900'; // Green color for zombie
                    ctx.fillRect(screenX, this.y, this.width, this.height);
                    
                    // Eyes
                    ctx.fillStyle = 'black';
                    ctx.fillRect(screenX + 5, this.y + 5, 4, 4);
                    ctx.fillRect(screenX + 15, this.y + 5, 4, 4);
                    
                    // Mouth
                    ctx.fillRect(screenX + 5, this.y + 15, 14, 2);
                }
                
                // Draw "ouch" text above zombie if hit
                if (this.isHit) {
                    ctx.fillStyle = 'white';
                    ctx.font = '12px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText("Ouch!", screenX + this.width / 2, this.y - 10);
                }
                
                ctx.restore();
            }
        }
    ]);
    return Zombie;
}();
export { Zombie as default };
