// ==========================================
// SPIDER-MAN 3D GAME - MAIN CONTROLLER
// Ultimate Web Adventure - v3.0
// ==========================================

console.log("🕷️ Spider-Man Game script loaded");

// Create debug console overlay
const debugConsole = document.createElement("div");
debugConsole.id = "debugConsole";
debugConsole.style.cssText = `
    position: fixed; top: 10px; right: 10px; width: 300px; height: 200px;
    background: rgba(0,0,0,0.8); color: lime; font-family: monospace; font-size: 12px;
    padding: 10px; border-radius: 5px; z-index: 9999; overflow-y: auto;
    display: none;
`;
document.body.appendChild(debugConsole);

// Override console.log for debugging
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

function addToDebugConsole(message, type = "log") {
  const debugDiv = document.getElementById("debugConsole");
  if (debugDiv) {
    debugDiv.style.display = "block";
    const color =
      type === "error" ? "red" : type === "warn" ? "yellow" : "lime";
    debugDiv.innerHTML += `<div style="color: ${color}">${message}</div>`;
    debugDiv.scrollTop = debugDiv.scrollHeight;
  }
}

console.log = function (...args) {
  originalConsoleLog.apply(console, args);
  addToDebugConsole(args.join(" "), "log");
};

console.error = function (...args) {
  originalConsoleError.apply(console, args);
  addToDebugConsole("ERROR: " + args.join(" "), "error");
};

console.warn = function (...args) {
  originalConsoleWarn.apply(console, args);
  addToDebugConsole("WARN: " + args.join(" "), "warn");
};

class SpiderManGame {
  constructor() {
    // Core game properties
    this.isInitialized = false;
    this.isLoading = true;
    this.gameState = "loading"; // loading, menu, playing, paused, gameOver
    this.loadingProgress = 0;

    // Game settings
    this.settings = {
      graphics: {
        quality: "medium",
        resolution: "1920x1080",
        antiAliasing: true,
        shadows: true,
        particles: true,
      },
      audio: {
        masterVolume: 0.8,
        musicVolume: 0.6,
        sfxVolume: 0.9,
      },
      controls: {
        mouseSensitivity: 1.0,
        invertY: false,
      },
    };

    // Game statistics
    this.gameStats = {
      score: 0,
      combo: 0,
      maxCombo: 0,
      health: 100,
      maxHealth: 100,
      webFluid: 100,
      maxWebFluid: 100,
      stamina: 100,
      maxStamina: 100,
      height: 0,
      maxHeight: 0,
      timeStarted: 0,
      timePlayed: 0,
      enemiesDefeated: 0,
      webSwings: 0,
      wallCrawlTime: 0,
    };

    // Game mechanics
    this.mechanics = {
      isSwinging: false,
      isWallCrawling: false,
      isSpiderSenseActive: false,
      isCombatMode: false,
      lastWebAttachPoint: null,
      webLines: [],
      enemies: [],
      explosions: [],
      achievements: [],
      damageNumbers: [],
    };

    // Input handling
    this.input = {
      keys: {},
      mouse: {
        x: 0,
        y: 0,
        deltaX: 0,
        deltaY: 0,
        leftClick: false,
        rightClick: false,
        isLocked: false,
      },
      gamepad: null,
    };

    // Performance monitoring
    this.performance = {
      fps: 0,
      frameCount: 0,
      lastTime: 0,
      deltaTime: 0,
    };

    // Initialize the game
    this.init();
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  async init() {
    console.log("🕷️ Initializing Spider-Man 3D Game...");

    try {
      // Get DOM elements
      this.getDOMElements();

      // Setup event listeners
      this.setupEventListeners();

      // Start loading process
      await this.loadGameAssets();

      // Initialize game systems
      this.initializeGameSystems();

      // Show main menu
      this.showMainMenu();

      console.log("✅ Spider-Man 3D Game initialized successfully!");
    } catch (error) {
      console.error("❌ Failed to initialize game:", error);
      this.showErrorMessage(
        "Failed to initialize game. Please refresh and try again."
      );
    }
  }

  showErrorMessage(message) {
    // Hide loading screen
    if (this.loadingScreen) {
      this.loadingScreen.style.display = "none";
    }

    // Show error message
    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, #ff4444, #cc0000);
            color: white; display: flex; align-items: center; justify-content: center;
            font-family: 'Orbitron', Arial, sans-serif; z-index: 10000;
        `;
    errorDiv.innerHTML = `
            <div style="text-align: center; padding: 40px; background: rgba(0,0,0,0.8); border-radius: 20px; max-width: 500px;">
                <div style="font-size: 60px; margin-bottom: 20px;">🕷️</div>
                <h2 style="margin-bottom: 20px; font-size: 28px;">Spider-Man Game Error</h2>
                <p style="margin-bottom: 30px; font-size: 16px; opacity: 0.9;">${message}</p>
                <button onclick="location.reload()" style="
                    padding: 15px 30px; font-size: 16px; background: #ff4444; color: white;
                    border: none; border-radius: 10px; cursor: pointer; font-family: inherit;
                    transition: background 0.3s ease;
                " onmouseover="this.style.background='#ff6666'" onmouseout="this.style.background='#ff4444'">
                    Refresh Page
                </button>
            </div>
        `;
    document.body.appendChild(errorDiv);
  }

  getDOMElements() {
    // Canvas and containers
    this.canvas = document.getElementById("gameCanvas");
    this.gameContainer = document.getElementById("gameContainer");
    this.loadingScreen = document.getElementById("loadingScreen");
    this.gameHUD = document.getElementById("gameHUD");

    // Check critical elements
    if (!this.canvas) {
      throw new Error("Game canvas not found");
    }
    if (!this.loadingScreen) {
      throw new Error("Loading screen not found");
    }

    // Loading elements
    this.loadingProgress = document.getElementById("loadingProgress");
    this.loadingPercentage = document.getElementById("loadingPercentage");
    this.loadingText = document.getElementById("loadingText");

    // HUD elements
    this.healthFill = document.getElementById("healthFill");
    this.healthValue = document.getElementById("healthValue");
    this.webFluidFill = document.getElementById("webFluidFill");
    this.webFluidValue = document.getElementById("webFluidValue");
    this.staminaFill = document.getElementById("staminaFill");
    this.scoreValue = document.getElementById("scoreValue");
    this.comboValue = document.getElementById("comboValue");
    this.heightValue = document.getElementById("heightValue");
    this.spiderSense = document.getElementById("spiderSense");
    this.crosshair = document.getElementById("crosshair");
    this.webSwingIndicator = document.getElementById("webSwingIndicator");

    // Menu elements
    this.mainMenu = document.getElementById("mainMenu");
    this.pauseMenu = document.getElementById("pauseMenu");
    this.settingsMenu = document.getElementById("settingsMenu");
    this.controlsMenu = document.getElementById("controlsMenu");
    this.gameOverScreen = document.getElementById("gameOverScreen");

    // Mini-map
    this.miniMapCanvas = document.getElementById("miniMapCanvas");
    if (this.miniMapCanvas) {
      this.miniMapContext = this.miniMapCanvas.getContext("2d");
    }

    // Achievement and damage containers
    this.achievementContainer = document.getElementById("achievementContainer");
    this.damageIndicators = document.getElementById("damageIndicators");

    // Web trajectory
    this.webTrajectory = document.getElementById("webTrajectory");
    this.trajectoryCanvas = document.getElementById("trajectoryCanvas");

    console.log("✅ DOM elements retrieved successfully");

    // Resize canvas
    this.resizeCanvas();
  }

  setupEventListeners() {
    // Window events
    window.addEventListener("resize", () => this.resizeCanvas());
    window.addEventListener("beforeunload", () => this.saveGameData());

    // Keyboard events
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
    document.addEventListener("keyup", (e) => this.handleKeyUp(e));

    // Mouse events
    document.addEventListener("mousemove", (e) => this.handleMouseMove(e));
    document.addEventListener("mousedown", (e) => this.handleMouseDown(e));
    document.addEventListener("mouseup", (e) => this.handleMouseUp(e));
    document.addEventListener("wheel", (e) => this.handleMouseWheel(e));

    // Pointer lock events
    document.addEventListener("pointerlockchange", () =>
      this.handlePointerLockChange()
    );

    // Menu button events
    this.setupMenuEventListeners();

    // Settings events
    this.setupSettingsEventListeners();

    // Gamepad events
    window.addEventListener("gamepadconnected", (e) =>
      this.handleGamepadConnected(e)
    );
    window.addEventListener("gamepaddisconnected", (e) =>
      this.handleGamepadDisconnected(e)
    );
  }

  setupMenuEventListeners() {
    // Main menu buttons
    document
      .getElementById("startGameBtn")
      ?.addEventListener("click", () => this.startGame());
    document
      .getElementById("settingsBtn")
      ?.addEventListener("click", () => this.showSettings());
    document
      .getElementById("controlsBtn")
      ?.addEventListener("click", () => this.showControls());
    document
      .getElementById("creditsBtn")
      ?.addEventListener("click", () => this.showCredits());

    // Pause menu buttons
    document
      .getElementById("resumeBtn")
      ?.addEventListener("click", () => this.resumeGame());
    document
      .getElementById("pauseSettingsBtn")
      ?.addEventListener("click", () => this.showSettings());
    document
      .getElementById("restartBtn")
      ?.addEventListener("click", () => this.restartGame());
    document
      .getElementById("mainMenuBtn")
      ?.addEventListener("click", () => this.showMainMenu());

    // Settings buttons
    document
      .getElementById("applySettingsBtn")
      ?.addEventListener("click", () => this.applySettings());
    document
      .getElementById("cancelSettingsBtn")
      ?.addEventListener("click", () => this.cancelSettings());

    // Controls button
    document
      .getElementById("closeControlsBtn")
      ?.addEventListener("click", () => this.hideControls());

    // Game over buttons
    document
      .getElementById("tryAgainBtn")
      ?.addEventListener("click", () => this.restartGame());
    document
      .getElementById("gameOverMenuBtn")
      ?.addEventListener("click", () => this.showMainMenu());

    // Settings tabs
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) =>
        this.switchSettingsTab(e.target.dataset.tab)
      );
    });
  }

  setupSettingsEventListeners() {
    // Graphics settings
    document
      .getElementById("qualitySelect")
      ?.addEventListener("change", (e) => {
        this.settings.graphics.quality = e.target.value;
      });

    // Audio settings with real-time updates
    document.getElementById("masterVolume")?.addEventListener("input", (e) => {
      this.settings.audio.masterVolume = e.target.value / 100;
      e.target.nextElementSibling.textContent = e.target.value + "%";
    });

    document.getElementById("musicVolume")?.addEventListener("input", (e) => {
      this.settings.audio.musicVolume = e.target.value / 100;
      e.target.nextElementSibling.textContent = e.target.value + "%";
    });

    document.getElementById("sfxVolume")?.addEventListener("input", (e) => {
      this.settings.audio.sfxVolume = e.target.value / 100;
      e.target.nextElementSibling.textContent = e.target.value + "%";
    });

    // Controls settings
    document
      .getElementById("mouseSensitivity")
      ?.addEventListener("input", (e) => {
        this.settings.controls.mouseSensitivity = parseFloat(e.target.value);
        e.target.nextElementSibling.textContent = e.target.value;
      });

    document.getElementById("invertYCheck")?.addEventListener("change", (e) => {
      this.settings.controls.invertY = e.target.checked;
    });
  }

  async loadGameAssets() {
    const loadingSteps = [
      { text: "Checking Three.js...", duration: 300 },
      { text: "Checking Cannon.js...", duration: 300 },
      { text: "Initializing graphics engine...", duration: 600 },
      { text: "Setting up physics...", duration: 500 },
      { text: "Loading audio system...", duration: 400 },
      { text: "Preparing game world...", duration: 600 },
      { text: "Calibrating spider powers...", duration: 300 },
      { text: "Ready to swing!", duration: 200 },
    ];

    for (let i = 0; i < loadingSteps.length; i++) {
      const step = loadingSteps[i];

      // Update loading text
      if (this.loadingText) {
        this.loadingText.textContent = step.text;
      }

      // Check dependencies at appropriate steps
      if (i === 0 && typeof THREE === "undefined") {
        throw new Error("Three.js library not loaded");
      }
      if (i === 1 && typeof CANNON === "undefined") {
        console.warn("Cannon.js not available - physics will be limited");
      }

      // Simulate loading with realistic progress
      await this.updateLoadingProgress(
        ((i + 1) / loadingSteps.length) * 100,
        step.duration
      );
    }

    // Hide loading screen
    setTimeout(() => {
      if (this.loadingScreen) {
        this.loadingScreen.style.opacity = "0";
        setTimeout(() => {
          this.loadingScreen.style.display = "none";
          this.isLoading = false;
        }, 500);
      }
    }, 500);
  }

  updateLoadingProgress(percentage, duration) {
    return new Promise((resolve) => {
      const start = this.loadingProgress.style.width
        ? parseFloat(this.loadingProgress.style.width)
        : 0;
      const end = percentage;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = start + (end - start) * this.easeOutCubic(progress);

        this.loadingProgress.style.width = current + "%";
        this.loadingPercentage.textContent = Math.round(current) + "%";

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animate();
    });
  }

  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  initializeGameSystems() {
    console.log("🕷️ Initializing game systems...");

    // Initialize Three.js scene (will be handled by spiderman-graphics.js)
    if (window.SpiderManGraphics) {
      try {
        this.graphics = new SpiderManGraphics(this);
        console.log("✅ Graphics system initialized");
      } catch (error) {
        console.error("❌ Failed to initialize graphics system:", error);
        this.graphics = null;
      }
    } else {
      console.warn("⚠️ SpiderManGraphics class not available");
    }

    // Initialize physics system (will be handled by spiderman-physics.js)
    if (window.SpiderManPhysics) {
      try {
        this.physics = new SpiderManPhysics(this);
        console.log("✅ Physics system initialized");
      } catch (error) {
        console.error("❌ Failed to initialize physics system:", error);
        this.physics = null;
      }
    } else {
      console.warn("⚠️ SpiderManPhysics class not available");
    }

    // Initialize audio system (will be handled by spiderman-audio.js)
    if (window.SpiderManAudio) {
      try {
        this.audio = new SpiderManAudio(this);
        console.log("✅ Audio system initialized");
      } catch (error) {
        console.error("❌ Failed to initialize audio system:", error);
        this.audio = null;
      }
    } else {
      console.warn("⚠️ SpiderManAudio class not available");
    }

    // Load saved game data
    this.loadGameData();

    this.isInitialized = true;
    console.log("🕷️ Game systems initialization complete");
  }

  // ==========================================
  // GAME LOOP
  // ==========================================

  start() {
    this.gameStats.timeStarted = Date.now();
    this.gameLoop();
  }

  gameLoop() {
    const currentTime = performance.now();
    this.performance.deltaTime =
      (currentTime - this.performance.lastTime) / 1000;
    this.performance.lastTime = currentTime;

    // Calculate FPS
    this.performance.frameCount++;
    if (this.performance.frameCount % 60 === 0) {
      this.performance.fps = Math.round(1 / this.performance.deltaTime);
    }

    if (this.gameState === "playing") {
      this.update();
      this.render();
    }

    requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    // Update game statistics
    this.gameStats.timePlayed = Date.now() - this.gameStats.timeStarted;

    // Update input
    this.updateInput();

    // Update player
    this.updatePlayer();

    // Update game mechanics
    this.updateGameMechanics();

    // Update enemies
    this.updateEnemies();

    // Update effects
    this.updateEffects();

    // Update UI
    this.updateUI();

    // Update physics (if available)
    if (this.physics) {
      this.physics.update(this.performance.deltaTime);
    }

    // Update audio (if available)
    if (this.audio) {
      this.audio.update();
    }
  }

  render() {
    // Render 3D graphics (if available)
    if (this.graphics && this.graphics.isInitialized) {
      try {
        this.graphics.render();
      } catch (error) {
        console.error("❌ Graphics render error:", error);
      }
    } else {
      // Fallback: Clear canvas with a simple background
      if (this.canvas) {
        const ctx = this.canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#001122";
          ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

          // Draw simple text
          ctx.fillStyle = "#ffffff";
          ctx.font = "24px Arial";
          ctx.textAlign = "center";
          ctx.fillText(
            "3D Graphics Loading...",
            this.canvas.width / 2,
            this.canvas.height / 2
          );
        }
      }
    }

    // Render mini-map (if available)
    try {
      this.renderMiniMap();
    } catch (error) {
      console.warn("⚠️ Mini-map render error:", error);
    }

    // Render web trajectory (if available)
    try {
      this.renderWebTrajectory();
    } catch (error) {
      console.warn("⚠️ Web trajectory render error:", error);
    }
  }

  // ==========================================
  // INPUT HANDLING
  // ==========================================

  handleKeyDown(event) {
    const key = event.code.toLowerCase();
    this.input.keys[key] = true;

    // Global key handlers
    switch (key) {
      case "escape":
        event.preventDefault();
        if (this.gameState === "playing") {
          this.pauseGame();
        } else if (this.gameState === "paused") {
          this.resumeGame();
        }
        break;

      case "tab":
        event.preventDefault();
        this.toggleHUD();
        break;

      case "keym":
        event.preventDefault();
        this.toggleMiniMap();
        break;
    }

    // Game-specific key handlers (only during gameplay)
    if (this.gameState === "playing") {
      switch (key) {
        case "space":
          event.preventDefault();
          this.handleJumpOrSwing();
          break;

        case "keyq":
          event.preventDefault();
          this.shootWeb();
          break;

        case "keye":
          event.preventDefault();
          this.toggleWallCrawl();
          break;

        case "keyr":
          event.preventDefault();
          this.reloadWebFluid();
          break;

        case "keyf":
          event.preventDefault();
          this.activateSpiderSense();
          break;

        case "shiftleft":
          this.startSprint();
          break;
      }
    }
  }

  handleKeyUp(event) {
    const key = event.code.toLowerCase();
    this.input.keys[key] = false;

    if (key === "shiftleft") {
      this.stopSprint();
    }
  }

  handleMouseMove(event) {
    if (this.gameState !== "playing" || !this.input.mouse.isLocked) return;

    this.input.mouse.deltaX =
      event.movementX * this.settings.controls.mouseSensitivity;
    this.input.mouse.deltaY =
      event.movementY * this.settings.controls.mouseSensitivity;

    if (this.settings.controls.invertY) {
      this.input.mouse.deltaY *= -1;
    }

    // Update crosshair position for UI feedback
    this.updateCrosshair(event.clientX, event.clientY);
  }

  handleMouseDown(event) {
    if (this.gameState !== "playing") {
      // Request pointer lock when starting to play
      if (this.gameState === "menu") {
        this.requestPointerLock();
      }
      return;
    }

    switch (event.button) {
      case 0: // Left click
        this.input.mouse.leftClick = true;
        this.handlePunch();
        break;

      case 2: // Right click
        this.input.mouse.rightClick = true;
        this.handleWebZip();
        break;
    }

    event.preventDefault();
  }

  handleMouseUp(event) {
    switch (event.button) {
      case 0: // Left click
        this.input.mouse.leftClick = false;
        break;

      case 2: // Right click
        this.input.mouse.rightClick = false;
        break;
    }
  }

  handleMouseWheel(event) {
    if (this.gameState !== "playing") return;

    // Zoom or web swing adjustment
    const delta = Math.sign(event.deltaY);
    this.adjustWebLength(delta);

    event.preventDefault();
  }

  handlePointerLockChange() {
    this.input.mouse.isLocked = document.pointerLockElement === this.canvas;

    if (this.input.mouse.isLocked) {
      this.crosshair.style.display = "block";
    } else {
      this.crosshair.style.display = "none";
    }
  }

  requestPointerLock() {
    this.canvas.requestPointerLock();
  }

  updateInput() {
    // Update continuous input states
    this.updateMovement();
    this.updateCamera();

    // Update gamepad input
    this.updateGamepadInput();
  }

  updateMovement() {
    const moveVector = { x: 0, y: 0, z: 0 };
    const isRunning = this.input.keys["shiftleft"];
    const speed = isRunning ? 12 : 6;

    // WASD movement
    if (this.input.keys["keyw"]) moveVector.z -= 1;
    if (this.input.keys["keys"]) moveVector.z += 1;
    if (this.input.keys["keya"]) moveVector.x -= 1;
    if (this.input.keys["keyd"]) moveVector.x += 1;

    // Normalize movement vector
    const length = Math.sqrt(
      moveVector.x * moveVector.x + moveVector.z * moveVector.z
    );
    if (length > 0) {
      moveVector.x = (moveVector.x / length) * speed;
      moveVector.z = (moveVector.z / length) * speed;
    }

    // Apply movement (will be handled by graphics/physics systems)
    this.playerMovement = moveVector;

    // Consume stamina when running
    if (isRunning && length > 0) {
      this.consumeStamina(20 * this.performance.deltaTime);
    }
  }

  updateCamera() {
    // Camera rotation based on mouse movement
    if (this.input.mouse.isLocked && this.graphics) {
      this.graphics.updateCameraRotation(
        this.input.mouse.deltaX,
        this.input.mouse.deltaY
      );
    }

    // Reset mouse deltas
    this.input.mouse.deltaX = 0;
    this.input.mouse.deltaY = 0;
  }

  updateGamepadInput() {
    const gamepads = navigator.getGamepads();
    if (gamepads[0]) {
      this.input.gamepad = gamepads[0];

      // Handle gamepad movement
      const leftStick = {
        x: this.input.gamepad.axes[0],
        y: this.input.gamepad.axes[1],
      };

      if (Math.abs(leftStick.x) > 0.1 || Math.abs(leftStick.y) > 0.1) {
        // Apply gamepad movement
        this.playerMovement = {
          x: leftStick.x * 6,
          y: 0,
          z: leftStick.y * 6,
        };
      }
    }
  }

  // ==========================================
  // GAME MECHANICS
  // ==========================================

  updatePlayer() {
    // Update player height for HUD
    if (this.graphics && this.graphics.player) {
      this.gameStats.height = Math.max(0, this.graphics.player.position.y);
      this.gameStats.maxHeight = Math.max(
        this.gameStats.maxHeight,
        this.gameStats.height
      );
    }

    // Regenerate stamina
    if (this.gameStats.stamina < this.gameStats.maxStamina) {
      this.gameStats.stamina = Math.min(
        this.gameStats.maxStamina,
        this.gameStats.stamina + 30 * this.performance.deltaTime
      );
    }

    // Regenerate web fluid slowly
    if (this.gameStats.webFluid < this.gameStats.maxWebFluid) {
      this.gameStats.webFluid = Math.min(
        this.gameStats.maxWebFluid,
        this.gameStats.webFluid + 5 * this.performance.deltaTime
      );
    }
  }

  updateGameMechanics() {
    // Update web swing mechanics
    this.updateWebSwinging();

    // Update wall crawling
    this.updateWallCrawling();

    // Update spider sense
    this.updateSpiderSense();

    // Update combo system
    this.updateCombo();
  }

  updateWebSwinging() {
    if (this.mechanics.isSwinging && this.mechanics.lastWebAttachPoint) {
      // Web swinging physics will be handled by physics system
      this.webSwingIndicator.classList.add("active");

      // Show web trajectory
      this.webTrajectory.classList.add("active");
    } else {
      this.webSwingIndicator.classList.remove("active");
      this.webTrajectory.classList.remove("active");
    }
  }

  updateWallCrawling() {
    if (this.mechanics.isWallCrawling) {
      this.gameStats.wallCrawlTime += this.performance.deltaTime;

      // Consume stamina while wall crawling
      this.consumeStamina(15 * this.performance.deltaTime);

      if (this.gameStats.stamina <= 0) {
        this.stopWallCrawl();
      }
    }
  }

  updateSpiderSense() {
    // Check for nearby enemies or dangers
    let dangerNearby = false;

    if (this.mechanics.enemies.length > 0) {
      for (let enemy of this.mechanics.enemies) {
        const distance = this.calculateDistance(enemy.position);
        if (distance < 50 && enemy.isAggressive) {
          dangerNearby = true;
          break;
        }
      }
    }

    if (dangerNearby && !this.mechanics.isSpiderSenseActive) {
      this.activateSpiderSense();
    } else if (!dangerNearby && this.mechanics.isSpiderSenseActive) {
      this.deactivateSpiderSense();
    }
  }

  updateCombo() {
    // Decrease combo over time if no recent actions
    if (this.gameStats.combo > 0 && Date.now() - this.lastComboTime > 3000) {
      this.gameStats.combo = Math.max(0, this.gameStats.combo - 1);
    }

    this.gameStats.maxCombo = Math.max(
      this.gameStats.maxCombo,
      this.gameStats.combo
    );
  }

  updateEnemies() {
    // Update enemy AI and behaviors
    for (let enemy of this.mechanics.enemies) {
      this.updateEnemy(enemy);
    }

    // Remove defeated enemies
    this.mechanics.enemies = this.mechanics.enemies.filter(
      (enemy) => enemy.health > 0
    );
  }

  updateEnemy(enemy) {
    // Simple enemy AI - move towards player
    if (enemy.isAggressive && this.graphics && this.graphics.player) {
      const playerPos = this.graphics.player.position;
      const direction = {
        x: playerPos.x - enemy.position.x,
        y: playerPos.y - enemy.position.y,
        z: playerPos.z - enemy.position.z,
      };

      const distance = Math.sqrt(
        direction.x * direction.x + direction.z * direction.z
      );

      if (distance > 2) {
        // Move towards player
        enemy.position.x +=
          (direction.x / distance) * enemy.speed * this.performance.deltaTime;
        enemy.position.z +=
          (direction.z / distance) * enemy.speed * this.performance.deltaTime;
      } else {
        // Attack player
        if (Date.now() - enemy.lastAttack > enemy.attackCooldown) {
          this.enemyAttackPlayer(enemy);
          enemy.lastAttack = Date.now();
        }
      }
    }
  }

  updateEffects() {
    // Update explosions
    this.mechanics.explosions = this.mechanics.explosions.filter(
      (explosion) => {
        explosion.time += this.performance.deltaTime;
        explosion.scale += explosion.expandRate * this.performance.deltaTime;
        explosion.opacity -= this.performance.deltaTime / explosion.duration;

        return explosion.time < explosion.duration;
      }
    );

    // Update damage numbers
    this.mechanics.damageNumbers = this.mechanics.damageNumbers.filter(
      (damage) => {
        damage.time += this.performance.deltaTime;
        damage.y -= damage.speed * this.performance.deltaTime;
        damage.opacity -= this.performance.deltaTime / damage.duration;

        return damage.time < damage.duration;
      }
    );
  }

  // ==========================================
  // COMBAT SYSTEM
  // ==========================================

  handlePunch() {
    if (this.gameStats.stamina < 20) return;

    this.consumeStamina(20);

    // Check for enemies in range
    const punchRange = 3;
    const hitEnemies = this.mechanics.enemies.filter((enemy) => {
      return this.calculateDistance(enemy.position) <= punchRange;
    });

    if (hitEnemies.length > 0) {
      for (let enemy of hitEnemies) {
        this.damageEnemy(enemy, 25);
      }

      this.increaseCombo();
      this.addScore(50 * hitEnemies.length);

      // Screen shake effect
      this.addScreenShake(0.3, 200);
    }

    // Play punch sound
    if (this.audio) {
      this.audio.playSound("punch");
    }
  }

  handleWebZip() {
    if (this.gameStats.webFluid < 15) return;

    this.consumeWebFluid(15);

    // Find web attach point
    const attachPoint = this.findWebAttachPoint();
    if (attachPoint) {
      this.startWebZip(attachPoint);
    }
  }

  handleJumpOrSwing() {
    if (this.mechanics.isSwinging) {
      this.releaseWeb();
    } else if (this.canWebSwing()) {
      this.startWebSwing();
    } else {
      this.jump();
    }
  }

  jump() {
    if (this.gameStats.stamina < 10) return;

    this.consumeStamina(10);

    // Apply jump force (handled by physics system)
    if (this.physics) {
      this.physics.applyJumpForce();
    }

    // Play jump sound
    if (this.audio) {
      this.audio.playSound("jump");
    }
  }

  startWebSwing() {
    if (this.gameStats.webFluid < 20) return;

    const attachPoint = this.findWebAttachPoint();
    if (!attachPoint) return;

    this.consumeWebFluid(20);
    this.mechanics.isSwinging = true;
    this.mechanics.lastWebAttachPoint = attachPoint;
    this.gameStats.webSwings++;

    // Create web line visual
    this.createWebLine(attachPoint);

    // Play web swing sound
    if (this.audio) {
      this.audio.playSound("webSwing");
    }

    this.addScore(10);
    this.increaseCombo();
  }

  releaseWeb() {
    this.mechanics.isSwinging = false;
    this.mechanics.lastWebAttachPoint = null;

    // Remove web line visuals
    this.mechanics.webLines = [];

    // Apply momentum (handled by physics system)
    if (this.physics) {
      this.physics.applySwingMomentum();
    }
  }

  shootWeb() {
    if (this.gameStats.webFluid < 10) return;

    this.consumeWebFluid(10);

    // Create web projectile
    this.createWebProjectile();

    // Play web shoot sound
    if (this.audio) {
      this.audio.playSound("webShoot");
    }
  }

  toggleWallCrawl() {
    if (this.mechanics.isWallCrawling) {
      this.stopWallCrawl();
    } else {
      this.startWallCrawl();
    }
  }

  startWallCrawl() {
    if (this.gameStats.stamina < 30) return;

    // Check if near a wall
    if (!this.isNearWall()) return;

    this.mechanics.isWallCrawling = true;

    // Play wall crawl sound
    if (this.audio) {
      this.audio.playSound("wallCrawl");
    }

    this.addScore(5);
  }

  stopWallCrawl() {
    this.mechanics.isWallCrawling = false;
  }

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  findWebAttachPoint() {
    // Find suitable web attachment points (buildings, structures)
    // This would be implemented with raycasting in the graphics system
    if (this.graphics) {
      return this.graphics.findWebAttachPoint();
    }

    // Fallback random point for demo
    return {
      x: Math.random() * 100 - 50,
      y: Math.random() * 50 + 20,
      z: Math.random() * 100 - 50,
    };
  }

  canWebSwing() {
    return this.gameStats.webFluid >= 20 && !this.mechanics.isSwinging;
  }

  isNearWall() {
    // Check if player is near a wall for crawling
    if (this.physics) {
      return this.physics.checkNearWall();
    }
    return Math.random() > 0.7; // Random for demo
  }

  calculateDistance(position) {
    if (!this.graphics || !this.graphics.player) return Infinity;

    const playerPos = this.graphics.player.position;
    const dx = position.x - playerPos.x;
    const dy = position.y - playerPos.y;
    const dz = position.z - playerPos.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  consumeStamina(amount) {
    this.gameStats.stamina = Math.max(0, this.gameStats.stamina - amount);
  }

  consumeWebFluid(amount) {
    this.gameStats.webFluid = Math.max(0, this.gameStats.webFluid - amount);
  }

  reloadWebFluid() {
    this.gameStats.webFluid = this.gameStats.maxWebFluid;

    if (this.audio) {
      this.audio.playSound("reload");
    }

    this.showAchievement("Web Cartridge Reloaded", "🕸️");
  }

  activateSpiderSense() {
    this.mechanics.isSpiderSenseActive = true;
    this.spiderSense.classList.add("active");

    if (this.audio) {
      this.audio.playSound("spiderSense");
    }

    // Auto-deactivate after 5 seconds
    setTimeout(() => this.deactivateSpiderSense(), 5000);
  }

  deactivateSpiderSense() {
    this.mechanics.isSpiderSenseActive = false;
    this.spiderSense.classList.remove("active");
  }

  addScore(points) {
    this.gameStats.score += Math.round(
      points * (1 + this.gameStats.combo * 0.1)
    );
  }

  increaseCombo() {
    this.gameStats.combo++;
    this.lastComboTime = Date.now();

    if (this.gameStats.combo > 0 && this.gameStats.combo % 10 === 0) {
      this.showAchievement(`${this.gameStats.combo}x Combo!`, "🔥");
    }
  }

  damageEnemy(enemy, damage) {
    enemy.health -= damage;

    // Show damage number
    this.showDamageNumber(damage, enemy.position);

    if (enemy.health <= 0) {
      this.defeatedEnemy(enemy);
    }
  }

  defeatedEnemy(enemy) {
    this.gameStats.enemiesDefeated++;
    this.addScore(100);
    this.increaseCombo();

    // Create explosion effect
    this.createExplosion(enemy.position);

    if (this.audio) {
      this.audio.playSound("enemyDefeated");
    }
  }

  enemyAttackPlayer(enemy) {
    const damage = enemy.damage || 10;
    this.takeDamage(damage);

    // Screen shake
    this.addScreenShake(0.5, 300);

    if (this.audio) {
      this.audio.playSound("playerHit");
    }
  }

  takeDamage(amount) {
    this.gameStats.health = Math.max(0, this.gameStats.health - amount);

    // Show damage indicator
    this.showDamageIndicator();

    if (this.gameStats.health <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    this.gameState = "gameOver";
    this.showGameOverScreen();

    if (this.audio) {
      this.audio.playSound("gameOver");
    }
  }

  // ==========================================
  // UI UPDATES
  // ==========================================

  updateUI() {
    // Update health bar
    const healthPercent =
      (this.gameStats.health / this.gameStats.maxHealth) * 100;
    this.healthFill.style.width = healthPercent + "%";
    this.healthValue.textContent = Math.round(this.gameStats.health);

    // Update web fluid bar
    const webPercent =
      (this.gameStats.webFluid / this.gameStats.maxWebFluid) * 100;
    this.webFluidFill.style.width = webPercent + "%";
    this.webFluidValue.textContent = Math.round(this.gameStats.webFluid);

    // Update stamina bar
    const staminaPercent =
      (this.gameStats.stamina / this.gameStats.maxStamina) * 100;
    this.staminaFill.style.width = staminaPercent + "%";

    // Update score and stats
    this.scoreValue.textContent = this.gameStats.score.toLocaleString();
    this.comboValue.textContent = this.gameStats.combo;
    this.heightValue.textContent = Math.round(this.gameStats.height) + "m";
  }

  updateCrosshair(x, y) {
    // Update crosshair position or color based on what's being targeted
    if (this.isEnemyInCrosshair()) {
      this.crosshair.classList.add("enemy-target");
    } else {
      this.crosshair.classList.remove("enemy-target");
    }
  }

  isEnemyInCrosshair() {
    // Check if crosshair is over an enemy
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const tolerance = 50;

    // This would be more sophisticated with actual 3D projection
    return this.mechanics.enemies.some((enemy) => {
      const screenPos = this.worldToScreen(enemy.position);
      return (
        screenPos &&
        Math.abs(screenPos.x - centerX) < tolerance &&
        Math.abs(screenPos.y - centerY) < tolerance
      );
    });
  }

  worldToScreen(worldPosition) {
    // Convert 3D world position to 2D screen coordinates
    // This would be implemented by the graphics system
    if (this.graphics) {
      return this.graphics.worldToScreen(worldPosition);
    }
    return null;
  }

  renderMiniMap() {
    const ctx = this.miniMapContext;
    const size = 180;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw background
    ctx.fillStyle = "rgba(0, 20, 40, 0.8)";
    ctx.fillRect(0, 0, size, size);

    // Draw player
    ctx.fillStyle = "#3498db";
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw enemies
    ctx.fillStyle = "#dc143c";
    for (let enemy of this.mechanics.enemies) {
      const x = (enemy.position.x / 200) * size + size / 2;
      const y = (enemy.position.z / 200) * size + size / 2;

      if (x >= 0 && x <= size && y >= 0 && y <= size) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw web swing point if active
    if (this.mechanics.isSwinging && this.mechanics.lastWebAttachPoint) {
      ctx.fillStyle = "#f1c40f";
      const point = this.mechanics.lastWebAttachPoint;
      const x = (point.x / 200) * size + size / 2;
      const y = (point.z / 200) * size + size / 2;

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw line to player
      ctx.strokeStyle = "#f1c40f";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(size / 2, size / 2);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  renderWebTrajectory() {
    if (!this.mechanics.isSwinging) return;

    const canvas = this.trajectoryCanvas;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw trajectory arc
    ctx.strokeStyle = "#3498db";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 10, 30, 0, Math.PI);
    ctx.stroke();

    // Draw attachment point
    ctx.fillStyle = "#f1c40f";
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 10, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // ==========================================
  // VISUAL EFFECTS
  // ==========================================

  createExplosion(position) {
    const explosion = {
      position: { ...position },
      time: 0,
      duration: 1.5,
      scale: 0.1,
      expandRate: 2,
      opacity: 1,
    };

    this.mechanics.explosions.push(explosion);
  }

  createWebLine(attachPoint) {
    const webLine = {
      startPos: this.graphics
        ? { ...this.graphics.player.position }
        : { x: 0, y: 0, z: 0 },
      endPos: { ...attachPoint },
      opacity: 1,
      time: 0,
    };

    this.mechanics.webLines.push(webLine);
  }

  createWebProjectile() {
    // Create web projectile that can hit enemies or stick to walls
    const projectile = {
      position: this.graphics
        ? { ...this.graphics.player.position }
        : { x: 0, y: 0, z: 0 },
      direction: this.getPlayerLookDirection(),
      speed: 20,
      time: 0,
      maxTime: 3,
    };

    // This would be handled by the graphics/physics systems
    if (this.graphics) {
      this.graphics.createWebProjectile(projectile);
    }
  }

  getPlayerLookDirection() {
    // Get the direction the player is looking
    if (this.graphics && this.graphics.camera) {
      return this.graphics.getPlayerLookDirection();
    }

    return { x: 0, y: 0, z: -1 }; // Default forward
  }

  showDamageNumber(damage, position) {
    const damageNum = {
      damage: damage,
      position: { ...position },
      time: 0,
      duration: 1.5,
      speed: 20,
      opacity: 1,
      critical: damage > 30,
    };

    this.mechanics.damageNumbers.push(damageNum);

    // Create DOM element for damage number
    const damageElement = document.createElement("div");
    damageElement.className =
      "damage-number" + (damageNum.critical ? " critical" : "");
    damageElement.textContent = Math.round(damage);

    // Position on screen (convert world to screen coordinates)
    const screenPos = this.worldToScreen(position);
    if (screenPos) {
      damageElement.style.left = screenPos.x + "px";
      damageElement.style.top = screenPos.y + "px";
    } else {
      damageElement.style.left = "50%";
      damageElement.style.top = "50%";
    }

    this.damageIndicators.appendChild(damageElement);

    // Remove after animation
    setTimeout(() => {
      if (damageElement.parentNode) {
        damageElement.parentNode.removeChild(damageElement);
      }
    }, 1500);
  }

  showDamageIndicator() {
    // Flash red overlay when taking damage
    const overlay = document.createElement("div");
    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle, transparent 30%, rgba(220, 20, 60, 0.3) 100%);
            pointer-events: none;
            z-index: 300;
            animation: damageFlash 0.5s ease-out;
        `;

    document.body.appendChild(overlay);

    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 500);
  }

  showAchievement(title, icon = "🏆") {
    const achievement = document.createElement("div");
    achievement.className = "achievement";
    achievement.innerHTML = `
            <div class="achievement-icon">${icon}</div>
            <div class="achievement-text">
                <div class="achievement-title">${title}</div>
                <div class="achievement-description">Achievement Unlocked!</div>
            </div>
        `;

    this.achievementContainer.appendChild(achievement);

    // Remove after animation
    setTimeout(() => {
      if (achievement.parentNode) {
        achievement.parentNode.removeChild(achievement);
      }
    }, 5000);

    // Play achievement sound
    if (this.audio) {
      this.audio.playSound("achievement");
    }
  }

  addScreenShake(intensity, duration) {
    if (this.graphics) {
      this.graphics.addScreenShake(intensity, duration);
    }
  }

  // ==========================================
  // GAME STATE MANAGEMENT
  // ==========================================

  startGame() {
    console.log("🎮 Starting game...");

    // Check if graphics system is initialized
    if (!this.graphics || !this.graphics.isInitialized) {
      console.error("❌ Graphics system not initialized");
      alert(
        "Graphics system not ready. Please wait for initialization to complete and try again."
      );
      return;
    }

    // Hide loading screen if still visible
    if (this.loadingScreen && this.loadingScreen.style.display !== "none") {
      this.loadingScreen.style.display = "none";
    }

    this.gameState = "playing";
    this.hideAllMenus();

    // Show game HUD
    if (this.gameHUD) {
      this.gameHUD.style.display = "block";
    }

    // Request pointer lock for mouse control
    this.requestPointerLock();

    // Start the game loop
    this.start();

    // Play gameplay music
    if (this.audio) {
      this.audio.playMusic("gameplay");
    }

    console.log("✅ Game started successfully");
  }

  pauseGame() {
    if (this.gameState !== "playing") return;

    this.gameState = "paused";
    this.showPauseMenu();

    if (this.audio) {
      this.audio.pauseMusic();
    }
  }

  resumeGame() {
    if (this.gameState !== "paused") return;

    this.gameState = "playing";
    this.hidePauseMenu();
    this.requestPointerLock();

    if (this.audio) {
      this.audio.resumeMusic();
    }
  }

  restartGame() {
    // Reset game statistics
    this.gameStats = {
      score: 0,
      combo: 0,
      maxCombo: 0,
      health: 100,
      maxHealth: 100,
      webFluid: 100,
      maxWebFluid: 100,
      stamina: 100,
      maxStamina: 100,
      height: 0,
      maxHeight: 0,
      timeStarted: 0,
      timePlayed: 0,
      enemiesDefeated: 0,
      webSwings: 0,
      wallCrawlTime: 0,
    };

    // Reset mechanics
    this.mechanics = {
      isSwinging: false,
      isWallCrawling: false,
      isSpiderSenseActive: false,
      isCombatMode: false,
      lastWebAttachPoint: null,
      webLines: [],
      enemies: [],
      explosions: [],
      achievements: [],
      damageNumbers: [],
    };

    // Reset graphics and physics if available
    if (this.graphics) {
      this.graphics.reset();
    }
    if (this.physics) {
      this.physics.reset();
    }

    this.startGame();
  }

  showMainMenu() {
    console.log("🎮 Showing main menu");
    this.gameState = "menu";
    this.hideAllMenus();

    if (this.mainMenu) {
      this.mainMenu.classList.add("active");
      console.log("✅ Main menu displayed");
    } else {
      console.error("❌ Main menu element not found");
    }

    if (this.audio) {
      this.audio.playMusic("menu");
    }
  }

  showPauseMenu() {
    this.pauseMenu.classList.add("active");
  }

  hidePauseMenu() {
    this.pauseMenu.classList.remove("active");
  }

  showSettings() {
    this.hideAllMenus();
    this.settingsMenu.classList.add("active");
  }

  showControls() {
    this.hideAllMenus();
    this.controlsMenu.classList.add("active");
  }

  hideControls() {
    this.controlsMenu.classList.remove("active");
    if (this.gameState === "menu") {
      this.showMainMenu();
    } else {
      this.showPauseMenu();
    }
  }

  showGameOverScreen() {
    this.hideAllMenus();

    // Update final stats
    document.getElementById("finalScore").textContent =
      this.gameStats.score.toLocaleString();
    document.getElementById("bestCombo").textContent = this.gameStats.maxCombo;
    document.getElementById("timeSurvived").textContent = this.formatTime(
      this.gameStats.timePlayed
    );

    this.gameOverScreen.classList.add("active");
  }

  hideAllMenus() {
    document.querySelectorAll(".menu-overlay").forEach((menu) => {
      menu.classList.remove("active");
    });
  }

  switchSettingsTab(tabName) {
    // Update tab buttons
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

    // Update tab content
    document.querySelectorAll(".settings-tab").forEach((tab) => {
      tab.classList.remove("active");
    });
    document.getElementById(tabName + "Tab").classList.add("active");
  }

  applySettings() {
    // Apply graphics settings
    if (this.graphics) {
      this.graphics.applySettings(this.settings.graphics);
    }

    // Apply audio settings
    if (this.audio) {
      this.audio.applySettings(this.settings.audio);
    }

    // Save settings
    this.saveGameData();

    // Close settings menu
    this.settingsMenu.classList.remove("active");
    if (this.gameState === "menu") {
      this.showMainMenu();
    } else {
      this.showPauseMenu();
    }
  }

  cancelSettings() {
    // Revert settings to saved values
    this.loadGameData();

    // Close settings menu
    this.settingsMenu.classList.remove("active");
    if (this.gameState === "menu") {
      this.showMainMenu();
    } else {
      this.showPauseMenu();
    }
  }

  toggleHUD() {
    const isHidden = this.gameHUD.style.display === "none";
    this.gameHUD.style.display = isHidden ? "block" : "none";
  }

  toggleMiniMap() {
    const miniMap = document.getElementById("miniMapContainer");
    const isHidden = miniMap.style.display === "none";
    miniMap.style.display = isHidden ? "block" : "none";
  }

  // ==========================================
  // DATA PERSISTENCE
  // ==========================================

  saveGameData() {
    const gameData = {
      settings: this.settings,
      highScore: Math.max(this.gameStats.score, this.getHighScore()),
      achievements: this.mechanics.achievements,
    };

    localStorage.setItem("spidermanGame", JSON.stringify(gameData));
  }

  loadGameData() {
    const saved = localStorage.getItem("spidermanGame");
    if (saved) {
      try {
        const gameData = JSON.parse(saved);
        this.settings = { ...this.settings, ...gameData.settings };
        this.highScore = gameData.highScore || 0;
        this.mechanics.achievements = gameData.achievements || [];
      } catch (error) {
        console.warn("Failed to load saved game data:", error);
      }
    }
  }

  getHighScore() {
    return this.highScore || 0;
  }

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  resizeCanvas() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      if (this.graphics) {
        this.graphics.resize(window.innerWidth, window.innerHeight);
      }
    }
  }

  showErrorMessage(message) {
    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(220, 20, 60, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-family: 'Orbitron', monospace;
            text-align: center;
            z-index: 10000;
        `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
  }

  // ==========================================
  // GAMEPAD SUPPORT
  // ==========================================

  handleGamepadConnected(event) {
    console.log("Gamepad connected:", event.gamepad);
    this.input.gamepad = event.gamepad;
  }

  handleGamepadDisconnected(event) {
    console.log("Gamepad disconnected:", event.gamepad);
    this.input.gamepad = null;
  }
}

// Initialize game when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("🕷️ DOM loaded, starting Spider-Man game...");
    window.spiderManGame = new SpiderManGame();
  } catch (error) {
    console.error("❌ Failed to create Spider-Man game:", error);
    // Show user-friendly error message
    const errorDiv = document.createElement("div");
    errorDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #ff4444; color: white; padding: 20px; border-radius: 10px;
            font-family: Arial, sans-serif; z-index: 10000; text-align: center;
        `;
    errorDiv.innerHTML = `
            <h3>🕷️ Spider-Man Game Error</h3>
            <p>Failed to initialize the game. Please refresh and try again.</p>
            <button onclick="location.reload()" style="padding: 10px 20px; margin-top: 10px; background: white; color: #ff4444; border: none; border-radius: 5px; cursor: pointer;">Refresh Page</button>
        `;
    document.body.appendChild(errorDiv);
  }
});

// Export for other modules
window.SpiderManGame = SpiderManGame;
