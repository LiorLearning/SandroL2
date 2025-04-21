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
            obsidian: 4
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
        // Keep this method empty but present to avoid breaking existing code
        // We're no longer using a craft button
    }

    render(ctx) {
        // Draw panel background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw border
        ctx.strokeStyle = '#553300';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
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
        
        // Draw the goal title
        ctx.fillStyle = '#FFCC33'; // Amber color
        ctx.font = 'italic 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Goal: Collect items to escape the Nether', this.x + this.width / 2, this.y + 45);

        // Draw resource requirements with status indicators
        this.renderResourceRequirement(ctx, 'Crossbow', 'crossbow', 1, 70);
        this.renderResourceRequirement(ctx, 'Shield', 'shield', 1, 100);
        this.renderResourceRequirement(ctx, 'Obsidian', 'obsidian', 4, 130);

        // Draw completion status
        const allRequirementsMet = 
            (this.resources.crossbow || 0) >= this.requirements.crossbow &&
            (this.resources.shield || 0) >= this.requirements.shield &&
            (this.resources.obsidian || 0) >= this.requirements.obsidian;

        ctx.fillStyle = allRequirementsMet ? '#4CAF50' : '#FFCC33';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            allRequirementsMet ? 'All requirements met!' : 'Collect all resources', 
            this.x + this.width / 2, 
            this.y + 155
        );

        // Draw instructions
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Mine for items in the world', this.x + this.width / 2, this.y + 175);
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

        // Progress bar
        const barWidth = 120; // Adjusted width
        const barHeight = 6;
        const barX = this.x + 70; // Moved right to accommodate larger image
        const barY = this.y + yPos + 8;
        
        // Background bar with border
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Progress with gradient
        const progress = Math.min(current / required, 1);
        if (progress > 0) {
            const gradient = ctx.createLinearGradient(barX, barY, barX + barWidth * progress, barY);
            if (isMet) {
                gradient.addColorStop(0, '#388E3C'); // Darker green
                gradient.addColorStop(1, '#4CAF50'); // Lighter green
            } else {
                gradient.addColorStop(0, '#555555'); // Dark gray
                gradient.addColorStop(1, '#777777'); // Light gray
            }
            ctx.fillStyle = gradient;
            ctx.fillRect(barX, barY, barWidth * progress, barHeight);
        }
    }

    cleanup() {
        this.game.canvas.removeEventListener('click', this.handleClick);
    }
}
