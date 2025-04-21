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
        this.renderResourceRequirement(ctx, 'Crossbow', 'crossbow', 1, 55);
        this.renderResourceRequirement(ctx, 'Shield', 'shield', 1, 85);
        this.renderResourceRequirement(ctx, 'Obsidian', 'obsidian', 4, 115);

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
            ctx.fillRect(this.x + 5, this.y + yPos - 15, this.width - 10, 25);
        }
        
        // Resource label
        ctx.fillStyle = isMet ? '#4CAF50' : 'white'; // Green if requirement met
        ctx.font = '14px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(label + ':', this.x + 15, this.y + yPos);
        
        // Resource count
        ctx.textAlign = 'right';
        ctx.fillText(`${current}/${required}`, this.x + this.width - 15, this.y + yPos);

        // Progress bar
        const barWidth = 170;
        const barHeight = 6;
        const barX = this.x + 15;
        const barY = this.y + yPos + 8;
        
        // Background bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Progress
        const progress = Math.min(current / required, 1);
        ctx.fillStyle = isMet ? '#4CAF50' : '#3498db';
        ctx.fillRect(barX, barY, barWidth * progress, barHeight);
    }

    cleanup() {
        this.game.canvas.removeEventListener('click', this.handleClick);
    }
}
