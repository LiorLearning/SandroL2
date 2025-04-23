import { CANVAS_WIDTH, CANVAS_HEIGHT } from './constants.js';
import { saveFormSubmission, saveUser } from './supabaseClient.js';

class FeedbackForm {
    constructor(game) {
        this.game = game;
        this.visible = false;
        this.startTime = Date.now();
        this.formData = {
            name: '',
            enjoyment: 5,
            difficulty: 5,
            nextGameIdeas: '',
            submitted: false
        };
        
        // Form dimensions
        this.width = 400;
        this.height = 440; // Increased height to accommodate new field
        this.x = CANVAS_WIDTH / 2 - this.width / 2;
        this.y = CANVAS_HEIGHT / 2 - this.height / 2;
        
        // Input field dimensions
        this.nameField = {
            x: this.x + 30,
            y: this.y + 80,
            width: this.width - 60,
            height: 30,
            focused: false,
            text: ''
        };
        
        // Slider dimensions for enjoyment rating
        this.enjoymentSlider = {
            x: this.x + 30,
            y: this.y + 150,
            width: this.width - 60,
            height: 20,
            value: 5,
            min: 1,
            max: 10,
            active: false
        };
        
        // Slider dimensions for difficulty rating
        this.difficultySlider = {
            x: this.x + 30,
            y: this.y + 220,
            width: this.width - 60,
            height: 20,
            value: 5,
            min: 1,
            max: 10,
            active: false
        };

        // Next game ideas input field
        this.nextGameField = {
            x: this.x + 30,
            y: this.y + 290,
            width: this.width - 60,
            height: 60,
            focused: false,
            text: ''
        };
        
        // Submit button
        this.submitButton = {
            x: this.x + this.width / 2 - 60,
            y: this.y + this.height - 60,
            width: 120,
            height: 40,
            text: "SUBMIT",
            hovered: false
        };
        
        this.setupListeners();
    }
    
    setupListeners() {
        this.mouseMoveHandler = this.handleMouseMove.bind(this);
        this.clickHandler = this.handleClick.bind(this);
        this.touchHandler = this.handleTouch.bind(this);
        this.keyHandler = this.handleKey.bind(this);
        
        this.game.canvas.addEventListener('mousemove', this.mouseMoveHandler);
        this.game.canvas.addEventListener('click', this.clickHandler);
        this.game.canvas.addEventListener('touchstart', this.touchHandler);
        document.addEventListener('keydown', this.keyHandler);
    }
    
    removeListeners() {
        this.game.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
        this.game.canvas.removeEventListener('click', this.clickHandler);
        this.game.canvas.removeEventListener('touchstart', this.touchHandler);
        document.removeEventListener('keydown', this.keyHandler);
    }
    
    handleMouseMove(event) {
        if (!this.visible) return;
        const rect = this.game.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.game.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.game.canvas.height / rect.height);
        
        // Check input field hover
        this.nameField.hovered = this.isPointInRect(mouseX, mouseY, this.nameField);
        this.nextGameField.hovered = this.isPointInRect(mouseX, mouseY, this.nextGameField);
        
        // Check sliders hover/drag
        this.enjoymentSlider.hovered = this.isPointInRect(mouseX, mouseY, this.enjoymentSlider);
        if (this.enjoymentSlider.active) {
            const sliderValue = this.getSliderValue(mouseX, this.enjoymentSlider);
            this.enjoymentSlider.value = sliderValue;
            this.formData.enjoyment = sliderValue;
        }
        
        this.difficultySlider.hovered = this.isPointInRect(mouseX, mouseY, this.difficultySlider);
        if (this.difficultySlider.active) {
            const sliderValue = this.getSliderValue(mouseX, this.difficultySlider);
            this.difficultySlider.value = sliderValue;
            this.formData.difficulty = sliderValue;
        }
        
        // Check submit button hover
        this.submitButton.hovered = this.isPointInRect(mouseX, mouseY, this.submitButton);
    }
    
    getSliderValue(mouseX, slider) {
        const relativeX = mouseX - slider.x;
        const percentage = Math.max(0, Math.min(1, relativeX / slider.width));
        return Math.round(percentage * (slider.max - slider.min) + slider.min);
    }
    
    handleClick(event) {
        if (!this.visible) return;
        const rect = this.game.canvas.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) * (this.game.canvas.width / rect.width);
        const mouseY = (event.clientY - rect.top) * (this.game.canvas.height / rect.height);
        
        // Handle name field click
        if (this.isPointInRect(mouseX, mouseY, this.nameField)) {
            this.nameField.focused = true;
            this.nextGameField.focused = false;
        } 
        // Handle next game ideas field click
        else if (this.isPointInRect(mouseX, mouseY, this.nextGameField)) {
            this.nextGameField.focused = true;
            this.nameField.focused = false;
        }
        else {
            this.nameField.focused = false;
            this.nextGameField.focused = false;
        }
        
        // Handle enjoyment slider click
        if (this.isPointInRect(mouseX, mouseY, this.enjoymentSlider)) {
            this.enjoymentSlider.active = true;
            const sliderValue = this.getSliderValue(mouseX, this.enjoymentSlider);
            this.enjoymentSlider.value = sliderValue;
            this.formData.enjoyment = sliderValue;
        }
        
        // Handle difficulty slider click
        if (this.isPointInRect(mouseX, mouseY, this.difficultySlider)) {
            this.difficultySlider.active = true;
            const sliderValue = this.getSliderValue(mouseX, this.difficultySlider);
            this.difficultySlider.value = sliderValue;
            this.formData.difficulty = sliderValue;
        }
        
        // Handle submit button click
        if (this.isPointInRect(mouseX, mouseY, this.submitButton) && this.nameField.text.trim() !== '') {
            this.submitForm();
        }
        
        // Add mouse up event to stop slider dragging
        const mouseUpHandler = () => {
            this.enjoymentSlider.active = false;
            this.difficultySlider.active = false;
            document.removeEventListener('mouseup', mouseUpHandler);
        };
        document.addEventListener('mouseup', mouseUpHandler);
    }
    
    handleTouch(event) {
        if (!this.visible) return;
        event.preventDefault();
        const rect = this.game.canvas.getBoundingClientRect();
        const touch = event.touches[0];
        const touchX = (touch.clientX - rect.left) * (this.game.canvas.width / rect.width);
        const touchY = (touch.clientY - rect.top) * (this.game.canvas.height / rect.height);
        
        // Handle input field touch
        if (this.isPointInRect(touchX, touchY, this.nameField)) {
            this.nameField.focused = true;
            this.nextGameField.focused = false;
        } 
        // Handle next game ideas field touch
        else if (this.isPointInRect(touchX, touchY, this.nextGameField)) {
            this.nextGameField.focused = true;
            this.nameField.focused = false;
        }
        else {
            this.nameField.focused = false;
            this.nextGameField.focused = false;
        }
        
        // Handle enjoyment slider touch
        if (this.isPointInRect(touchX, touchY, this.enjoymentSlider)) {
            const sliderValue = this.getSliderValue(touchX, this.enjoymentSlider);
            this.enjoymentSlider.value = sliderValue;
            this.formData.enjoyment = sliderValue;
        }
        
        // Handle difficulty slider touch
        if (this.isPointInRect(touchX, touchY, this.difficultySlider)) {
            const sliderValue = this.getSliderValue(touchX, this.difficultySlider);
            this.difficultySlider.value = sliderValue;
            this.formData.difficulty = sliderValue;
        }
        
        // Handle submit button touch
        if (this.isPointInRect(touchX, touchY, this.submitButton) && this.nameField.text.trim() !== '') {
            this.submitForm();
        }
    }
    
    handleKey(event) {
        if (!this.visible) return;
        
        let activeField = null;
        if (this.nameField.focused) {
            activeField = this.nameField;
        } else if (this.nextGameField.focused) {
            activeField = this.nextGameField;
        }
        
        if (!activeField) return;
        
        if (event.key.length === 1) {
            // Add character to field
            const maxLength = activeField === this.nameField ? 20 : 100; // Longer for next game ideas
            if (activeField.text.length < maxLength) {
                activeField.text += event.key;
                if (activeField === this.nameField) {
                    this.formData.name = activeField.text;
                } else if (activeField === this.nextGameField) {
                    this.formData.nextGameIdeas = activeField.text;
                }
            }
        } else if (event.key === 'Backspace') {
            // Remove last character
            activeField.text = activeField.text.slice(0, -1);
            if (activeField === this.nameField) {
                this.formData.name = activeField.text;
            } else if (activeField === this.nextGameField) {
                this.formData.nextGameIdeas = activeField.text;
            }
        } else if (event.key === 'Enter') {
            // For next game field, add a line break on Shift+Enter
            if (event.shiftKey && activeField === this.nextGameField) {
                if (activeField.text.length < 90) { // Ensure we don't exceed max length
                    activeField.text += '\n';
                    this.formData.nextGameIdeas = activeField.text;
                }
            } 
            // Submit form if name is not empty
            else if (this.nameField.text.trim() !== '') {
                this.submitForm();
            }
        } else if (event.key === 'Tab') {
            // Toggle between input fields
            event.preventDefault();
            if (this.nameField.focused) {
                this.nameField.focused = false;
                this.nextGameField.focused = true;
            } else if (this.nextGameField.focused) {
                this.nextGameField.focused = false;
                this.nameField.focused = true;
            }
        }
    }
    
    isPointInRect(x, y, rect) {
        return x >= rect.x && x <= rect.x + rect.width &&
               y >= rect.y && y <= rect.y + rect.height;
    }
    
    async submitForm() {
        if (this.formData.submitted) return;
        
        try {
            console.log('Submitting form data:', this.formData);
            
            // Save user data
            const userResult = await saveUser(this.formData.name);
            
            // Save form submission data
            const formResult = await saveFormSubmission({
                name: this.formData.name,
                enjoyment_rating: this.formData.enjoyment,
                difficulty_rating: this.formData.difficulty,
                next_game_ideas: this.formData.nextGameIdeas
            });
            
            if (userResult.data && formResult.data) {
                console.log('Form submitted successfully');
                this.formData.submitted = true;
                
                // Show success message or return to menu after short delay
                setTimeout(() => {
                    this.game.victoryScreen.showButtons();
                }, 1500);
            } else {
                console.error('Error submitting form:', userResult.error || formResult.error);
            }
        } catch (error) {
            console.error('Error in form submission:', error);
        }
    }
    
    show() {
        this.visible = true;
        this.startTime = Date.now();
    }
    
    hide() {
        this.visible = false;
    }
    
    render(ctx) {
        if (!this.visible) return;
        
        // Fade-in effect
        const elapsedTime = Date.now() - this.startTime;
        const fadeIn = Math.min(1, elapsedTime / 500);
        
        // Draw semi-transparent background
        ctx.save();
        ctx.fillStyle = `rgba(0, 0, 0, ${0.7 * fadeIn})`;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Draw form panel with pixel art style
        ctx.fillStyle = `rgba(50, 50, 50, ${fadeIn})`;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw panel border
        this.drawPixelBorder(ctx, this.x, this.y, this.width, this.height, '#9c7b4a');
        
        // Draw form title
        ctx.fillStyle = '#ffcc00';
        ctx.font = '24px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME FEEDBACK', CANVAS_WIDTH / 2, this.y + 40);
        
        // Draw name field
        ctx.fillStyle = this.nameField.focused ? '#ffffff' : '#dddddd';
        ctx.fillRect(this.nameField.x, this.nameField.y, this.nameField.width, this.nameField.height);
        ctx.fillStyle = '#222222';
        ctx.font = '16px "Press Start 2P", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('Your Name:', this.nameField.x, this.nameField.y - 10);
        ctx.fillText(this.nameField.text || (this.nameField.focused ? '|' : 'Click to type...'), 
                     this.nameField.x + 10, this.nameField.y + 20);
        
        // Draw enjoyment rating slider
        ctx.fillStyle = '#222222';
        ctx.font = '14px "Press Start 2P", monospace';
        ctx.fillText('How much did you enjoy the game? (1-10)', this.enjoymentSlider.x, this.enjoymentSlider.y - 10);
        
        // Draw slider track
        ctx.fillStyle = '#666666';
        ctx.fillRect(this.enjoymentSlider.x, this.enjoymentSlider.y, this.enjoymentSlider.width, this.enjoymentSlider.height);
        
        // Draw slider value
        const enjoymentHandlePosition = ((this.enjoymentSlider.value - this.enjoymentSlider.min) / 
                                (this.enjoymentSlider.max - this.enjoymentSlider.min)) * this.enjoymentSlider.width;
        
        // Draw slider fill
        ctx.fillStyle = this.getEnjoymentColor(this.enjoymentSlider.value);
        ctx.fillRect(this.enjoymentSlider.x, this.enjoymentSlider.y, enjoymentHandlePosition, this.enjoymentSlider.height);
        
        // Draw slider handle
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.enjoymentSlider.x + enjoymentHandlePosition - 5, 
                     this.enjoymentSlider.y - 5, 10, this.enjoymentSlider.height + 10);
        
        // Draw slider value text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(this.enjoymentSlider.value.toString(), 
                     this.enjoymentSlider.x + this.enjoymentSlider.width + 25, 
                     this.enjoymentSlider.y + this.enjoymentSlider.height / 2 + 5);
        
        // Draw difficulty rating slider
        ctx.fillStyle = '#222222';
        ctx.font = '14px "Press Start 2P", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('How difficult was the game? (1-10)', this.difficultySlider.x, this.difficultySlider.y - 10);
        
        // Draw slider track
        ctx.fillStyle = '#666666';
        ctx.fillRect(this.difficultySlider.x, this.difficultySlider.y, this.difficultySlider.width, this.difficultySlider.height);
        
        // Draw slider value
        const difficultyHandlePosition = ((this.difficultySlider.value - this.difficultySlider.min) / 
                                 (this.difficultySlider.max - this.difficultySlider.min)) * this.difficultySlider.width;
        
        // Draw slider fill
        ctx.fillStyle = this.getDifficultyColor(this.difficultySlider.value);
        ctx.fillRect(this.difficultySlider.x, this.difficultySlider.y, difficultyHandlePosition, this.difficultySlider.height);
        
        // Draw slider handle
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.difficultySlider.x + difficultyHandlePosition - 5, 
                     this.difficultySlider.y - 5, 10, this.difficultySlider.height + 10);
        
        // Draw slider value text
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(this.difficultySlider.value.toString(), 
                     this.difficultySlider.x + this.difficultySlider.width + 25, 
                     this.difficultySlider.y + this.difficultySlider.height / 2 + 5);
        
        // Draw next game ideas field
        ctx.fillStyle = this.nextGameField.focused ? '#ffffff' : '#dddddd';
        ctx.fillRect(this.nextGameField.x, this.nextGameField.y, this.nextGameField.width, this.nextGameField.height);
        ctx.fillStyle = '#222222';
        ctx.font = '16px "Press Start 2P", monospace';
        ctx.textAlign = 'left';
        ctx.fillText('What would you like in the next game?', this.nextGameField.x, this.nextGameField.y - 10);
        
        // Handle text wrapping for next game ideas
        if (this.nextGameField.text || this.nextGameField.focused) {
            ctx.font = '14px "Press Start 2P", monospace';
            const maxWidth = this.nextGameField.width - 20;
            const lineHeight = 18;
            const words = (this.nextGameField.text || (this.nextGameField.focused ? '|' : 'Click to type...')).split(' ');
            let line = '';
            let y = this.nextGameField.y + 20;
            
            for (let i = 0; i < words.length; i++) {
                const testLine = line + words[i] + ' ';
                const metrics = ctx.measureText(testLine);
                
                if (metrics.width > maxWidth && i > 0) {
                    ctx.fillText(line, this.nextGameField.x + 10, y);
                    line = words[i] + ' ';
                    y += lineHeight;
                    
                    // Check if we need to stop rendering due to field height
                    if (y > this.nextGameField.y + this.nextGameField.height - 10) {
                        break;
                    }
                } else {
                    line = testLine;
                }
            }
            
            ctx.fillText(line, this.nextGameField.x + 10, y);
        } else {
            ctx.fillText('Click to type...', this.nextGameField.x + 10, this.nextGameField.y + 20);
        }
        
        // Draw submit button if not submitted
        if (!this.formData.submitted) {
            // Button background
            ctx.fillStyle = this.submitButton.hovered ? '#ffaa22' : '#cc8800';
            ctx.fillRect(this.submitButton.x, this.submitButton.y, this.submitButton.width, this.submitButton.height);
            
            // Button border
            this.drawPixelBorder(ctx, this.submitButton.x, this.submitButton.y, 
                            this.submitButton.width, this.submitButton.height, '#ffcc33');
            
            // Button text
            ctx.fillStyle = '#ffffff';
            ctx.font = '18px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.submitButton.text, 
                       this.submitButton.x + this.submitButton.width / 2, 
                       this.submitButton.y + this.submitButton.height / 2);
            
            // Draw prompt text if name is empty
            if (this.nameField.text.trim() === '') {
                ctx.fillStyle = '#ff6666';
                ctx.font = '12px "Press Start 2P", monospace';
                ctx.fillText('Please enter your name', 
                           this.submitButton.x + this.submitButton.width / 2, 
                           this.submitButton.y + this.submitButton.height + 15);
            }
        } else {
            // Draw success message if form submitted
            ctx.fillStyle = '#66ff66';
            ctx.font = '18px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Thanks for your feedback!', 
                       CANVAS_WIDTH / 2, 
                       this.submitButton.y + this.submitButton.height / 2);
        }
        
        ctx.restore();
    }
    
    getEnjoymentColor(value) {
        // Color gradient from red (1) to green (10)
        if (value <= 3) return '#ff6666'; // Red for low ratings
        if (value <= 6) return '#ffaa22'; // Orange/yellow for medium ratings
        return '#66bb66'; // Green for high ratings
    }
    
    getDifficultyColor(value) {
        // Color gradient from green (1 - easy) to red (10 - hard)
        if (value <= 3) return '#66bb66'; // Green for easy
        if (value <= 6) return '#ffaa22'; // Orange/yellow for medium
        return '#ff6666'; // Red for hard
    }
    
    drawPixelBorder(ctx, x, y, width, height, color) {
        const borderWidth = 2;
        ctx.fillStyle = color;
        
        // Top border
        ctx.fillRect(x - borderWidth, y - borderWidth, width + borderWidth * 2, borderWidth);
        
        // Bottom border
        ctx.fillRect(x - borderWidth, y + height, width + borderWidth * 2, borderWidth);
        
        // Left border
        ctx.fillRect(x - borderWidth, y, borderWidth, height);
        
        // Right border
        ctx.fillRect(x + width, y, borderWidth, height);
        
        // Pixel corners (for that retro look)
        ctx.fillRect(x - borderWidth - 1, y - borderWidth - 1, borderWidth, borderWidth); // Top-left
        ctx.fillRect(x + width + 1, y - borderWidth - 1, borderWidth, borderWidth); // Top-right
        ctx.fillRect(x - borderWidth - 1, y + height + 1, borderWidth, borderWidth); // Bottom-left
        ctx.fillRect(x + width + 1, y + height + 1, borderWidth, borderWidth); // Bottom-right
    }
}

export default FeedbackForm; 