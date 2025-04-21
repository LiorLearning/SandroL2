import Player from './Player.js';
import World from './World.js';
import { CraftingPanel } from './CraftingPanel.js';
import TouchControls from './TouchControls.js';
import WelcomeScreen from './WelcomeScreen.js';
import VictoryScreen from './VictoryScreen.js';
import { AssetLoader } from './AssetLoader.js';
import { drawBasaltPillar } from './netherUtils.js';
import { AudioManager } from './AudioManager.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, GROUND_LEVEL, GAME_STATE, MINING_REQUIRED_CLICKS } from './constants.js';
import { FloatingText } from './FloatingText.js';
import QuizPanel from './QuizPanel.js';
// import Enderman from './Endermen.js';
import { ResourceManager } from './ResourceManager.js';
import Hammer from './Hammer.js';

function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
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
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var Game = /*#__PURE__*/ function() {
    "use strict";
    function Game(container) {
        _class_call_check(this, Game);
        this.container = container;
        this.canvas = null;
        this.ctx = null;
        this.player = null;
        this.world = null;
        this.welcome = null;
        this.victoryScreen = null;
        this.touchControls = null;
        this.craftingPanel = null;
        this.quizPanel = null;
        this.audioManager = null;
        this.gameState = GAME_STATE.WELCOME;
        this.initialized = false;
        this.isLoading = true;
        this.lastTimestamp = 0;
        this.floatingTexts = [];
        this.floatingTextClass = FloatingText;
        this.keyStates = {};
        this.cameraOffset = 0;
        this.screenShakeIntensity = 0;
        this.screenShakeTimer = 0;
        this.assetLoader = new AssetLoader();
        this.audioManager = new AudioManager();
        this.resourceManager = null; // Will be initialized later
        this.resourceRequirementsMet = false;
        this.resourceCompletionMessage = null;
        this._boundUpdate = this.update.bind(this);
        
        // Initialize Nether colors
        this._netherColors = {
            netherrack: '#5C1F1E',
            soulsand: '#836A5C',
            lava: '#FF4500',
            glow: '#FFA500'
        };

        // Initialize hammer array
        this.hammers = [];
        this.hammerCooldown = 0;
        this.hammerCooldownTime = 1500; // 1.5 seconds between hammer throws

        // Initialize
        this.initializeGame(container);
    }
    _create_class(Game, [
        {
            key: "initializeGame",
            value: function initializeGame(container) {
                var _this = this;
                return _async_to_generator(function() {
                    var ref;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _this.setupCanvas();
                                // Loading message while assets are loading
                                _this.ctx.fillStyle = '#333';
                                _this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                                _this.ctx.fillStyle = 'white';
                                _this.ctx.textAlign = 'center';
                                _this.ctx.font = '24px Arial';
                                _this.ctx.fillText('Loading game assets...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
                                // Initialize screen shake variables and background cache
                                Object.assign(_this, {
                                    screenShakeIntensity: 0,
                                    screenShakeTimer: 0,
                                    _backgroundInitialized: false,
                                    _skyPattern: null
                                });
                                return [
                                    4,
                                    Promise.all([
                                        _this.assetLoader.loadAllAssets(),
                                        _this.audioManager.loadAllSounds()
                                    ])
                                ];
                            case 1:
                                // Load assets in parallel for better performance
                                ref = _sliced_to_array.apply(void 0, [
                                    _state.sent(),
                                    1
                                ]), _this.assetsLoaded = ref[0], ref;
                                // Initialize game objects after assets are loaded
                                _this.resources = {
                                    sticks: 0,
                                    strings: 0,
                                    flint: 0,
                                    feather: 0,
                                    crossbow: 0,
                                    shield: 0,
                                    obsidian: 0,
                                    enderpearl: 0
                                };
                                
                                // Initialize resource manager
                                _this.resourceManager = new ResourceManager(_this);
                                
                                _this.world = new World(_this.assetLoader);
                                _this.player = new Player(100, GROUND_LEVEL);
                                _this.player.game = _this; // Add reference to game for asset access
                                
                                // Set the game reference on the world object for endermen updates
                                _this.world.game = _this;
                                
                                _this.craftingPanel = new CraftingPanel(_this.resourceManager.getResources(), _this);
                                _this.quizPanel = new QuizPanel(_this);
                                _this.floatingTexts = [];
                                
                                // Get platforms from world to place endermen on
                                const platforms = _this.world.platforms;
                                
                                // Initialize endermen as empty array - will populate when game starts
                                _this.endermen = [];
                                
                                _this.gameState = GAME_STATE.WELCOME; // Start with welcome screen
                                _this.isGameActive = false; // For backward compatibility
                                _this.setupControls();
                                _this.touchControls = new TouchControls(_this);
                                _this.welcomeScreen = new WelcomeScreen(_this, _this.assetLoader);
                                _this.victoryScreen = new VictoryScreen(_this);
                                _this.lastTimestamp = 0;
                                _this.isLoading = false;
                                _this.bowCrafted = false;
                                // Start game loop
                                requestAnimationFrame(_this.update.bind(_this));
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "setupCanvas",
            value: function setupCanvas() {
                var _this = this;
                var canvas = document.createElement('canvas');
                canvas.width = CANVAS_WIDTH;
                canvas.height = CANVAS_HEIGHT;
                Object.assign(canvas.style, {
                    display: 'block',
                    backgroundColor: '#87CEEB',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: '0',
                    left: '0'
                });
                var fullscreenButton = document.createElement('button');
                fullscreenButton.textContent = '⛶';
                Object.assign(fullscreenButton.style, {
                    position: 'absolute',
                    right: '10px',
                    top: '10px',
                    zIndex: '1000',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                });
                fullscreenButton.addEventListener('click', this.toggleFullscreen.bind(this));
                this.canvas = canvas;
                this.ctx = canvas.getContext('2d');
                this.fullscreenButton = fullscreenButton;
                this.container.append(canvas, fullscreenButton);
                window.addEventListener('resize', function() {
                    return _this.handleResize();
                });
                this.handleResize();
            }
        },
        {
            key: "handleResize",
            value: function handleResize() {
                // Get the current dimensions of the container/window
                var containerWidth = this.container.clientWidth || window.innerWidth;
                var containerHeight = this.container.clientHeight || window.innerHeight;
                // Calculate the aspect ratio
                var gameAspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;
                var containerAspectRatio = containerWidth / containerHeight;
                // Adjust canvas size while preserving aspect ratio
                if (containerAspectRatio > gameAspectRatio) {
                    // Container is wider than game
                    this.canvas.style.width = "".concat(containerHeight * gameAspectRatio, "px");
                    this.canvas.style.height = "".concat(containerHeight, "px");
                } else {
                    // Container is taller than game
                    this.canvas.style.width = "".concat(containerWidth, "px");
                    this.canvas.style.height = "".concat(containerWidth / gameAspectRatio, "px");
                }
            }
        },
        {
            key: "toggleFullscreen",
            value: function toggleFullscreen() {
                if (!document.fullscreenElement) {
                    // Enter fullscreen
                    if (this.container.requestFullscreen) {
                        this.container.requestFullscreen();
                    } else if (this.container.webkitRequestFullscreen) {
                        this.container.webkitRequestFullscreen();
                    } else if (this.container.msRequestFullscreen) {
                        this.container.msRequestFullscreen();
                    }
                    this.fullscreenButton.textContent = '⮌';
                } else {
                    // Exit fullscreen
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                    this.fullscreenButton.textContent = '⛶';
                }
            }
        },
        {
            key: "setupControls",
            value: function setupControls() {
                // Use bound handlers instead of creating new anonymous functions
                this._handleKeyDown = this._handleKeyDown.bind(this);
                this._handleKeyUp = this._handleKeyUp.bind(this);
                window.addEventListener('keydown', this._handleKeyDown);
                window.addEventListener('keyup', this._handleKeyUp);
            }
        },
        {
            // Unified key handler to reduce event listener overhead
            key: "_handleKeyDown",
            value: function _handleKeyDown(e) {
                // Use switch statement for more efficient key checking
                switch(e.key.toLowerCase()){
                    case 'arrowleft':
                    case 'a':
                        this.player.moveLeft();
                        break;
                    case 'arrowright':
                    case 'd':
                        this.player.moveRight();
                        break;
                    case ' ':
                    case 'arrowup':
                    case 'w':
                        this.player.jump();
                        break;
                    case 'e':
                        this.tryCollectResource();
                        break;
                }
            }
        },
        {
            key: "_handleKeyUp",
            value: function _handleKeyUp(e) {
                // Use switch statement for more efficient key checking
                switch(e.key.toLowerCase()){
                    case 'arrowleft':
                    case 'arrowright':
                    case 'a':
                    case 'd':
                        this.player.stop();
                        break;
                }
            }
        },
        {
            key: "tryCollectResource",
            value: function tryCollectResource() {
                // Check if we should throw the hammer instead
                if (this.tryThrowHammer()) {
                    return; // Hammer thrown, early exit
                }
                
                // First try mining (which now also handles resource collection)
                if (this.tryMining()) {
                    return; // Mining action was handled
                }
                
                // If no mining action was handled, try to collect regular resources
                // Check for nearby items to collect
                const playerBounds = this.player.getBounds();
                const collectionRange = 40; // Increased collection range
                
                // Expand player bounds for collection
                const collectionBounds = {
                    x: playerBounds.x - collectionRange/2,
                    y: playerBounds.y - collectionRange/2,
                    width: playerBounds.width + collectionRange,
                    height: playerBounds.height + collectionRange
                };
                
                // Check all items in the world
                let collectedItem = null;
                for (let i = 0; i < this.world.items.length; i++) {
                    const item = this.world.items[i];
                    
                    // Create item bounds
                    const itemBounds = {
                        x: item.x,
                        y: item.y,
                        width: item.width || 20,
                        height: item.height || 20
                    };
                    
                    // Check if item is within collection range
                    if (this.isColliding(collectionBounds, itemBounds)) {
                        collectedItem = item;
                        break;
                    }
                }
                
                if (!collectedItem) {
                    // Show message if no item found
                    this.floatingTexts.push(new FloatingText("Nothing to collect nearby", this.player.x, this.player.y - 20));
                    return;
                }

                const { type, x, y } = collectedItem;
                const amount = 1; // Standard amount for all resources
                
                // Show collection message
                this.floatingTexts.push(new FloatingText(`Collected ${type}!`, x, y - 20));
                
                // Add to resources through the resource manager
                this.resourceManager.addResource(type, amount);
                
                // Remove the item from the world
                this.world.removeItem(collectedItem);
                
                // Update crafting panel with resources from the resource manager 
                this.craftingPanel.updateResources(this.resourceManager.getResources());
                this.craftingPanel.highlightResource(type);
                
                // Create floating text
                this.floatingTexts.push(new FloatingText(`+${amount} ${type}`, x, y));
                
                // Play collection sound
                this.audioManager.play('collect', 0.7 * (0.9 + Math.random() * 0.2));
                
                // Check if all required resources have been collected
                this.checkResourceCompletion();
            }
        },
        {
            key: "tryMining",
            value: function tryMining() {
                // Cache player position and bounds for performance
                var player = this.player;
                var playerX = player.x;
                var playerBounds = player.getBounds();
                var miningCheckDistance = 100; // Only check mining spots within this distance
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    // Check if player is near any mining spots
                    for(var _iterator = this.world.miningSpots[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var miningSpot = _step.value;
                        if (!miningSpot.active) continue;
                        
                        // Broad phase - distance-based check to skip far away mining spots
                        if (Math.abs(miningSpot.x - playerX) > miningCheckDistance) continue;
                        
                        // Check if player is close enough to mine
                        var miningBounds = {
                            x: miningSpot.x - 20,
                            y: miningSpot.y - 20,
                            width: miningSpot.width + 40,
                            height: miningSpot.height + 40
                        };
                        
                        if (this.isColliding(playerBounds, miningBounds)) {
                            // If spot is already mined but resource not collected, show quiz and collect
                            if (miningSpot.mined && !miningSpot.resourceSpawned) {
                                // Show quiz for resource collection
                                this.gameState = GAME_STATE.QUIZ;
                                this.quizPanel.show(miningSpot); // Pass the mining spot to the quiz panel
                                this.floatingTexts.push(new FloatingText("Solve to collect!", miningSpot.x, miningSpot.y - 40));
                                // Play sound
                                this.audioManager.play('collect', 0.7);
                                return true; // Mining action handled
                            }
                            
                            // If not mined yet, process mining action
                            if (!miningSpot.mined) {
                                // Player is close to the mining spot, process mining action
                                var miningComplete = miningSpot.increaseClickCount();
                                // Play mining sound with different pitch based on progress
                                var pitchVariation = 0.8 + miningSpot.clickCount / MINING_REQUIRED_CLICKS * 0.4;
                                this.audioManager.play('hurt', 0.3 * pitchVariation); // Repurpose hurt sound for mining
                                // Add screen shake effect
                                this.applyScreenShake(3);
                                // Create floating text showing mining progress
                                var progressText = "Mining: ".concat(miningSpot.clickCount, "/").concat(MINING_REQUIRED_CLICKS);
                                this.floatingTexts.push(new FloatingText(progressText, miningSpot.x, miningSpot.y - 20));
                                
                                if (miningComplete) {
                                    // Mining is complete
                                    // Reset screen shake
                                    this.screenShakeIntensity = 0;
                                    this.screenShakeTimer = 0;
                                    
                                    // Handle specific resource types directly without quiz
                                    switch(miningSpot.type) {
                                        case 'crossbow':
                                        case 'shield':
                                        case 'obsidian':
                                        case 'gold nugget':
                                            // For special resources, prompt to press E again to collect
                                            this.floatingTexts.push(new FloatingText("Mining complete! Press E to collect", miningSpot.x, miningSpot.y - 40));
                                            break;
                                        default:
                                            // Same for all other resources
                                            this.floatingTexts.push(new FloatingText("Mining complete! Press E to collect", miningSpot.x, miningSpot.y - 40));
                                            break;
                                    }
                                    
                                    // Play completion sound
                                    this.audioManager.play('collect', 1.0);
                                }
                            }
                            return true; // Mining action handled
                        }
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
                
                return false; // No mining action was handled
            }
        },
        {
            // Add screen shake effect
            key: "applyScreenShake",
            value: function applyScreenShake(intensity) {
                this.screenShakeIntensity = intensity;
                this.screenShakeTimer = 200; // Duration in milliseconds
            }
        },
        {
            key: "isColliding",
            value: function isColliding(rect1, rect2) {
                return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y;
            }
        },
        {
            key: "tryThrowHammer",
            value: function tryThrowHammer() {
                // Don't throw if on cooldown
                if (this.hammerCooldown > 0) {
                    return false;
                }
                
                // Check if player is near any mining spots
                const playerX = this.player.x;
                const playerBounds = this.player.getBounds();
                const miningCheckDistance = 100;
                
                // Check if player is close to a mining spot (if yes, don't throw hammer)
                for (const miningSpot of this.world.miningSpots) {
                    if (!miningSpot.active) continue;
                    
                    // Skip far away mining spots
                    if (Math.abs(miningSpot.x - playerX) > miningCheckDistance) continue;
                    
                    // Check if player is close enough to mine
                    const miningBounds = {
                        x: miningSpot.x - 20,
                        y: miningSpot.y - 20,
                        width: miningSpot.width + 40,
                        height: miningSpot.height + 40
                    };
                    
                    if (this.isColliding(playerBounds, miningBounds)) {
                        return false; // Player is near mining spot, don't throw hammer
                    }
                }
                
                // Player is not near mining spot, throw hammer
                const playerDirection = this.player.direction;
                const hammerX = this.player.x + (playerDirection === 1 ? this.player.width : 0);
                const hammerY = this.player.y + this.player.height * 0.3; // Slightly above middle
                
                // Create a new hammer
                const hammer = new Hammer(hammerX, hammerY, playerDirection, this.assetLoader);
                hammer.initialX = hammerX; // Store initial position for distance calculation
                this.hammers.push(hammer);
                
                // Set cooldown
                this.hammerCooldown = this.hammerCooldownTime;
                
                // Play throw sound
                this.audioManager.play('collect', 1.2);
                
                // Apply screen shake
                this.applyScreenShake(2);
                
                // Show throwing message
                this.floatingTexts.push(new FloatingText("Hammer throw!", this.player.x, this.player.y - 20));
                
                return true; // Hammer was thrown
            }
        },
        {
            key: "updateHammers",
            value: function updateHammers(deltaTime) {
                // Update cooldown
                if (this.hammerCooldown > 0) {
                    this.hammerCooldown -= deltaTime;
                }
                
                // Update each hammer
                for (let i = this.hammers.length - 1; i >= 0; i--) {
                    const hammer = this.hammers[i];
                    hammer.update(deltaTime);
                    
                    // Check for collisions with endermen
                    let hitEnderman = false;
                    // Make sure we're using the endermen from the world object
                    const endermen = this.world.endermen;
                    for (let j = 0; j < endermen.length; j++) {
                        const enderman = endermen[j];
                        // Use simple collision detection directly here instead of relying on hammer's method
                        // Add debug info about enderman position
                        console.log(`Checking enderman at x:${enderman.x}, y:${enderman.y}, platform:${enderman.platform ? 'yes' : 'no'}`);
                        console.log(`Hammer at x:${hammer.x}, y:${hammer.y}`);
                        
                        const collision = (
                            hammer.x < enderman.x + enderman.width &&
                            hammer.x + hammer.width > enderman.x &&
                            hammer.y < enderman.y + enderman.height &&
                            hammer.y + hammer.height > enderman.y
                        );
                        
                        if (collision) {
                            console.log("Collision detected!");
                        }
                        
                        if (collision) {
                            hitEnderman = true;
                            
                            // Trigger hit effect on hammer
                            hammer.triggerHitEffect();
                            
                            // Deal 50 damage to the enderman
                            const damageAmount = 50;
                            const defeated = enderman.takeDamage(damageAmount);
                            
                            // Play hit sound
                            this.audioManager.play('hurt', 0.9);
                            
                            // Apply screen shake
                            this.applyScreenShake(4);
                            
                            // Show hit message
                            this.floatingTexts.push(new FloatingText("-50% Health!", hammer.x, hammer.y - 20));
                            
                            // If enderman is defeated, remove it and spawn enderpearl
                            if (defeated) {
                                // Remove enderman from the world's endermen array
                                this.world.endermen.splice(j, 1);
                                
                // Spawn enderpearl at the correct position (considering platform height)
                const spawnY = enderman.platform ? enderman.y + enderman.height : enderman.y;
                this.spawnEnderpearl(enderman.x, spawnY);
                                
                                // Add defeated message
                                this.floatingTexts.push(new FloatingText("Enderman defeated!", hammer.x, hammer.y - 40));
                            }
                            
                            // Break out of enderman loop
                            break;
                        }
                    }
                    
                    // Remove hammer if it hit something or is no longer active
                    if (hitEnderman || !hammer.active) {
                        this.hammers.splice(i, 1);
                    }
                }
            }
        },
        {
            key: "spawnEnderpearl",
            value: function spawnEnderpearl(x, y) {
                // Add an enderpearl item to the world at the position where the enderman was hit
                this.world.addItem({
                    type: 'enderpearl',
                    x: x,
                    y: y,
                    width: 20,
                    height: 20
                });
                
                // Show message about dropped item
                this.floatingTexts.push(new FloatingText("Ender Pearl dropped!", x, y - 40));
            }
        },
        {
            key: "update",
            value: function update(timestamp) {
                const deltaTime = timestamp - this.lastTimestamp;
                this.lastTimestamp = timestamp;

                // Early exit for invalid frames
                if (deltaTime <= 0) {
                    requestAnimationFrame(this._boundUpdate);
                    return;
                }

                // Batch state checks to minimize branching
                const isPlaying = this.gameState === GAME_STATE.PLAYING;
                const isQuiz = this.gameState === GAME_STATE.QUIZ;

                if (isPlaying) {
                    // Process game updates in logical order
                    this.world.updateEndermen(deltaTime);
                    this.world.updateMiningSpots(deltaTime);
                    this.player.update(deltaTime, this.world);
                    
                    // Update hammers
                    this.updateHammers(deltaTime);

                    // Camera and viewport updates
                    this.cameraOffset = Math.max(0, this.player.x - CANVAS_WIDTH * 0.25);
                    this.updateCameraForWorld();

                    // Update world embers
                    this.world._updateEmbers();

                    // Effects updates
                    if (this.screenShakeTimer > 0) {
                        this.screenShakeTimer -= deltaTime;
                    }

                    // Collision and interaction checks
                    const { quizTriggered } = this.world.checkPlatformCollisions(this.player);
                    if (quizTriggered) {
                        this.screenShakeIntensity = 0;
                        this.screenShakeTimer = 0;
                        this.gameState = GAME_STATE.QUIZ;
                        this.quizPanel.show();
                    }

                    // UI updates
                    this.touchControls.update();
                    this.updateFloatingTexts(deltaTime);

                    // Enderman collision check (only if player is not immune)
                    if (!this.player.isImmune) {
                        const collidedEnderman = this.world.checkEndermanCollisions(this.player);
                        if (collidedEnderman) {
                            this.handleEndermanCollision();
                        }
                        // Check for lava collision
                        if (this.checkLavaCollision()) {
                            this.handleLavaCollision();
                        }
                        
                        // Check for portal collision
                        if (this.portal && this.portal.active) {
                            this.checkPortalCollision();
                        }
                    }
                } else if (isQuiz) {
                    this.quizPanel.update(deltaTime);
                }

                // Render at consistent 60fps using timestamp delta
                if (deltaTime >= 16) {
                    this.render();
                }

                requestAnimationFrame(this._boundUpdate);
            }
        },
        {
            // Extracted floating text updates for better organization
            key: "updateFloatingTexts",
            value: function updateFloatingTexts(deltaTime) {
                for(var i = this.floatingTexts.length - 1; i >= 0; i--){
                    this.floatingTexts[i].update(deltaTime);
                    if (this.floatingTexts[i].isDone()) {
                        this.floatingTexts.splice(i, 1);
                    }
                }
            }
        },
        {
            key: "render",
            value: function render() {
                if (this.isLoading) return;

                // Batch clear and transform operations
                this.ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                // Apply screen shake with one condition check
                var shouldShake = this.screenShakeTimer > 0 && this.screenShakeIntensity > 0;
                if (shouldShake) {
                    var shake = this.screenShakeIntensity * 2;
                    this.ctx.save();
                    this.ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
                }
                // Nether background initialization
                if (!this._backgroundInitialized) {
                    // Nether-specific textures and colors
                    this._skyColor = '#1A1A1A'; // Dark nether void
                    this._groundColor = this._netherColors.netherrack;
                    this._soulSandColor = this._netherColors.soulsand;
                    this._lavaColor = this._netherColors.lava;
                    this._glowColor = this._netherColors.glow;
                    // Load background image
                    this._backgroundImage = this.assetLoader.getAsset('bg_Sandro');
                    // Initialize particles
                    this._initLavaParticles();
                    this._initFloatingEmbers();
                    this._backgroundInitialized = true;
                }
                // Draw background image if available, otherwise fallback to solid color
                if (this._backgroundImage) {
                    // Calculate scaling factors to fill canvas while preserving aspect ratio
                    var scale = Math.max(CANVAS_WIDTH / this._backgroundImage.width, CANVAS_HEIGHT / this._backgroundImage.height);
                    var scaledWidth = this._backgroundImage.width * scale;
                    var scaledHeight = this._backgroundImage.height * scale;
                    // Center the background image
                    var offsetX = (CANVAS_WIDTH - scaledWidth) / 2;
                    var offsetY = (CANVAS_HEIGHT - scaledHeight) / 2;
                    // Apply dark overlay for better foreground visibility
                    this.ctx.save();
                    this.ctx.drawImage(this._backgroundImage, offsetX, offsetY, scaledWidth, scaledHeight);
                    // More subtle overlay that preserves background visibility
                    var overlayGradient = this.ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
                    overlayGradient.addColorStop(0, 'rgba(10, 0, 15, 0.2)');
                    overlayGradient.addColorStop(0.6, 'rgba(15, 0, 10, 0.3)');
                    this.ctx.fillStyle = overlayGradient;
                    this.ctx.globalCompositeOperation = 'multiply';
                    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                    this.ctx.globalCompositeOperation = 'source-over';
                    // Add ambient lighting to balance visuals
                    var lightingGradient = this.ctx.createRadialGradient(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 0, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, CANVAS_WIDTH);
                    lightingGradient.addColorStop(0, 'rgba(80, 40, 40, 0.1)');
                    lightingGradient.addColorStop(1, 'rgba(40, 20, 40, 0.05)');
                    this.ctx.fillStyle = lightingGradient;
                    this.ctx.globalCompositeOperation = 'lighter';
                    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                    this.ctx.globalCompositeOperation = 'source-over';
                    this.ctx.restore();
                } else {
                    // Fallback to solid color with gradient
                    var gradient = this.ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
                    gradient.addColorStop(0, '#0A0A1A');
                    gradient.addColorStop(1, '#1A0010');
                    this.ctx.fillStyle = gradient;
                    this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                }
                // Draw netherrack ground with cracks and glow
                this.ctx.fillStyle = this._groundColor;
                this.ctx.fillRect(0, GROUND_LEVEL + 30, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_LEVEL - 30);
                this._drawNetherrackCracks();
                // Add subtle glow to netherrack
                var glowGradient = this.ctx.createLinearGradient(0, 0, 0, GROUND_LEVEL + 60);
                glowGradient.addColorStop(0, 'rgba(255, 100, 0, 0.1)');
                glowGradient.addColorStop(1, 'transparent');
                this.ctx.fillStyle = glowGradient;
                this.ctx.globalCompositeOperation = 'lighter';
                this.ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_LEVEL + 60);
                this.ctx.globalCompositeOperation = 'source-over';
                // Draw soul sand patches
                this._drawSoulSandPatches();
                // Draw basalt pillars
                this._drawBasaltPillars();
                // Draw gold blocks
                this._drawGoldBlocks();
                // Render world embers in world space
                this.ctx.save();
                this.ctx.translate(-this.cameraOffset, 0);
                this.world._renderEmbers(this.ctx);
                this.ctx.restore();
                // Update and render floating embers
                this._updateEmbers();
                this._renderEmbers();
                // Render world embers in world space
                this.ctx.save();
                this.ctx.translate(-this.cameraOffset, 0);
                this.world._renderEmbers(this.ctx);
                this.ctx.restore();
                if (this.gameState === GAME_STATE.WELCOME) {
                    // Game is not active, render welcome screen
                    this.welcomeScreen.render(this.ctx);
                } else if (this.gameState === GAME_STATE.VICTORY) {
                    // Render victory screen
                    this.victoryScreen.render(this.ctx);
                } else if (this.gameState === GAME_STATE.PLAYING || this.gameState === GAME_STATE.QUIZ) {
                    // Game is active, render game elements
                    this.world.render(this.ctx);
                    // Render player at its position relative to camera
                    var playerScreenX = this.player.x - this.cameraOffset;
                    this.player.render(this.ctx, playerScreenX);
                    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                    try {
                        // Render floating texts
                        for(var _iterator = this.floatingTexts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                            var text = _step.value;
                            text.render(this.ctx, this.cameraOffset);
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
                    this.craftingPanel.render(this.ctx);
                    // Render touch controls on top
                    this.touchControls.render(this.ctx);
                    // If in quiz mode, render the quiz UI
                    if (this.gameState === GAME_STATE.QUIZ) {
                        this.quizPanel.render(this.ctx);
                    }
                    // Render enderman speed info in the top left corner
                    this.renderEndermanSpeed();
                }
                // Game state specific rendering
                switch(this.gameState){
                    case GAME_STATE.PLAYING:
                        this.renderControlInstructions();
                        break;
                    case GAME_STATE.WELCOME:
                        this.welcomeScreen.render(this.ctx);
                        break;
                    case GAME_STATE.VICTORY:
                        this.victoryScreen.render(this.ctx);
                        break;
                    case GAME_STATE.CRAFTING:
                        this.ctx.save();
                        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
                        this.ctx.restore();
                        break;
                }
                
                // Render the portal if it exists
                if (this.portal && this.portal.active) {
                    this.renderPortal();
                }
                
                // Reset transformations if screen was shaking
                if (shouldShake) {
                    this.ctx.restore();
                }

                // We don't need to render endermen here since they're already rendered in world.render()

                // Render hammers
                this.hammers.forEach(hammer => {
                    hammer.render(this.ctx, this.cameraOffset);
                });
            }
        },
        {
            // Update camera offset before rendering
            key: "updateCameraForWorld",
            value: function updateCameraForWorld() {
                if (this.world) {
                    this.world.setCameraOffset(this.cameraOffset);
                }
            }
        },
        {
            key: "renderDebugInfo",
            value: function renderDebugInfo() {
            // Method intentionally left empty - debug info is not needed in production
            }
        },
        {
            key: "renderEndermanSpeed",
            value: function renderEndermanSpeed() {
                // Display enderman speed in top left corner
                const baseSpeed = 0.5;
                let currentSpeed = baseSpeed;
                
                // Get resources from resource manager
                const resources = this.resourceManager.getResources();
                
                // Calculate current speed based on enderpearls collected
                if (resources && resources.enderpearl !== undefined) {
                    const enderpearlsCollected = resources.enderpearl;
                    const speedIncreases = Math.floor(enderpearlsCollected / 2);
                    currentSpeed = Math.min(baseSpeed + speedIncreases * 0.1, 1.2);
                }
                
                // Draw background box
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(10, 10, 170, 30);
                this.ctx.strokeStyle = '#AA55FF'; // Purple for enderman
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(10, 10, 170, 30);
                
                // Draw text
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.font = '16px Arial';
                this.ctx.textAlign = 'left';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(`Enderman Speed: ${currentSpeed.toFixed(1)}`, 20, 25);
            }
        },
        {
            key: "renderControlInstructions",
            value: function renderControlInstructions() {
                // Don't show on mobile as they already have touch controls
                if (this.touchControls.isMobile) return;
                // Semi-transparent background
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                this.ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH - this.craftingPanel.width, 50);
                // Panel title
                this.ctx.fillStyle = '#FFCC33'; // Gold/yellow Minecraft title color
                this.ctx.font = 'bold 14px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('CONTROLS', (CANVAS_WIDTH - this.craftingPanel.width) / 2, CANVAS_HEIGHT - 40);
                // Control instructions text
                this.ctx.fillStyle = 'white';
                this.ctx.font = '14px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('← → or A/D: Move | ↑ or W or SPACE: Jump | E: Mine/Collect', (CANVAS_WIDTH - this.craftingPanel.width) / 2, CANVAS_HEIGHT - 20);
            }
        },
        {
            key: "start",
            value: function start() {
            // Game initialization is now handled in initializeGame
            // This method is kept for backward compatibility
            }
        },
        {
            key: "handleEndermanCollision",
            value: function handleEndermanCollision() {
                if (this.player.isImmune) return; // Skip if player is already immune
                
                // Take damage
                this.player.takeDamage(1);
                
                // Apply knockback in opposite direction to enderman
                this.player.velocityX = this.player.x > this.cameraOffset + CANVAS_WIDTH / 2 ? -5 : 5;
                this.player.velocityY = -5; // Add upward velocity (jump)
                
                // Make player immune for 1 second
                this.player.makeImmune(1000);
                
                // Apply screen shake
                this.applyScreenShake(5);
                
                // Show damage text
                const floatingText = new FloatingText(
                    'Ouch!',
                    this.player.x + this.player.width / 2, 
                    this.player.y - 20,
                );
                this.floatingTexts.push(floatingText);
                
                // Play hurt sound
                this.audioManager.play('hurt', 0.6);
                
                // Check if player is out of health
                if (this.player.health <= 0) {
                    // Reset player position
                    this.player.x = 100;
                    this.player.y = 300;
                    this.player.health = 5;
                    
                    // Show game over text
                    const gameOverText = new FloatingText(
                        'Game Over - Try Again!',
                        CANVAS_WIDTH / 2,
                        CANVAS_HEIGHT / 2
                    );
                    this.floatingTexts.push(gameOverText);
                }
            }
        },
        {
            key: "_initLavaParticles",
            value: function _initLavaParticles() {
                // Create initial pool of lava particles
                this._lavaParticles = Array.from({
                    length: 30
                }, function() {
                    return {
                        x: Math.random() * CANVAS_WIDTH,
                        y: GROUND_LEVEL + 25,
                        size: 2 + Math.random() * 3,
                        speed: 0.5 + Math.random() * 1.5,
                        life: 100 + Math.random() * 100
                    };
                });
            }
        },
        {
            key: "_drawAnimatedLavaSection",
            value: function _drawAnimatedLavaSection(x, y, width, height, time) {
                // Save current transform
                this.ctx.save();
                // Apply camera offset to keep lava fixed in world space
                this.ctx.translate(-this.cameraOffset, 0);
                // Base lava color
                this.ctx.fillStyle = this._lavaColor;
                this.ctx.fillRect(x, y, width, height);
                // Animated lava surface effect
                var waveHeight = 2;
                var segmentWidth = 20;
                this.ctx.beginPath();
                this.ctx.moveTo(x, y);
                // Create wavy lava surface
                for(var segX = x; segX <= x + width; segX += segmentWidth){
                    var progress = (segX - x) / width;
                    var waveOffset = Math.sin(time * 2 + progress * Math.PI * 4) * waveHeight;
                    this.ctx.lineTo(segX, y + waveOffset);
                }
                this.ctx.lineTo(x + width, y + height);
                this.ctx.lineTo(x, y + height);
                this.ctx.closePath();
                // Add glowing lava effect
                var lavaGradient = this.ctx.createLinearGradient(0, y, 0, y + height);
                lavaGradient.addColorStop(0, '#FF8C00');
                lavaGradient.addColorStop(0.5, '#FF4500');
                lavaGradient.addColorStop(1, '#8B0000');
                this.ctx.fillStyle = lavaGradient;
                this.ctx.globalCompositeOperation = 'lighter';
                this.ctx.fill();
                this.ctx.globalCompositeOperation = 'source-over';
                // Restore transform
                this.ctx.restore();
            }
        },
        {
            key: "_initFloatingEmbers",
            value: function _initFloatingEmbers() {
                // Create initial pool of floating ember particles
                this._floatingEmbers = Array.from({
                    length: 20
                }, function() {
                    return {
                        x: Math.random() * CANVAS_WIDTH,
                        y: Math.random() * CANVAS_HEIGHT * 0.7,
                        size: 1 + Math.random() * 2,
                        speedX: -0.5 + Math.random(),
                        speedY: -0.2 - Math.random() * 0.5,
                        life: 200 + Math.random() * 200
                    };
                });
            }
        },
        {
            key: "_drawNetherrackCracks",
            value: function _drawNetherrackCracks() {
                // Draw cracks on netherrack ground
                this.ctx.strokeStyle = '#4A2A2A';
                this.ctx.lineWidth = 1;
                for(var i = 0; i < 15; i++){
                    var x = Math.random() * CANVAS_WIDTH;
                    var y = GROUND_LEVEL + 30 + Math.random() * 5;
                    var length = 5 + Math.random() * 15;
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, y);
                    this.ctx.lineTo(x + (Math.random() - 0.5) * 10, y + length);
                    this.ctx.stroke();
                }
            }
        },
        {
            key: "_drawSoulSandPatches",
            value: function _drawSoulSandPatches() {
                // Draw soul sand patches with glow effect
                this.ctx.fillStyle = this._soulSandColor;
                this.ctx.beginPath();
                // Patch 1
                this.ctx.rect(150, GROUND_LEVEL + 30, 80, 15);
                // Patch 2
                this.ctx.rect(400, GROUND_LEVEL + 30, 120, 15);
                this.ctx.fill();
                // Add subtle glow to soul sand
                var glowGradient = this.ctx.createLinearGradient(0, 0, 0, 20);
                glowGradient.addColorStop(0, 'rgba(255, 127, 80, 0.2)');
                glowGradient.addColorStop(1, 'transparent');
                this.ctx.fillStyle = glowGradient;
                this.ctx.globalCompositeOperation = 'lighter';
                this.ctx.fillRect(150, GROUND_LEVEL + 30, 80, 15);
                this.ctx.fillRect(400, GROUND_LEVEL + 30, 120, 15);
                this.ctx.globalCompositeOperation = 'source-over';
            }
        },
        {
            key: "_updateEmbers",
            value: function _updateEmbers() {
                for(var i = this._floatingEmbers.length - 1; i >= 0; i--){
                    var ember = this._floatingEmbers[i];
                    // Update position
                    ember.x += ember.speedX;
                    ember.y += ember.speedY;
                    ember.life--;
                    // Reset embers that go off-screen or expire
                    if (ember.life <= 0 || ember.y < 0 || ember.x < 0 || ember.x > CANVAS_WIDTH) {
                        this._floatingEmbers.splice(i, 1);
                        // Add new ember to maintain count
                        this._floatingEmbers.push({
                            x: Math.random() * CANVAS_WIDTH,
                            y: CANVAS_HEIGHT,
                            size: 1 + Math.random() * 2,
                            speedX: -0.5 + Math.random(),
                            speedY: -0.2 - Math.random() * 0.5,
                            life: 200 + Math.random() * 200
                        });
                    }
                }
            }
        },
        {
            key: "_renderEmbers",
            value: function _renderEmbers() {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = this._floatingEmbers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var ember = _step.value;
                        // Create glowing ember effect
                        var gradient = this.ctx.createRadialGradient(ember.x, ember.y, 0, ember.x, ember.y, ember.size * 2);
                        gradient.addColorStop(0, this._glowColor);
                        gradient.addColorStop(1, 'transparent');
                        this.ctx.fillStyle = gradient;
                        this.ctx.globalCompositeOperation = 'lighter';
                        this.ctx.beginPath();
                        this.ctx.arc(ember.x, ember.y, ember.size * 2, 0, Math.PI * 2);
                        this.ctx.fill();
                        // Core of the ember
                        this.ctx.fillStyle = this._netherColors.lava;
                        this.ctx.beginPath();
                        this.ctx.arc(ember.x, ember.y, ember.size, 0, Math.PI * 2);
                        this.ctx.fill();
                        this.ctx.globalCompositeOperation = 'source-over';
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
            }
        },
        {
            key: "_drawBasaltPillars",
            value: function _drawBasaltPillars() {
                var _this = this;
                // Basalt pillar positions and heights
                var pillars = [
                    {
                        x: 50,
                        height: 80
                    },
                    {
                        x: 250,
                        height: 120
                    },
                    {
                        x: 500,
                        height: 100
                    },
                    {
                        x: 700,
                        height: 90
                    }
                ];
                pillars.forEach(function(pillar) {
                    _this.ctx.save();
                    _this.ctx.translate(-_this.cameraOffset, 0);
                    drawBasaltPillar(_this.ctx, pillar.x, pillar.height);
                    _this.ctx.restore();
                });
            }
        },
        {
            key: "_drawGoldBlocks",
            value: function _drawGoldBlocks() {
                var _this = this;
                // Gold block positions
                var blocks = [
                    {
                        x: 150,
                        y: 100
                    },
                    {
                        x: 450,
                        y: 150
                    },
                    {
                        x: 650,
                        y: 120
                    }
                ];
                blocks.forEach(function(block) {
                    var _this_assetLoader;
                    _this.ctx.save();
                    _this.ctx.translate(-_this.cameraOffset, 0);
                    // Draw gold block texture
                    var goldTexture = (_this_assetLoader = _this.assetLoader) === null || _this_assetLoader === void 0 ? void 0 : _this_assetLoader.getAsset('gold block');
                    if (goldTexture) {
                        ctx.drawImage(goldTexture, block.x, block.y, 40, 40);
                    }
                    _this.ctx.restore();
                });
            }
        },
        {
            key: "checkPortalCollision",
            value: function checkPortalCollision() {
                // Skip if no portal exists or player has already entered portal
                if (!this.portal || !this.portal.active || this.enteredPortal) {
                    return false;
                }
                
                // Check if player is colliding with portal
                const playerRect = {
                    x: this.player.x,
                    y: this.player.y,
                    width: this.player.width,
                    height: this.player.height
                };
                
                const portalRect = {
                    x: this.portal.x,
                    y: this.portal.y,
                    width: this.portal.width,
                    height: this.portal.height
                };
                
                // If player collides with portal
                if (this.isColliding(playerRect, portalRect)) {
                    // Play portal entry sound
                    this.audioManager.play('collect', 1.8);
                    
                    // Add floating text
                    this.floatingTexts.push(
                        new FloatingText(
                            "Level complete!", 
                            this.player.x, 
                            this.player.y - 60,
                            2000
                        )
                    );
                    
                    // Apply screen shake for effect
                    this.applyScreenShake(8);
                    
                    // Change background image to background2.png
                    console.log("Changing background to background2.png");
                    this._backgroundImage = this.assetLoader.getAsset('bg_Sandro2');
                    if (!this._backgroundImage) {
                        console.log("Background2 image not preloaded, loading now");
                        this.assetLoader.loadImage('bg_Sandro2', './assets/level3/background2.png')
                            .then(img => {
                                console.log("Background2 image loaded successfully");
                                this._backgroundImage = img;
                            });
                    } else {
                        console.log("Using preloaded background2 image");
                    }
                    
                    // Change dave image to dave2.png
                    console.log("Changing Dave image to dave2.png");
                    const dave2Image = this.assetLoader.getAsset('dave minecraft2');
                    if (dave2Image) {
                        console.log("Using preloaded dave2 image");
                        this.assetLoader.assets['dave minecraft'] = dave2Image;
                    } else {
                        console.log("Dave2 image not preloaded, loading now");
                        this.assetLoader.loadImage('dave minecraft2', './assets/level3/dave2.png')
                            .then(img => {
                                console.log("Dave2 image loaded successfully");
                                this.assetLoader.assets['dave minecraft'] = img;
                            });
                    }
                    
                    // Set flag to prevent repeated triggers
                    this.enteredPortal = true;
                    
                    // Set timeout to transition to victory state after effect
                    // setTimeout(() => {
                    //     this.gameState = GAME_STATE.VICTORY;
                    // }, 1000);
                    
                    return true;
                }
                
                return false;
            }
        },
        {
            key: "checkLavaCollision",
            value: function checkLavaCollision() {
                // Lava rivers data - each entry defines a river's position and size
                const lavaRivers = [];
                
                // All rivers are at GROUND_LEVEL + 20 with height 10
                const lavaY = GROUND_LEVEL + 20;
                const lavaHeight = 10;
                
                // Get player position relative to world
                const playerX = this.player.x;
                const playerY = this.player.y + this.player.height;
                const playerFeetWidth = this.player.width * 0.8; // Narrow collision for feet
                const playerLeftFoot = playerX + this.player.width * 0.1;
                const playerRightFoot = playerLeftFoot + playerFeetWidth;
                
                // Check if player's feet are at lava height
                if (playerY >= lavaY && playerY <= lavaY + lavaHeight) {
                    // Check collision with any river
                    for (const river of lavaRivers) {
                        // Check if any part of player's feet overlaps with river
                        if ((playerLeftFoot >= river.start && playerLeftFoot <= river.end) || 
                            (playerRightFoot >= river.start && playerRightFoot <= river.end) ||
                            (playerLeftFoot <= river.start && playerRightFoot >= river.end)) {
                            return true;
                        }
                    }
                }
                
                // Check for lava pit collisions as well
                if (this.world.checkLavaPitCollision(this.player)) {
                    return true;
                }
                
                return false;
            }
        },
        {
            key: "handleLavaCollision",
            value: function handleLavaCollision() {
                // Similar to zombie collision but with lava-specific effects
                var _this = this;
                
                // Jump up slightly to get out of the lava
                this.player.vy = -5;
                
                // Check if player has any resources to lose
                var availableResources = [];
                const resources = this.resourceManager.getResources();
                for(var type in resources){
                    if (resources[type] >= 5) {
                        availableResources.push(type);
                    }
                }
                if (availableResources.length > 0) {
                    // Choose a random resource to reduce
                    var resourceType = availableResources[Math.floor(Math.random() * availableResources.length)];
                    this.resourceManager.removeResource(resourceType, 5);
                    
                    // Add visual feedback about resource loss
                    this.floatingTexts.push(new FloatingText("-5 ".concat(resourceType, "!"), this.player.x, this.player.y - 40));
                }
                
                // Add some visual feedback (lava specific)
                this.floatingTexts.push(new FloatingText("Hot! Hot! Hot!", this.player.x, this.player.y - 20));
                
                // Play hurt sound effect
                this.audioManager.play('hurt', 0.7);
                
                // Apply screen shake effect
                this.applyScreenShake(5);
                
                // Visual indication of being hit
                this.player.isHit = true;
                this.player.isImmune = true;
                this.player.immunityTimer = 0;
                setTimeout(function() {
                    _this.player.isHit = false;
                }, 500);
            },
        },
        {
            key: "checkResourceCompletion",
            value: function checkResourceCompletion() {
                // Get current resources
                var resources = this.resourceManager.getResources();
                
                // Check if player has collected all required resources
                if (resources.crossbow >= 1 && resources.shield >= 1 && resources.obsidian >= 4 && resources.enderpearl >= 2) {
                    // All required resources collected, show a simple message
                    this.floatingTexts.push(new FloatingText(
                        "All resources collected!", 
                        this.player.x, 
                        this.player.y - 60,
                        2000 // shorter duration
                    ));
                    
                    // Play special sound
                    this.audioManager.play('collect', 1.5);
                    
                    // Create portal in front of player (about 200px ahead)
                    this.createPortal(this.player.x + 200, this.player.y - 40);
                    
                    // Set flag to prevent checking resources again
                    this.resourceRequirementsMet = true;
                }
            }
        },
        {
            key: "createPortal",
            value: function createPortal(x, y) {
                // Create a portal object
                this.portal = {
                    x: x,
                    y: y,
                    width: 128,
                    height: 128,
                    active: true,
                    creationTime: Date.now()
                };
                
                // Play portal creation sound
                this.audioManager.play('collect', 1.0);
                
                // Add screen shake effect
                this.applyScreenShake(5);
                
                // Add floating text
                this.floatingTexts.push(new FloatingText(
                    "Portal created!", 
                    x, 
                    y - 30,
                    2000, // longer duration
                    { color: '#AA55FF' } // Purple color
                ));
                
                console.log("Portal created at", x, y);
            }
        },
        {
            key: "renderPortal",
            value: function renderPortal() {
                if (!this.portal) return;
                
                // Calculate portal screen position
                const portalScreenX = this.portal.x - this.cameraOffset;
                
                // Get portal image if it exists
                const portalImage = this.assetLoader.getAsset('portal');
                
                if (portalImage) {
                    // Draw portal image
                    this.ctx.save();
                    
                    // Add glow effect
                    const elapsedTime = Date.now() - this.portal.creationTime;
                    const glowIntensity = 0.5 + Math.sin(elapsedTime / 200) * 0.2;
                    
                    // Draw glow
                    this.ctx.globalAlpha = glowIntensity;
                    this.ctx.shadowColor = '#AA55FF'; // Purple glow
                    this.ctx.shadowBlur = 15;
                    
                    // Draw the portal
                    this.ctx.drawImage(
                        portalImage, 
                        portalScreenX, 
                        this.portal.y, 
                        this.portal.width, 
                        this.portal.height
                    );
                    
                    this.ctx.restore();
                } else {
                    // Fallback if no portal image is available
                    this.ctx.save();
                    
                    // Create a pulsing animation
                    const elapsedTime = Date.now() - this.portal.creationTime;
                    const pulseScale = 1 + Math.sin(elapsedTime / 300) * 0.1;
                    
                    // Create portal gradient
                    const gradient = this.ctx.createLinearGradient(
                        portalScreenX, 
                        this.portal.y, 
                        portalScreenX + this.portal.width, 
                        this.portal.y + this.portal.height
                    );
                    
                    gradient.addColorStop(0, '#301934'); // Dark purple
                    gradient.addColorStop(0.5, '#8A2BE2'); // Purple
                    gradient.addColorStop(1, '#301934'); // Dark purple
                    
                    // Draw portal rectangle with gradient
                    this.ctx.fillStyle = gradient;
                    
                    // Add glow effect
                    this.ctx.shadowColor = '#AA55FF';
                    this.ctx.shadowBlur = 15;
                    
                    // Apply pulse effect
                    this.ctx.translate(
                        portalScreenX + this.portal.width/2, 
                        this.portal.y + this.portal.height/2
                    );
                    this.ctx.scale(pulseScale, pulseScale);
                    this.ctx.translate(
                        -(portalScreenX + this.portal.width/2), 
                        -(this.portal.y + this.portal.height/2)
                    );
                    
                    // Draw the portal rectangle
                    this.ctx.fillRect(
                        portalScreenX, 
                        this.portal.y, 
                        this.portal.width, 
                        this.portal.height
                    );
                    
                    this.ctx.restore();
                }
                
                // Add particles effect around the portal
                if (Math.random() < 0.3) {
                    const particleX = portalScreenX + Math.random() * this.portal.width;
                    const particleY = this.portal.y + Math.random() * this.portal.height;
                    
                    this.floatingTexts.push(new FloatingText(
                        "*", 
                        particleX + this.cameraOffset, 
                        particleY,
                        1000, // duration
                        {
                            color: '#AA55FF',
                            fontSize: 12 + Math.random() * 8,
                            velocityY: -1 - Math.random(),
                            velocityX: (Math.random() - 0.5) * 2
                        }
                    ));
                }
            }
        }
    ]);
    return Game;
}();
export { Game as default };
