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
var Enderman = /*#__PURE__*/ function() {
    "use strict";
    function Enderman(x, patrolStart, patrolEnd) {
        var platform = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
        _class_call_check(this, Enderman);
        this.x = x;
        this.y = platform ? platform.y - 50 : GROUND_LEVEL - 10;
        this.width = 30;
        this.height = 50;
        this.baseSpeed = 0.5;
        this.speed = this.baseSpeed;
        this.direction = 1;
        this.patrolStart = patrolStart || x - 150;
        this.patrolEnd = patrolEnd || x + 150;
        this.platform = platform;
        this.isFalling = false;
        this.fallVelocity = 0;
        this.frameCount = 0;
        this.animationSpeed = 10;
        this.currentFrame = 0;
        this.totalFrames = 4;
        this.particles = []; // Array to store teleport particles
        this.enderPearlsCollected = 0;
        
        // Add health properties
        this.maxHealth = 100;
        this.health = this.maxHealth;
        this.isDamaged = false;
        this.damageTimer = 0;
        this.damageDuration = 500; // Duration to show damage effect in milliseconds
    }
    _create_class(Enderman, [
        {
            key: "updateSpeed",
            value: function updateSpeed(enderPearls) {
                this.enderPearlsCollected = enderPearls;
                var speedIncreases = Math.floor(this.enderPearlsCollected / 6);
                this.speed = this.baseSpeed + speedIncreases * 0.15;
            }
        },
        {
            key: "update",
            value: function update(deltaTime) {
                this.x += this.speed * this.direction;
                if (this.platform) {
                    var onPlatform = this.x + this.width > this.platform.x && this.x < this.platform.x + this.platform.width;
                    if (!onPlatform) {
                        this.isFalling = true;
                        this.platform = null;
                        this.fallVelocity = 0;
                    } else {
                        this.y = this.platform.y - this.height;
                    }
                }
                if (this.isFalling) {
                    this.fallVelocity += 0.4;
                    this.y += this.fallVelocity;
                    if (this.y >= GROUND_LEVEL - 5) {
                        this.y = GROUND_LEVEL - 5;
                        this.isFalling = false;
                        this.fallVelocity = 0;
                        // Create teleport particles when landing
                        this._createTeleportParticles();
                    }
                } else if (!this.platform) {
                    this.y = GROUND_LEVEL - 5;
                }
                if (this.x <= this.patrolStart) {
                    this.direction = 1;
                } else if (this.x >= this.patrolEnd) {
                    this.direction = -1;
                }
                this._updateParticles();
                this.frameCount++;
                if (this.frameCount >= this.animationSpeed) {
                    this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
                    this.frameCount = 0;
                }
            }
        },
        {
            key: "checkCollision",
            value: function checkCollision(player) {
                var endermanBounds = {
                    x: this.x + 7,
                    y: this.y + 10,
                    width: this.width - 14,
                    height: this.height - 12
                };
                var playerBounds = player.getBounds();
                if (player.velocityY < -4) {
                    endermanBounds.height -= 10;
                }
                return isColliding(playerBounds, endermanBounds);
            }
        },
        {
            key: "render",
            value: function render(ctx, cameraOffset, assetLoader) {
                var screenX = this.x - cameraOffset;
                if (screenX < -this.width || screenX > ctx.canvas.width) {
                    return;
                }
                
                ctx.save();
                
                // Update damage timer if showing damage
                if (this.isDamaged) {
                    this.damageTimer += 16; // Approximate for one frame at 60fps
                    if (this.damageTimer >= this.damageDuration) {
                        this.isDamaged = false;
                    }
                }
                
                if (this.isFalling) {
                    var centerX = screenX + this.width / 2;
                    var centerY = this.y + this.height / 2;
                    var rotationAngle = Math.min(this.fallVelocity * 0.05, 0.3);
                    ctx.translate(centerX, centerY);
                    ctx.rotate(rotationAngle * this.direction);
                    ctx.translate(-centerX, -centerY);
                }
                
                var endermanTexture = assetLoader === null || assetLoader === void 0 ? void 0 : assetLoader.getAsset('enderman');
                if (endermanTexture) {
                    var endermanWidth = this.width * 1.5;
                    var endermanHeight = this.height * 1.6;
                    var endermanX = screenX - (endermanWidth - this.width) / 2;
                    var endermanY = this.y - (endermanHeight - this.height);
                    ctx.save();
                    var centerX1 = endermanX + endermanWidth / 2;
                    var centerY1 = endermanY + endermanHeight / 2;
                    ctx.translate(centerX1, centerY1);
                    if (this.direction < 0) {
                        ctx.scale(-1, 1);
                    }
                    var wobbleAngle = Math.sin(this.currentFrame * (Math.PI / 2)) * 0.05;
                    ctx.rotate(wobbleAngle);
                    if (this.isFalling) {
                        var fallRotation = Math.min(this.fallVelocity * 0.05, 0.3) * this.direction;
                        ctx.rotate(fallRotation);
                    }
                    
                    // Apply damaged appearance
                    if (this.isDamaged) {
                        // Flickering opacity for damage effect
                        ctx.globalAlpha = 0.5 + Math.sin(this.damageTimer * 0.2) * 0.2;
                        // Add red tint
                        ctx.filter = 'brightness(1.3) hue-rotate(-20deg)';
                    } else {
                        // Reduced opacity based on health
                        const healthPercent = this.health / this.maxHealth;
                        ctx.globalAlpha = 0.5 + (healthPercent * 0.5); // From 0.5 to 1.0 opacity
                    }
                    
                    ctx.drawImage(endermanTexture, -endermanWidth / 2, -endermanHeight / 2, endermanWidth, endermanHeight);
                    ctx.restore();
                } else {
                    // Fallback rendering with damage effect
                    ctx.fillStyle = this.isDamaged ? '#FF44FF' : '#442244'; // Brighter color when damaged
                    ctx.globalAlpha = this.health / this.maxHealth; // Fade based on health
                    ctx.fillRect(screenX, this.y, this.width, this.height);
                    ctx.globalAlpha = 1.0;
                }
                
                // Show health bar
                this._renderHealthBar(ctx, screenX);
                
                ctx.restore();
                this._renderParticles(ctx, cameraOffset);
            }
        },
        {
            key: "_createTeleportParticles",
            value: function _createTeleportParticles() {
                // Create 5-8 purple particles when enderman lands
                var particleCount = 5 + Math.floor(Math.random() * 4);
                for(var i = 0; i < particleCount; i++){
                    this.particles.push({
                        x: this.x + this.width / 2,
                        y: this.y + this.height,
                        size: 2 + Math.random() * 3,
                        speedX: -2 + Math.random() * 4,
                        speedY: -1 - Math.random() * 3,
                        life: 30 + Math.random() * 30
                    });
                }
            }
        },
        {
            key: "_updateParticles",
            value: function _updateParticles() {
                for(var i = this.particles.length - 1; i >= 0; i--){
                    var p = this.particles[i];
                    p.x += p.speedX;
                    p.y += p.speedY;
                    p.speedY += 0.1; // Gravity
                    p.life--;
                    if (p.life <= 0) {
                        this.particles.splice(i, 1);
                    }
                }
            }
        },
        {
            key: "_renderParticles",
            value: function _renderParticles(ctx, cameraOffset) {
                var screenX = this.x - cameraOffset;
                ctx.save();
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this.particles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var p = _step.value;
                        var alpha = Math.min(1, p.life / 20);
                        // Use particle color if specified, otherwise use default purple
                        ctx.fillStyle = p.color || "rgba(136, 0, 170, ".concat(alpha, ")");
                        ctx.beginPath();
                        ctx.arc(p.x - cameraOffset, p.y, p.size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
                ctx.restore();
            }
        },
        {
            key: "_renderHealthBar",
            value: function _renderHealthBar(ctx, screenX) {
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
                
                // Health bar gradient (green to red)
                const gradient = ctx.createLinearGradient(barX, barY, barX + healthWidth, barY);
                gradient.addColorStop(0, '#ff3030');  // Red
                gradient.addColorStop(1, '#ff5050');  // Lighter red
                
                ctx.fillStyle = gradient;
                ctx.fillRect(barX, barY, healthWidth, barHeight);
                
                // Draw border
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.lineWidth = 1;
                ctx.strokeRect(barX, barY, barWidth, barHeight);
            }
        },
        {
            key: "takeDamage",
            value: function takeDamage(amount) {
                this.health -= amount;
                this.isDamaged = true;
                this.damageTimer = 0;
                
                // Create damage particles
                this._createDamageParticles();
                
                return this.health <= 0; // Return true if enderman should be defeated
            }
        },
        {
            key: "_createDamageParticles",
            value: function _createDamageParticles() {
                // Create 8-12 particles when enderman is hit
                var particleCount = 8 + Math.floor(Math.random() * 5);
                for(var i = 0; i < particleCount; i++){
                    this.particles.push({
                        x: this.x + this.width / 2 + (Math.random() - 0.5) * this.width,
                        y: this.y + this.height / 2 + (Math.random() - 0.5) * this.height,
                        size: 2 + Math.random() * 3,
                        speedX: -3 + Math.random() * 6,
                        speedY: -4 - Math.random() * 2,
                        life: 30 + Math.random() * 20,
                        color: 'rgba(255, 0, 100, 0.8)' // Red damage particles
                    });
                }
            }
        }
    ]);
    return Enderman;
}();
export { Enderman as default };
