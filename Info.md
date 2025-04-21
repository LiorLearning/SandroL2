# Sandro Minecraft Game - Level 3: The Eyes of Ender

## Project Structure

### Core Game Files
- `Game.js`: Main game engine handling game logic, rendering, and state management
- `Player.js`: Player character with movement, collision, and inventory systems
- `World.js`: World generation, terrain, and environment management
- `main.js`: Entry point that initializes the game

### Entities
- `Endermen.js`: Enderman enemy with movement and attack behaviors
- `Zombie.js`: Zombie enemy implementation
- `Platform.js`: Platform objects for player movement

### Game Mechanics
- `MiningSpot.js`: Interactive mining locations for resource collection
- `CraftingPanel.js`: UI for crafting items from collected resources
- `BootsCraftingPanel.js`: Specialized crafting panel for boots
- `QuizPanel.js`: Educational quiz component
- `QuestionPopup.js`: Popup interface for questions

### UI Components
- `WelcomeScreen.js`: Initial game screen with instructions
- `VictoryScreen.js`: End game screen displayed on winning
- `TouchControls.js`: Mobile touch interface controls
- `FloatingText.js`: Floating text for notifications
- `ChatManager.js`: In-game chat system

### Resource Management
- `ResourceManager.js`: Manages game resources and inventory
- `AssetLoader.js`: Loads game assets (images, sounds)
- `AudioManager.js`: Handles game audio and sound effects

### Utilities
- `constants.js`: Game constants and configuration
- `utils.js`: General utility functions
- `netherUtils.js`: Utilities specific to the Nether environment

### Assets
- `assets/level3/`: Contains game images including enderman and backgrounds

## Game Objective
- Defeat Endermen to collect Ender Pearls
- Collect items (Crossbow, Shield, Obsidian blocks)
- Open portal to the Nether fortress
- Defeat Blazes to collect Blaze Rods
- Craft Ender Eyes using Blaze Powder and Ender Pearls

## Recent Changes
- Fixed game background to use the correct filename `assets/level3/backgroud.png` (note the spelling)
