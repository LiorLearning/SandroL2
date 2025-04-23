import { saveFormSubmission, saveUser } from './supabaseClient.js';

class FeedbackForm {
    constructor(game) {
        this.game = game;
        this.visible = false;
        this.overlay = null;
        this.formContainer = null;
        this.formData = {
            chapterName: '',
            villain: '',
            newCharacter: '',
            location: '',
            submitted: false
        };
        
        this.createFormElements();
    }
    
    createFormElements() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'feedback-overlay';
        this.overlay.style.position = 'fixed';
        this.overlay.style.top = '0';
        this.overlay.style.left = '0';
        this.overlay.style.width = '100%';
        this.overlay.style.height = '100%';
        this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.overlay.style.display = 'none';
        this.overlay.style.zIndex = '1000';
        this.overlay.style.justifyContent = 'center';
        this.overlay.style.alignItems = 'center';
        
        // Create form container
        this.formContainer = document.createElement('div');
        this.formContainer.className = 'feedback-form';
        this.formContainer.style.width = '600px';
        this.formContainer.style.backgroundColor = '#333';
        this.formContainer.style.borderRadius = '10px';
        this.formContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.5)';
        this.formContainer.style.padding = '20px';
        this.formContainer.style.color = '#fff';
        this.formContainer.style.fontFamily = '"Press Start 2P", monospace';
        
        // Create form title
        const title = document.createElement('h2');
        title.textContent = '🎮 Next-Level Creation Console: Activated';
        title.style.textAlign = 'center';
        title.style.color = '#ffcc00';
        title.style.marginBottom = '20px';
        title.style.fontSize = '18px';
        
        // Chapter name field
        const chapterLabel = document.createElement('label');
        chapterLabel.textContent = '📛 What should we call this next chapter?';
        chapterLabel.style.display = 'block';
        chapterLabel.style.marginTop = '15px';
        chapterLabel.style.fontSize = '14px';
        
        const chapterInput = document.createElement('input');
        chapterInput.type = 'text';
        chapterInput.id = 'chapter-name';
        chapterInput.style.width = '100%';
        chapterInput.style.padding = '10px';
        chapterInput.style.marginTop = '5px';
        chapterInput.style.marginBottom = '15px';
        chapterInput.style.backgroundColor = '#444';
        chapterInput.style.color = '#fff';
        chapterInput.style.border = '2px solid #666';
        chapterInput.style.borderRadius = '5px';
        chapterInput.style.fontFamily = 'inherit';
        chapterInput.addEventListener('input', (e) => {
            this.formData.chapterName = e.target.value;
        });
        
        // Villain field
        const villainLabel = document.createElement('label');
        villainLabel.textContent = '👾 Who\'s the next villain or ultimate enemy?';
        villainLabel.style.display = 'block';
        villainLabel.style.marginTop = '15px';
        villainLabel.style.fontSize = '14px';
        
        const villainInput = document.createElement('input');
        villainInput.type = 'text';
        villainInput.id = 'villain';
        villainInput.style.width = '100%';
        villainInput.style.padding = '10px';
        villainInput.style.marginTop = '5px';
        villainInput.style.marginBottom = '15px';
        villainInput.style.backgroundColor = '#444';
        villainInput.style.color = '#fff';
        villainInput.style.border = '2px solid #666';
        villainInput.style.borderRadius = '5px';
        villainInput.style.fontFamily = 'inherit';
        villainInput.addEventListener('input', (e) => {
            this.formData.villain = e.target.value;
        });
        
        // New character field
        const characterLabel = document.createElement('label');
        characterLabel.textContent = '🧬 Any new ally or character unlocked in this level?';
        characterLabel.style.display = 'block';
        characterLabel.style.marginTop = '15px';
        characterLabel.style.fontSize = '14px';
        
        const characterInput = document.createElement('input');
        characterInput.type = 'text';
        characterInput.id = 'character';
        characterInput.style.width = '100%';
        characterInput.style.padding = '10px';
        characterInput.style.marginTop = '5px';
        characterInput.style.marginBottom = '15px';
        characterInput.style.backgroundColor = '#444';
        characterInput.style.color = '#fff';
        characterInput.style.border = '2px solid #666';
        characterInput.style.borderRadius = '5px';
        characterInput.style.fontFamily = 'inherit';
        characterInput.addEventListener('input', (e) => {
            this.formData.newCharacter = e.target.value;
        });
        
        // Location field
        const locationLabel = document.createElement('label');
        locationLabel.textContent = '🌍 Where does this level take place?';
        locationLabel.style.display = 'block';
        locationLabel.style.marginTop = '15px';
        locationLabel.style.fontSize = '14px';
        
        const locationInput = document.createElement('input');
        locationInput.type = 'text';
        locationInput.id = 'location';
        locationInput.style.width = '100%';
        locationInput.style.padding = '10px';
        locationInput.style.marginTop = '5px';
        locationInput.style.marginBottom = '25px';
        locationInput.style.backgroundColor = '#444';
        locationInput.style.color = '#fff';
        locationInput.style.border = '2px solid #666';
        locationInput.style.borderRadius = '5px';
        locationInput.style.fontFamily = 'inherit';
        locationInput.addEventListener('input', (e) => {
            this.formData.location = e.target.value;
        });
        
        // Buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.justifyContent = 'space-between';
        buttonsContainer.style.marginTop = '20px';
        
        // Play Again button
        const playAgainButton = document.createElement('button');
        playAgainButton.textContent = 'Play Again';
        playAgainButton.style.padding = '12px 20px';
        playAgainButton.style.backgroundColor = '#4a6fa5';
        playAgainButton.style.color = '#fff';
        playAgainButton.style.border = 'none';
        playAgainButton.style.borderRadius = '5px';
        playAgainButton.style.cursor = 'pointer';
        playAgainButton.style.fontFamily = 'inherit';
        playAgainButton.style.fontSize = '14px';
        playAgainButton.addEventListener('click', () => {
            this.hide();
            this.submitForm('play_again');
        });
        
        // Create Next Level button
        const createLevelButton = document.createElement('button');
        createLevelButton.textContent = 'Create Next Level';
        createLevelButton.style.padding = '12px 20px';
        createLevelButton.style.backgroundColor = '#6ab04c';
        createLevelButton.style.color = '#fff';
        createLevelButton.style.border = 'none';
        createLevelButton.style.borderRadius = '5px';
        createLevelButton.style.cursor = 'pointer';
        createLevelButton.style.fontFamily = 'inherit';
        createLevelButton.style.fontSize = '14px';
        createLevelButton.addEventListener('click', () => {
            this.hide();
            this.submitForm('create_next_level');
        });
        
        // Append all elements
        buttonsContainer.appendChild(playAgainButton);
        buttonsContainer.appendChild(createLevelButton);
        
        this.formContainer.appendChild(title);
        this.formContainer.appendChild(chapterLabel);
        this.formContainer.appendChild(chapterInput);
        this.formContainer.appendChild(villainLabel);
        this.formContainer.appendChild(villainInput);
        this.formContainer.appendChild(characterLabel);
        this.formContainer.appendChild(characterInput);
        this.formContainer.appendChild(locationLabel);
        this.formContainer.appendChild(locationInput);
        this.formContainer.appendChild(buttonsContainer);
        
        this.overlay.appendChild(this.formContainer);
        document.body.appendChild(this.overlay);
    }
    
    async submitForm(action) {
        if (this.formData.submitted) return;
        
        try {
            console.log('Submitting form data:', this.formData);
            
            // Create a username based on chapter name or default
            const username = this.formData.chapterName || 'Anonymous Player';
            
            // Save user data
            const userResult = await saveUser(username);
            
            // Save form submission data
            const formSubmission = {
                name: username,
                chapter_name: this.formData.chapterName,
                villain: this.formData.villain,
                new_character: this.formData.newCharacter,
                location: this.formData.location,
                action: action
            };
            
            const formResult = await saveFormSubmission(formSubmission);
            
            if (userResult.data && formResult.data) {
                console.log('Form submitted successfully');
                this.formData.submitted = true;
                
                // Handle action based on button clicked
                if (action === 'play_again') {
                    // Reset the game to play again
                    this.game.resetGame();
                } else if (action === 'create_next_level') {
                    // Show some confirmation or redirect to level creation
                    this.game.goToMainMenu();
                }
            } else {
                console.error('Error submitting form:', userResult.error || formResult.error);
            }
        } catch (error) {
            console.error('Error in form submission:', error);
        }
    }
    
    show() {
        this.visible = true;
        this.overlay.style.display = 'flex';
    }
    
    hide() {
        this.visible = false;
        this.overlay.style.display = 'none';
    }
    
    // This is left for compatibility with the game loop, but does nothing
    render(ctx) {
        // Nothing to render as we're using HTML elements
    }
    
    // Clean up when form is no longer needed
    destroy() {
        if (this.overlay && document.body.contains(this.overlay)) {
            document.body.removeChild(this.overlay);
        }
    }
}

export default FeedbackForm; 