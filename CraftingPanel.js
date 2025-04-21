import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';

export class CraftingPanel {
    constructor(resources, game) {
        this.resources = resources;
        this.game = game;
        this.width = 200;
        this.height = 200; // Increased height to fit all requirements
        this.x = CANVAS_WIDTH - this.width - 10;
        this.y = 10;
        
        // Resource requirements
        this.requirements = {
            crossbow: 1,
            shield: 1,
            obsidian: 4,
            enderpearl: 2
        };
        
        // Add craft button
        this.craftButton = {
            width: 120,
            height: 40,
            x: this.x + (this.width - 120) / 2,
            y: this.y + 195,
            visible: false
        };
        
        // Remove the click handler as we're no longer using a craft button
        this.handleClick = this.handleClick.bind(this);
        this.game.canvas.addEventListener('click', this.handleClick);
        
        // Track highlighted resources
        this.highlightedResource = null;
        this.highlightTimer = 0;
        this.highlightDuration = 1000; // 1 second highlight
    }

    updateResources(resources) {
        this.resources = resources;
    }

    highlightResource(resourceType) {
        this.highlightedResource = resourceType;
        this.highlightTimer = this.highlightDuration;
    }

    handleClick(e) {
        // Check if craft button is clicked
        if (this.craftButton.visible) {
            const rect = this.game.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            if (mouseX >= this.craftButton.x && 
                mouseX <= this.craftButton.x + this.craftButton.width &&
                mouseY >= this.craftButton.y && 
                mouseY <= this.craftButton.y + this.craftButton.height) {
                
                // Create portal
                this.createPortal();
            }
        }
    }

    createPortal() {
        // Check if we have enough resources
        if (
            (this.resources.crossbow || 0) >= this.requirements.crossbow &&
            (this.resources.shield || 0) >= this.requirements.shield &&
            (this.resources.obsidian || 0) >= this.requirements.obsidian &&
            (this.resources.enderpearl || 0) >= this.requirements.enderpearl
        ) {
            // Use resources
            this.resources.obsidian -= this.requirements.obsidian;
            this.resources.enderpearl -= this.requirements.enderpearl;
            
            // Create portal in front of player
            const portalX = this.game.player.x + 150;
            const portalY = this.game.player.y - 100;
            
            // Create portal object in the game
            if (typeof this.game.createPortal === 'function') {
                this.game.createPortal(portalX, portalY);

                console.log("Portal created at", portalX, portalY);
                
                // Make sure the portal is using the correct image
                // The asset should be preloaded as 'portal' in the AssetLoader
                const portalImage = this.game.assetLoader.getAsset('portal');
                console.log("Portal image", portalImage);
                if (!portalImage) {
                    // If portal image isn't loaded yet, try to load it
                    this.game.assetLoader.loadImage('portal', 'assets/level3/portal.png')
                        .then(() => {
                            // Refresh the portal rendering
                            if (this.game.portal) {
                                this.game.portal.imageLoaded = true;
                            }
                        });
                }
            }
            
            // Play portal creation sound
            this.game.audioManager.play('collect', 1.5);
            
            // Add floating text message
            this.game.floatingTexts.push(
                new this.game.floatingTextClass(
                    "Portal Created!",
                    portalX,
                    portalY - 50,
                    3000, // longer duration
                    { color: '#AA55FF' } // purple color
                )
            );
            
            // Apply screen shake for effect
            this.game.applyScreenShake(8);
            
            // Update resources display
            this.updateResources(this.resources);
            
            // Hide craft button after portal is created
            this.craftButton.visible = false;
        }
    }

    render(ctx) {
        // Draw panel background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.x, this.y, this.width, this.height + 30); // Increased height for new resource
        
        // Draw border
        ctx.strokeStyle = '#553300';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height + 30); // Increased height for new resource
        
        // Draw diagonal corners for Minecraft style
        const cornerSize = 8;
        ctx.fillStyle = '#2C1D06';
        
        // Top left corner
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + cornerSize, this.y);
        ctx.lineTo(this.x, this.y + cornerSize);
        ctx.fill();
        
        // Top right corner
        ctx.beginPath();
        ctx.moveTo(this.x + this.width, this.y);
        ctx.lineTo(this.x + this.width - cornerSize, this.y);
        ctx.lineTo(this.x + this.width, this.y + cornerSize);
        ctx.fill();
        
        // Draw title
        ctx.fillStyle = '#FFD700'; // Gold color for title
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Required Resources', this.x + this.width / 2, this.y + 25);

        // Draw divider line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(this.x + 10, this.y + 35);
        ctx.lineTo(this.x + this.width - 10, this.y + 35);
        ctx.stroke();

        // Draw resource requirements with status indicators
        this.renderResourceRequirement(ctx, 'Crossbow', 'crossbow', 1, 70);
        this.renderResourceRequirement(ctx, 'Shield', 'shield', 1, 100);
        this.renderResourceRequirement(ctx, 'Obsidian', 'obsidian', 4, 130);
        this.renderResourceRequirement(ctx, 'Ender Pearl', 'enderpearl', 2, 160);

        // Draw completion status
        const allRequirementsMet = 
            (this.resources.crossbow || 0) >= this.requirements.crossbow &&
            (this.resources.shield || 0) >= this.requirements.shield &&
            (this.resources.obsidian || 0) >= this.requirements.obsidian &&
            (this.resources.enderpearl || 0) >= this.requirements.enderpearl;

        ctx.fillStyle = allRequirementsMet ? '#4CAF50' : '#FFCC33';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            allRequirementsMet ? 'All requirements met!' : 'Collect all resources', 
            this.x + this.width / 2, 
            this.y + 185
        );
        
        // Show craft button if all requirements are met
        this.craftButton.visible = allRequirementsMet && !this.game.portal;
        if (this.craftButton.visible) {
            // Draw craft button
            ctx.fillStyle = '#4CAF50';
            ctx.fillRect(this.craftButton.x, this.craftButton.y, this.craftButton.width, this.craftButton.height);
            
            // Button border
            ctx.strokeStyle = '#2C1D06';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.craftButton.x, this.craftButton.y, this.craftButton.width, this.craftButton.height);
            
            // Button text
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Create Portal', this.craftButton.x + this.craftButton.width / 2, this.craftButton.y + this.craftButton.height / 2);
        }
        
        // Update highlight timer if needed
        if (this.highlightTimer > 0) {
            this.highlightTimer -= 16; // Assume ~60fps
        }
    }

    renderResourceRequirement(ctx, label, resourceType, required, yPos) {
        const current = this.resources[resourceType] || 0;
        const isMet = current >= required;
        const isHighlighted = this.highlightedResource === resourceType && this.highlightTimer > 0;
        
        // Background for highlighted resources
        if (isHighlighted) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.fillRect(this.x + 5, this.y + yPos - 20, this.width - 10, 35);
        }
        
        // Draw resource image if available
        const resourceImage = this.game.assetLoader.getAsset(resourceType);
        if (resourceImage) {
            // Save context for image rendering
            ctx.save();
            
            // Draw the resource image
            const imageSize = 26; // Larger image size
            const imageX = this.x + 15;
            const imageY = this.y + yPos - 18;
            
            // Draw background for the image to make it stand out
            ctx.fillStyle = 'rgba(50, 50, 50, 0.5)';
            ctx.fillRect(imageX - 1, imageY - 1, imageSize + 2, imageSize + 2);
            
            // Draw a frame around the image only if requirement is met
            if (isMet) {
                ctx.strokeStyle = '#4CAF50';
                ctx.lineWidth = 1;
                ctx.strokeRect(imageX - 1, imageY - 1, imageSize + 2, imageSize + 2);
            }
            
            // Draw the image with effects
            if (isMet) {
                // Add a subtle glow for met requirements
                ctx.shadowColor = '#4CAF50';
                ctx.shadowBlur = 6;
            } else if (isHighlighted) {
                // Add pulse effect for newly highlighted resources
                ctx.shadowColor = '#FFCC33';
                ctx.shadowBlur = 8;
                
                // Pulse animation for highlighted items
                const pulseScale = 1 + Math.sin(Date.now() / 200) * 0.05;
                ctx.translate(imageX + imageSize/2, imageY + imageSize/2);
                ctx.scale(pulseScale, pulseScale);
                ctx.translate(-(imageX + imageSize/2), -(imageY + imageSize/2));
            }
            
            // Draw the image
            ctx.drawImage(resourceImage, imageX, imageY, imageSize, imageSize);
            ctx.restore(); // Restore context after image rendering
            
            // Resource label - move to the right to make room for image
            ctx.fillStyle = isMet ? '#4CAF50' : 'white'; // Green if requirement met
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(label + ':', imageX + imageSize + 8, this.y + yPos);
        } else {
            // Fallback to text-only if image not available
            ctx.fillStyle = isMet ? '#4CAF50' : 'white'; // Green if requirement met
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(label + ':', this.x + 15, this.y + yPos);
        }
        
        // Resource count
        ctx.fillStyle = isMet ? '#4CAF50' : 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${current}/${required}`, this.x + this.width - 15, this.y + yPos);
    }

    cleanup() {
        this.game.canvas.removeEventListener('click', this.handleClick);
    }
}
