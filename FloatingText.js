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
export var FloatingText = /*#__PURE__*/ function() {
    "use strict";
    function FloatingText(text, x, y, lifespan, options) {
        _class_call_check(this, FloatingText);
        this.text = text || '';
        this.x = x;
        this.y = y;
        this.alpha = 1;
        this.scale = 1;
        this.lifespan = lifespan || 1500; // Use provided lifespan or default to 1.5 seconds
        this.elapsed = 0;
        this.velocityY = -1.5; // Move upward
        this.velocityX = 0; // Default horizontal velocity
        this.fontSize = 14; // Default font size
        
        // Process options if provided
        if (options) {
            if (typeof options === 'string') {
                // For backward compatibility - treat as color
                this.color = options;
            } else if (typeof options === 'object') {
                // New approach with options object
                this.color = options.color || 'white';
                this.fontSize = options.fontSize || 14;
                this.velocityY = options.velocityY !== undefined ? options.velocityY : -1.5;
                this.velocityX = options.velocityX || 0;
                this.centered = options.centered || false;
            }
        } else {
            // Determine color based on text content if it's a string
            if (typeof this.text === 'string') {
                if (this.text.includes('sticks')) {
                    this.color = '#8B4513'; // Brown for sticks
                } else if (this.text.includes('strings')) {
                    this.color = '#DDDDDD'; // Light gray for strings
                } else if (this.text.includes('flint')) {
                    this.color = '#777777'; // Dark gray for flint
                } else if (this.text.includes('feather')) {
                    this.color = '#F5F5F5'; // White for feather
                } else if (this.text.includes('gold')) {
                    this.color = '#FFD700'; // Gold for gold nuggets
                } else {
                    this.color = 'white'; // Default color
                }
            } else {
                this.color = 'white'; // Default if text isn't a string
            }
        }
    }
    _create_class(FloatingText, [
        {
            key: "update",
            value: function update(deltaTime) {
                // Handle custom velocity if defined, otherwise use default velocityY/velocityX
                if (this.velocity) {
                    this.x += this.velocity.x;
                    this.y += this.velocity.y;
                    
                    // Add gravity effect for sparkles
                    this.velocity.y += 0.05;
                } else {
                    // Update position with standard velocities
                    this.y += this.velocityY;
                    this.x += this.velocityX;
                }
                
                // Update animation properties
                this.elapsed += deltaTime;
                var progress = this.elapsed / this.lifespan;
                // Fade out gradually
                if (progress < 0.5) {
                    this.alpha = 1;
                } else {
                    this.alpha = 1 - (progress - 0.5) * 2; // Linear fade from 1 to 0 in second half
                }
                // Scale up slightly then back down
                if (progress < 0.2) {
                    this.scale = 1 + progress * 0.5; // Scale up to 1.1x
                } else {
                    this.scale = 1.1 - (progress - 0.2) * 0.2; // Scale down from 1.1x to 0.9x
                }
            }
        },
        {
            key: "isDone",
            value: function isDone() {
                return this.elapsed >= this.lifespan;
            }
        },
        {
            key: "render",
            value: function render(ctx, cameraOffset) {
                // Only render if still visible
                if (this.alpha <= 0) return;
                // Calculate screen position
                var screenX = this.x - cameraOffset;
                // Set text style
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.font = "".concat(this.fontSize * this.scale, "px Arial");
                ctx.textAlign = 'center';
                // Add text shadow for better visibility
                ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
                ctx.shadowBlur = 4;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;
                // Draw text
                ctx.fillText(this.text, screenX, this.y);
                ctx.restore();
            }
        }
    ]);
    return FloatingText;
}();
