// ==========================================
// SPIDER-MAN 3D GAME - PHYSICS ENGINE
// Advanced Web Swinging & Movement Physics
// ==========================================

console.log("🕸️ Spider-Man Physics script loaded");

class SpiderManPhysics {
  constructor(game) {
    this.game = game;
    this.world = null;
    this.isInitialized = false;

    // Physics constants
    this.GRAVITY = -30;
    this.AIR_RESISTANCE = 0.98;
    this.GROUND_FRICTION = 0.85;
    this.WALL_FRICTION = 0.7;
    this.WEB_ELASTICITY = 0.3;
    this.WEB_DAMPING = 0.95;

    // Player physics
    this.player = {
      body: null,
      position: { x: 0, y: 10, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      acceleration: { x: 0, y: 0, z: 0 },
      mass: 70, // kg
      radius: 0.8,
      isGrounded: false,
      isOnWall: false,
      wallNormal: { x: 0, y: 0, z: 0 },
      jumpForce: 15,
      wallCrawlForce: 8,
      maxSpeed: 20,
      sprintMultiplier: 1.8,
    };

    // Web swinging physics
    this.webSwing = {
      isActive: false,
      anchorPoint: null,
      ropeLength: 0,
      maxLength: 50,
      minLength: 5,
      swingForce: 25,
      tension: 0,
      angle: 0,
      angularVelocity: 0,
      pendulumDamping: 0.995,
      elasticity: 0.3,
    };

    // Environment physics
    this.environment = {
      buildings: [],
      ground: { y: 0 },
      wind: { x: 0, y: 0, z: 0 },
      weatherEffects: {
        rain: false,
        snow: false,
        windStrength: 0,
      },
    };

    // Collision detection
    this.collisionSystem = {
      spatialGrid: new Map(),
      gridSize: 10,
      activeCollisions: [],
      raycastHits: [],
    };

    // Particle systems
    this.particles = {
      webParticles: [],
      dustParticles: [],
      sparkParticles: [],
      explosionParticles: [],
      weatherParticles: [],
    };

    // Enemy physics
    this.enemies = [];

    // Explosion system
    this.explosions = [];

    this.init();
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  init() {
    console.log("🕸️ Initializing Spider-Man Physics Engine...");

    // Check if Cannon.js is available
    if (typeof CANNON === "undefined") {
      console.error("❌ CANNON.js library not loaded");
      return;
    }

    try {
      // Initialize Cannon.js physics world
      this.initPhysicsWorld();

      // Setup player physics body
      this.initPlayerPhysics();

      // Setup environment physics
      this.initEnvironmentPhysics();

      // Initialize particle systems
      this.initParticleSystems();

      // Setup collision detection
      this.initCollisionSystem();

      this.isInitialized = true;
      console.log("✅ Physics engine initialized successfully!");
    } catch (error) {
      console.error("❌ Failed to initialize physics engine:", error);
    }
  }

  initPhysicsWorld() {
    // Create Cannon.js world
    this.world = new CANNON.World();
    this.world.gravity.set(0, this.GRAVITY, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();

    // Configure world properties
    this.world.solver.iterations = 10;
    this.world.solver.tolerance = 0.1;

    // Set up contact materials
    this.setupContactMaterials();
  }

  setupContactMaterials() {
    // Player material
    this.playerMaterial = new CANNON.Material("player");

    // Ground material
    this.groundMaterial = new CANNON.Material("ground");

    // Wall material
    this.wallMaterial = new CANNON.Material("wall");

    // Web material
    this.webMaterial = new CANNON.Material("web");

    // Contact materials for different interactions
    const playerGroundContact = new CANNON.ContactMaterial(
      this.playerMaterial,
      this.groundMaterial,
      {
        friction: 0.8,
        restitution: 0.1,
      }
    );

    const playerWallContact = new CANNON.ContactMaterial(
      this.playerMaterial,
      this.wallMaterial,
      {
        friction: 0.9,
        restitution: 0.05,
      }
    );

    this.world.addContactMaterial(playerGroundContact);
    this.world.addContactMaterial(playerWallContact);
  }

  initPlayerPhysics() {
    // Create player physics body
    const shape = new CANNON.Sphere(this.player.radius);
    this.player.body = new CANNON.Body({
      mass: this.player.mass,
      material: this.playerMaterial,
    });

    this.player.body.addShape(shape);
    this.player.body.position.set(
      this.player.position.x,
      this.player.position.y,
      this.player.position.z
    );

    // Configure body properties
    this.player.body.linearDamping = 0.1;
    this.player.body.angularDamping = 0.8;
    this.player.body.fixedRotation = true;

    this.world.addBody(this.player.body);

    // Setup collision detection for player
    this.player.body.addEventListener("collide", (event) => {
      this.handlePlayerCollision(event);
    });
  }

  initEnvironmentPhysics() {
    // Create ground plane
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({
      mass: 0,
      material: this.groundMaterial,
    });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2
    );
    this.world.addBody(groundBody);

    // Generate procedural city buildings
    this.generateCityPhysics();
  }

  generateCityPhysics() {
    const citySize = 200;
    const buildingCount = 50;

    for (let i = 0; i < buildingCount; i++) {
      const building = this.createBuildingPhysics({
        x: (Math.random() - 0.5) * citySize,
        y: 0,
        z: (Math.random() - 0.5) * citySize,
        width: 5 + Math.random() * 15,
        height: 10 + Math.random() * 40,
        depth: 5 + Math.random() * 15,
      });

      this.environment.buildings.push(building);
    }
  }

  createBuildingPhysics(config) {
    const shape = new CANNON.Box(
      new CANNON.Vec3(config.width / 2, config.height / 2, config.depth / 2)
    );

    const body = new CANNON.Body({
      mass: 0,
      material: this.wallMaterial,
    });

    body.addShape(shape);
    body.position.set(config.x, config.y + config.height / 2, config.z);

    this.world.addBody(body);

    return {
      body: body,
      config: config,
      isWebAttachable: true,
    };
  }

  initParticleSystems() {
    // Initialize different particle arrays
    this.particles.webParticles = [];
    this.particles.dustParticles = [];
    this.particles.sparkParticles = [];
    this.particles.explosionParticles = [];
    this.particles.weatherParticles = [];
  }

  initCollisionSystem() {
    // Setup spatial partitioning for efficient collision detection
    this.collisionSystem.spatialGrid.clear();
    this.collisionSystem.activeCollisions = [];
  }

  // ==========================================
  // PHYSICS UPDATE LOOP
  // ==========================================

  update(deltaTime) {
    if (!this.isInitialized) return;

    // Clamp delta time to prevent physics instability
    deltaTime = Math.min(deltaTime, 1 / 30);

    // Update player physics
    this.updatePlayerPhysics(deltaTime);

    // Update web swinging physics
    this.updateWebSwingPhysics(deltaTime);

    // Update wall crawling physics
    this.updateWallCrawlingPhysics(deltaTime);

    // Update environment physics
    this.updateEnvironmentPhysics(deltaTime);

    // Update particle systems
    this.updateParticleSystems(deltaTime);

    // Update enemy physics
    this.updateEnemyPhysics(deltaTime);

    // Update explosion physics
    this.updateExplosionPhysics(deltaTime);

    // Step physics simulation
    this.world.step(deltaTime);

    // Update game object positions
    this.syncPhysicsToGame();

    // Perform collision detection
    this.performCollisionDetection();
  }

  updatePlayerPhysics(deltaTime) {
    // Get current player state
    const body = this.player.body;
    const position = body.position;
    const velocity = body.velocity;

    // Apply movement forces based on input
    this.applyMovementForces(deltaTime);

    // Apply special Spider-Man abilities
    this.applySpiderAbilities(deltaTime);

    // Update grounded state
    this.updateGroundedState();

    // Apply air resistance
    if (!this.player.isGrounded && !this.webSwing.isActive) {
      velocity.x *= this.AIR_RESISTANCE;
      velocity.z *= this.AIR_RESISTANCE;
    }

    // Apply ground friction
    if (this.player.isGrounded) {
      velocity.x *= this.GROUND_FRICTION;
      velocity.z *= this.GROUND_FRICTION;
    }

    // Limit maximum speed
    const horizontalSpeed = Math.sqrt(
      velocity.x * velocity.x + velocity.z * velocity.z
    );
    if (horizontalSpeed > this.player.maxSpeed) {
      const ratio = this.player.maxSpeed / horizontalSpeed;
      velocity.x *= ratio;
      velocity.z *= ratio;
    }

    // Update player position in game
    this.player.position = {
      x: position.x,
      y: position.y,
      z: position.z,
    };

    this.player.velocity = {
      x: velocity.x,
      y: velocity.y,
      z: velocity.z,
    };
  }

  applyMovementForces(deltaTime) {
    const movement = this.game.playerMovement;
    if (!movement) return;

    const body = this.player.body;
    const force = new CANNON.Vec3();

    // Calculate movement force based on camera direction
    if (this.game.graphics && this.game.graphics.camera) {
      const cameraDirection = this.game.graphics.getCameraDirection();
      const right = this.game.graphics.getCameraRight();

      // Forward/backward movement
      force.x += movement.z * cameraDirection.x;
      force.z += movement.z * cameraDirection.z;

      // Left/right movement
      force.x += movement.x * right.x;
      force.z += movement.x * right.z;
    } else {
      // Fallback movement
      force.x = movement.x;
      force.z = movement.z;
    }

    // Scale force based on player state
    let forceMultiplier = 500;

    if (this.game.input.keys["shiftleft"] && this.game.gameStats.stamina > 10) {
      forceMultiplier *= this.player.sprintMultiplier;
    }

    if (this.player.isOnWall) {
      forceMultiplier *= 0.7; // Reduced force when wall crawling
    }

    if (!this.player.isGrounded && !this.webSwing.isActive) {
      forceMultiplier *= 0.3; // Air control
    }

    force.scale(forceMultiplier * deltaTime, force);
    body.applyForce(force, body.position);
  }

  applySpiderAbilities(deltaTime) {
    // Enhanced agility - better air control
    if (!this.player.isGrounded && !this.webSwing.isActive) {
      const body = this.player.body;
      const agility = new CANNON.Vec3(0, 0, 0);

      // Air dash ability
      if (this.game.input.keys["space"] && this.game.gameStats.stamina > 20) {
        const movement = this.game.playerMovement;
        if (movement) {
          agility.x = movement.x * 300;
          agility.z = movement.z * 300;
          body.applyImpulse(agility, body.position);

          this.game.consumeStamina(20);
          this.createDashEffect();
        }
      }
    }

    // Spider strength - enhanced jump
    if (this.player.isGrounded && this.shouldApplyJumpForce) {
      this.applyJumpForce();
      this.shouldApplyJumpForce = false;
    }
  }

  updateGroundedState() {
    // Raycast downward to check if player is grounded
    const start = new CANNON.Vec3(
      this.player.body.position.x,
      this.player.body.position.y,
      this.player.body.position.z
    );

    const end = new CANNON.Vec3(
      start.x,
      start.y - (this.player.radius + 0.1),
      start.z
    );

    const result = new CANNON.RaycastResult();
    this.world.raycastClosest(start, end, {}, result);

    this.player.isGrounded = result.hasHit;

    if (this.player.isGrounded && this.player.body.velocity.y < 0.1) {
      // Landing effect
      if (Math.abs(this.player.body.velocity.y) > 10) {
        this.createLandingEffect();
        this.game.addScreenShake(0.3, 200);
      }
    }
  }

  // ==========================================
  // WEB SWINGING PHYSICS
  // ==========================================

  updateWebSwingPhysics(deltaTime) {
    if (!this.webSwing.isActive) return;

    const anchor = this.webSwing.anchorPoint;
    const playerPos = this.player.body.position;

    // Calculate rope vector
    const ropeVector = new CANNON.Vec3(
      anchor.x - playerPos.x,
      anchor.y - playerPos.y,
      anchor.z - playerPos.z
    );

    const currentLength = ropeVector.length();
    this.webSwing.ropeLength = currentLength;

    // Apply web tension force
    if (currentLength > this.webSwing.maxLength) {
      // Rope is taut, apply constraint force
      ropeVector.normalize();

      // Calculate tension based on player velocity
      const velocity = this.player.body.velocity;
      const velocityAlongRope = velocity.dot(ropeVector);

      // Apply pendulum physics
      this.applyPendulumForces(ropeVector, velocityAlongRope, deltaTime);

      // Apply web elasticity
      this.applyWebElasticity(ropeVector, currentLength, deltaTime);
    }

    // Web swing input controls
    this.handleWebSwingInput(deltaTime);

    // Create web swing particles
    this.createWebSwingParticles();
  }

  applyPendulumForces(ropeVector, velocityAlongRope, deltaTime) {
    const body = this.player.body;

    // Calculate centripetal force
    const tangentialVelocity = body.velocity.clone();
    const radialComponent = ropeVector.clone();
    radialComponent.scale(velocityAlongRope, radialComponent);
    tangentialVelocity.vsub(radialComponent, tangentialVelocity);

    const tangentialSpeed = tangentialVelocity.length();
    const centripetalForce =
      (this.player.mass * tangentialSpeed * tangentialSpeed) /
      this.webSwing.ropeLength;

    // Apply tension force toward anchor point
    const tensionForce = ropeVector.clone();
    tensionForce.scale(centripetalForce, tensionForce);
    body.applyForce(tensionForce, body.position);

    // Apply damping to prevent infinite swinging
    const dampingForce = tangentialVelocity.clone();
    dampingForce.scale(-50 * this.player.mass, dampingForce);
    body.applyForce(dampingForce, body.position);
  }

  applyWebElasticity(ropeVector, currentLength, deltaTime) {
    if (currentLength > this.webSwing.maxLength) {
      const stretchAmount = currentLength - this.webSwing.maxLength;
      const elasticForce = ropeVector.clone();
      elasticForce.normalize();
      elasticForce.scale(
        stretchAmount * 1000 * this.WEB_ELASTICITY,
        elasticForce
      );

      this.player.body.applyForce(elasticForce, this.player.body.position);

      // Create stretch particles
      if (stretchAmount > 2) {
        this.createWebStretchParticles();
      }
    }
  }

  handleWebSwingInput(deltaTime) {
    // Web swing boost
    if (this.game.input.keys["space"]) {
      const boostForce = this.player.body.velocity.clone();
      boostForce.normalize();
      boostForce.scale(500 * deltaTime, boostForce);
      this.player.body.applyForce(boostForce, this.player.body.position);

      this.game.consumeStamina(30 * deltaTime);
    }

    // Web length adjustment
    if (this.game.input.keys["keyw"]) {
      this.webSwing.maxLength = Math.max(
        this.webSwing.minLength,
        this.webSwing.maxLength - 20 * deltaTime
      );
    }
    if (this.game.input.keys["keys"]) {
      this.webSwing.maxLength = Math.min(
        50,
        this.webSwing.maxLength + 20 * deltaTime
      );
    }

    // Swing direction control
    const swingForce = new CANNON.Vec3();
    if (this.game.input.keys["keya"]) {
      swingForce.x -= this.webSwing.swingForce;
    }
    if (this.game.input.keys["keyd"]) {
      swingForce.x += this.webSwing.swingForce;
    }

    if (swingForce.length() > 0) {
      swingForce.scale(deltaTime * 100, swingForce);
      this.player.body.applyForce(swingForce, this.player.body.position);
    }
  }

  startWebSwing(anchorPoint) {
    this.webSwing.isActive = true;
    this.webSwing.anchorPoint = anchorPoint;

    // Calculate initial rope length
    const distance = this.calculateDistance(this.player.position, anchorPoint);
    this.webSwing.ropeLength = distance;
    this.webSwing.maxLength = Math.min(distance, 40);

    // Create web line visual
    this.createWebLine(anchorPoint);

    // Apply initial swing momentum
    const swingDirection = this.calculateSwingDirection(anchorPoint);
    const momentum = new CANNON.Vec3(
      swingDirection.x * 5,
      swingDirection.y * 2,
      swingDirection.z * 5
    );

    this.player.body.applyImpulse(momentum, this.player.body.position);

    console.log("🕸️ Web swing started at:", anchorPoint);
  }

  stopWebSwing() {
    if (!this.webSwing.isActive) return;

    this.webSwing.isActive = false;
    this.webSwing.anchorPoint = null;

    // Apply release momentum
    const releaseBoost = this.player.body.velocity.clone();
    releaseBoost.scale(1.2, releaseBoost);
    this.player.body.velocity.copy(releaseBoost);

    console.log("🕸️ Web swing released");
  }

  calculateSwingDirection(anchorPoint) {
    const playerPos = this.player.position;
    const direction = {
      x: anchorPoint.x - playerPos.x,
      y: anchorPoint.y - playerPos.y,
      z: anchorPoint.z - playerPos.z,
    };

    const length = Math.sqrt(
      direction.x * direction.x +
        direction.y * direction.y +
        direction.z * direction.z
    );

    return {
      x: direction.x / length,
      y: direction.y / length,
      z: direction.z / length,
    };
  }

  // ==========================================
  // WALL CRAWLING PHYSICS
  // ==========================================

  updateWallCrawlingPhysics(deltaTime) {
    if (!this.game.mechanics.isWallCrawling) return;

    // Check if still near wall
    const wallInfo = this.checkNearWall();
    if (!wallInfo.nearWall) {
      this.game.stopWallCrawl();
      return;
    }

    this.player.isOnWall = true;
    this.player.wallNormal = wallInfo.normal;

    // Apply wall crawling forces
    this.applyWallCrawlingForces(wallInfo, deltaTime);

    // Create wall crawling particles
    this.createWallCrawlingParticles();
  }

  applyWallCrawlingForces(wallInfo, deltaTime) {
    const body = this.player.body;
    const normal = wallInfo.normal;

    // Apply adhesion force toward wall
    const adhesionForce = new CANNON.Vec3(
      normal.x * -500,
      normal.y * -500,
      normal.z * -500
    );
    body.applyForce(adhesionForce, body.position);

    // Reduce gravity effect
    const antiGravity = new CANNON.Vec3(
      0,
      -this.GRAVITY * 0.7 * this.player.mass,
      0
    );
    body.applyForce(antiGravity, body.position);

    // Apply wall friction for movement
    const velocity = body.velocity;
    const friction = new CANNON.Vec3(
      velocity.x * -200,
      velocity.y * -100,
      velocity.z * -200
    );
    body.applyForce(friction, body.position);
  }

  checkNearWall() {
    const playerPos = this.player.body.position;
    const checkRadius = 2;

    // Cast rays in multiple directions to find walls
    const directions = [
      { x: 1, y: 0, z: 0 }, // Right
      { x: -1, y: 0, z: 0 }, // Left
      { x: 0, y: 0, z: 1 }, // Forward
      { x: 0, y: 0, z: -1 }, // Backward
    ];

    for (let direction of directions) {
      const start = new CANNON.Vec3(playerPos.x, playerPos.y, playerPos.z);
      const end = new CANNON.Vec3(
        playerPos.x + direction.x * checkRadius,
        playerPos.y + direction.y * checkRadius,
        playerPos.z + direction.z * checkRadius
      );

      const result = new CANNON.RaycastResult();
      this.world.raycastClosest(start, end, {}, result);

      if (result.hasHit && result.distance < checkRadius) {
        return {
          nearWall: true,
          normal: result.hitNormalWorld,
          distance: result.distance,
          point: result.hitPointWorld,
        };
      }
    }

    return { nearWall: false };
  }

  // ==========================================
  // JUMP AND MOVEMENT ABILITIES
  // ==========================================

  applyJumpForce() {
    if (!this.player.isGrounded && !this.player.isOnWall) return;

    const body = this.player.body;
    let jumpForce = this.player.jumpForce;

    // Enhanced jump from wall
    if (this.player.isOnWall) {
      jumpForce *= 1.5;

      // Add horizontal component away from wall
      const wallNormal = this.player.wallNormal;
      const horizontalBoost = new CANNON.Vec3(
        wallNormal.x * jumpForce,
        0,
        wallNormal.z * jumpForce
      );
      body.applyImpulse(horizontalBoost, body.position);
    }

    // Vertical jump impulse
    const jumpImpulse = new CANNON.Vec3(0, jumpForce, 0);
    body.applyImpulse(jumpImpulse, body.position);

    // Create jump particles
    this.createJumpParticles();

    console.log("🕷️ Spider jump applied:", jumpForce);
  }

  applySwingMomentum() {
    if (!this.webSwing.isActive) return;

    const body = this.player.body;
    const currentVelocity = body.velocity;

    // Boost forward momentum when releasing web
    const momentumBoost = currentVelocity.clone();
    momentumBoost.scale(1.3, momentumBoost);

    // Add upward component for aerial maneuvers
    momentumBoost.y += 5;

    body.velocity.copy(momentumBoost);

    console.log("🕸️ Swing momentum applied");
  }

  // ==========================================
  // COLLISION DETECTION & RESPONSE
  // ==========================================

  performCollisionDetection() {
    // Update spatial grid
    this.updateSpatialGrid();

    // Check player collisions
    this.checkPlayerCollisions();

    // Check enemy collisions
    this.checkEnemyCollisions();

    // Check projectile collisions
    this.checkProjectileCollisions();
  }

  updateSpatialGrid() {
    this.collisionSystem.spatialGrid.clear();

    // Add player to grid
    this.addToSpatialGrid("player", this.player.position);

    // Add enemies to grid
    for (let enemy of this.enemies) {
      this.addToSpatialGrid("enemy", enemy.position, enemy);
    }

    // Add buildings to grid
    for (let building of this.environment.buildings) {
      this.addToSpatialGrid("building", building.body.position, building);
    }
  }

  addToSpatialGrid(type, position, object = null) {
    const gridX = Math.floor(position.x / this.collisionSystem.gridSize);
    const gridZ = Math.floor(position.z / this.collisionSystem.gridSize);
    const key = `${gridX},${gridZ}`;

    if (!this.collisionSystem.spatialGrid.has(key)) {
      this.collisionSystem.spatialGrid.set(key, []);
    }

    this.collisionSystem.spatialGrid.get(key).push({
      type: type,
      position: position,
      object: object,
    });
  }

  checkPlayerCollisions() {
    const playerGridPos = this.getGridPosition(this.player.position);

    // Check surrounding grid cells
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        const key = `${playerGridPos.x + dx},${playerGridPos.z + dz}`;
        const cellContents = this.collisionSystem.spatialGrid.get(key);

        if (cellContents) {
          for (let item of cellContents) {
            if (item.type === "enemy") {
              this.checkPlayerEnemyCollision(item.object);
            }
          }
        }
      }
    }
  }

  checkPlayerEnemyCollision(enemy) {
    const distance = this.calculateDistance(
      this.player.position,
      enemy.position
    );
    const collisionRadius = this.player.radius + enemy.radius;

    if (distance < collisionRadius) {
      // Handle collision
      this.handlePlayerEnemyCollision(enemy);
    }
  }

  handlePlayerEnemyCollision(enemy) {
    // Apply damage to player
    this.game.takeDamage(enemy.damage || 10);

    // Apply knockback force
    const knockbackDirection = {
      x: this.player.position.x - enemy.position.x,
      y: 0,
      z: this.player.position.z - enemy.position.z,
    };

    const length = Math.sqrt(
      knockbackDirection.x * knockbackDirection.x +
        knockbackDirection.z * knockbackDirection.z
    );
    if (length > 0) {
      knockbackDirection.x /= length;
      knockbackDirection.z /= length;

      const knockbackForce = new CANNON.Vec3(
        knockbackDirection.x * 500,
        200,
        knockbackDirection.z * 500
      );

      this.player.body.applyImpulse(knockbackForce, this.player.body.position);
    }

    // Create collision particles
    this.createCollisionParticles(enemy.position);
  }

  handlePlayerCollision(event) {
    const contact = event.contact;
    const other = event.target === this.player.body ? event.body : event.target;

    // Determine collision type
    if (other.material === this.groundMaterial) {
      // Ground collision
      if (this.player.body.velocity.y < -10) {
        this.createLandingEffect();
      }
    } else if (other.material === this.wallMaterial) {
      // Wall collision
      this.handleWallCollision(contact);
    }
  }

  handleWallCollision(contact) {
    const normal = contact.ni;

    // Check if this could be a wall crawling surface
    if (Math.abs(normal.y) < 0.5) {
      // Mostly vertical surface
      this.player.wallNormal = normal;
    }

    // Create wall impact particles
    this.createWallImpactParticles(contact.ri);
  }

  getGridPosition(position) {
    return {
      x: Math.floor(position.x / this.collisionSystem.gridSize),
      z: Math.floor(position.z / this.collisionSystem.gridSize),
    };
  }

  // ==========================================
  // ENEMY PHYSICS
  // ==========================================

  updateEnemyPhysics(deltaTime) {
    for (let enemy of this.enemies) {
      this.updateSingleEnemyPhysics(enemy, deltaTime);
    }
  }

  updateSingleEnemyPhysics(enemy, deltaTime) {
    if (!enemy.body) return;

    // Apply AI movement forces
    this.applyEnemyAI(enemy, deltaTime);

    // Apply gravity and friction
    this.applyEnemyEnvironmentalForces(enemy, deltaTime);

    // Update enemy state
    enemy.position = {
      x: enemy.body.position.x,
      y: enemy.body.position.y,
      z: enemy.body.position.z,
    };
  }

  applyEnemyAI(enemy, deltaTime) {
    if (!enemy.isAggressive) return;

    // Move toward player
    const direction = {
      x: this.player.position.x - enemy.position.x,
      y: this.player.position.y - enemy.position.y,
      z: this.player.position.z - enemy.position.z,
    };

    const distance = Math.sqrt(
      direction.x * direction.x + direction.z * direction.z
    );

    if (distance > 2 && distance < 50) {
      // Normalize horizontal direction
      direction.x /= distance;
      direction.z /= distance;

      // Apply movement force
      const moveForce = new CANNON.Vec3(
        direction.x * enemy.speed * 100,
        0,
        direction.z * enemy.speed * 100
      );

      enemy.body.applyForce(moveForce, enemy.body.position);
    }

    // Jump if blocked
    if (enemy.body.velocity.length() < 1 && Math.random() < 0.01) {
      const jumpForce = new CANNON.Vec3(0, 300, 0);
      enemy.body.applyImpulse(jumpForce, enemy.body.position);
    }
  }

  applyEnemyEnvironmentalForces(enemy, deltaTime) {
    // Air resistance
    const velocity = enemy.body.velocity;
    const resistance = new CANNON.Vec3(velocity.x * -50, 0, velocity.z * -50);
    enemy.body.applyForce(resistance, enemy.body.position);
  }

  createEnemy(position, config = {}) {
    const enemy = {
      position: { ...position },
      health: config.health || 50,
      damage: config.damage || 10,
      speed: config.speed || 5,
      radius: config.radius || 0.8,
      mass: config.mass || 60,
      isAggressive: config.isAggressive !== false,
      lastAttack: 0,
      attackCooldown: config.attackCooldown || 2000,
    };

    // Create physics body
    const shape = new CANNON.Sphere(enemy.radius);
    enemy.body = new CANNON.Body({
      mass: enemy.mass,
      material: this.playerMaterial,
    });

    enemy.body.addShape(shape);
    enemy.body.position.set(position.x, position.y, position.z);

    this.world.addBody(enemy.body);
    this.enemies.push(enemy);

    return enemy;
  }

  removeEnemy(enemy) {
    const index = this.enemies.indexOf(enemy);
    if (index > -1) {
      this.enemies.splice(index, 1);
      this.world.removeBody(enemy.body);
    }
  }

  // ==========================================
  // EXPLOSION PHYSICS
  // ==========================================

  updateExplosionPhysics(deltaTime) {
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const explosion = this.explosions[i];
      explosion.time += deltaTime;

      if (explosion.time >= explosion.duration) {
        this.explosions.splice(i, 1);
        continue;
      }

      // Apply explosion forces to nearby objects
      this.applyExplosionForces(explosion);
    }
  }

  createExplosion(position, force = 1000, radius = 10) {
    const explosion = {
      position: { ...position },
      force: force,
      radius: radius,
      time: 0,
      duration: 0.5,
    };

    this.explosions.push(explosion);

    // Create explosion particles
    this.createExplosionParticles(position, force);

    console.log("💥 Explosion created at:", position);
  }

  applyExplosionForces(explosion) {
    const explosionPos = new CANNON.Vec3(
      explosion.position.x,
      explosion.position.y,
      explosion.position.z
    );

    // Affect player
    const playerDistance = explosionPos.distanceTo(this.player.body.position);
    if (playerDistance < explosion.radius) {
      this.applyExplosionForceToBody(
        this.player.body,
        explosionPos,
        explosion.force,
        playerDistance,
        explosion.radius
      );
    }

    // Affect enemies
    for (let enemy of this.enemies) {
      const enemyDistance = explosionPos.distanceTo(enemy.body.position);
      if (enemyDistance < explosion.radius) {
        this.applyExplosionForceToBody(
          enemy.body,
          explosionPos,
          explosion.force,
          enemyDistance,
          explosion.radius
        );
      }
    }
  }

  applyExplosionForceToBody(body, explosionPos, force, distance, radius) {
    // Calculate force direction
    const direction = body.position.clone();
    direction.vsub(explosionPos, direction);
    direction.normalize();

    // Calculate force magnitude based on distance
    const forceMagnitude = force * (1 - distance / radius);

    // Apply force
    const explosionForce = direction.clone();
    explosionForce.scale(forceMagnitude, explosionForce);

    body.applyImpulse(explosionForce, body.position);
  }

  // ==========================================
  // PARTICLE SYSTEMS
  // ==========================================

  updateParticleSystems(deltaTime) {
    this.updateWebParticles(deltaTime);
    this.updateDustParticles(deltaTime);
    this.updateSparkParticles(deltaTime);
    this.updateExplosionParticles(deltaTime);
    this.updateWeatherParticles(deltaTime);
  }

  updateWebParticles(deltaTime) {
    for (let i = this.particles.webParticles.length - 1; i >= 0; i--) {
      const particle = this.particles.webParticles[i];

      // Update particle physics
      particle.position.x += particle.velocity.x * deltaTime;
      particle.position.y += particle.velocity.y * deltaTime;
      particle.position.z += particle.velocity.z * deltaTime;

      particle.velocity.y += this.GRAVITY * 0.1 * deltaTime;
      particle.life -= deltaTime;

      if (particle.life <= 0) {
        this.particles.webParticles.splice(i, 1);
      }
    }
  }

  updateDustParticles(deltaTime) {
    for (let i = this.particles.dustParticles.length - 1; i >= 0; i--) {
      const particle = this.particles.dustParticles[i];

      particle.position.x += particle.velocity.x * deltaTime;
      particle.position.y += particle.velocity.y * deltaTime;
      particle.position.z += particle.velocity.z * deltaTime;

      particle.velocity.x *= 0.98;
      particle.velocity.z *= 0.98;
      particle.velocity.y += this.GRAVITY * 0.05 * deltaTime;

      particle.life -= deltaTime;
      particle.opacity = particle.life / particle.maxLife;

      if (particle.life <= 0) {
        this.particles.dustParticles.splice(i, 1);
      }
    }
  }

  updateSparkParticles(deltaTime) {
    for (let i = this.particles.sparkParticles.length - 1; i >= 0; i--) {
      const particle = this.particles.sparkParticles[i];

      particle.position.x += particle.velocity.x * deltaTime;
      particle.position.y += particle.velocity.y * deltaTime;
      particle.position.z += particle.velocity.z * deltaTime;

      particle.velocity.y += this.GRAVITY * 0.3 * deltaTime;
      particle.life -= deltaTime;

      if (particle.life <= 0) {
        this.particles.sparkParticles.splice(i, 1);
      }
    }
  }

  updateExplosionParticles(deltaTime) {
    for (let i = this.particles.explosionParticles.length - 1; i >= 0; i--) {
      const particle = this.particles.explosionParticles[i];

      particle.position.x += particle.velocity.x * deltaTime;
      particle.position.y += particle.velocity.y * deltaTime;
      particle.position.z += particle.velocity.z * deltaTime;

      particle.velocity.x *= 0.95;
      particle.velocity.y *= 0.95;
      particle.velocity.z *= 0.95;

      particle.life -= deltaTime;
      particle.scale += particle.growthRate * deltaTime;
      particle.opacity = particle.life / particle.maxLife;

      if (particle.life <= 0) {
        this.particles.explosionParticles.splice(i, 1);
      }
    }
  }

  updateWeatherParticles(deltaTime) {
    if (
      !this.environment.weatherEffects.rain &&
      !this.environment.weatherEffects.snow
    )
      return;

    for (let i = this.particles.weatherParticles.length - 1; i >= 0; i--) {
      const particle = this.particles.weatherParticles[i];

      particle.position.x += particle.velocity.x * deltaTime;
      particle.position.y += particle.velocity.y * deltaTime;
      particle.position.z += particle.velocity.z * deltaTime;

      // Remove particles that fall below ground
      if (particle.position.y < 0) {
        this.particles.weatherParticles.splice(i, 1);
      }
    }

    // Spawn new weather particles
    this.spawnWeatherParticles();
  }

  // ==========================================
  // PARTICLE CREATION METHODS
  // ==========================================

  createWebSwingParticles() {
    if (!this.webSwing.isActive || Math.random() > 0.3) return;

    const particle = {
      position: { ...this.player.position },
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: Math.random() * 2,
        z: (Math.random() - 0.5) * 2,
      },
      life: 0.5 + Math.random() * 0.5,
      size: 0.1 + Math.random() * 0.1,
      color: { r: 1, g: 1, b: 1, a: 0.8 },
    };

    this.particles.webParticles.push(particle);
  }

  createWebStretchParticles() {
    for (let i = 0; i < 3; i++) {
      const particle = {
        position: { ...this.player.position },
        velocity: {
          x: (Math.random() - 0.5) * 5,
          y: Math.random() * 3,
          z: (Math.random() - 0.5) * 5,
        },
        life: 0.3 + Math.random() * 0.3,
        size: 0.05 + Math.random() * 0.05,
        color: { r: 1, g: 1, b: 1, a: 1 },
      };

      this.particles.webParticles.push(particle);
    }
  }

  createWallCrawlingParticles() {
    if (Math.random() > 0.1) return;

    const particle = {
      position: { ...this.player.position },
      velocity: {
        x: (Math.random() - 0.5) * 1,
        y: Math.random() * 1,
        z: (Math.random() - 0.5) * 1,
      },
      life: 0.3,
      maxLife: 0.3,
      size: 0.05,
      opacity: 0.6,
      color: { r: 0.8, g: 0.6, b: 0.4, a: 0.6 },
    };

    this.particles.dustParticles.push(particle);
  }

  createJumpParticles() {
    for (let i = 0; i < 5; i++) {
      const particle = {
        position: {
          x: this.player.position.x + (Math.random() - 0.5) * 2,
          y: this.player.position.y - 0.5,
          z: this.player.position.z + (Math.random() - 0.5) * 2,
        },
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 2,
          z: (Math.random() - 0.5) * 4,
        },
        life: 0.5,
        maxLife: 0.5,
        size: 0.1,
        opacity: 0.8,
        color: { r: 0.7, g: 0.7, b: 0.7, a: 0.8 },
      };

      this.particles.dustParticles.push(particle);
    }
  }

  createLandingEffect() {
    for (let i = 0; i < 10; i++) {
      const particle = {
        position: {
          x: this.player.position.x + (Math.random() - 0.5) * 3,
          y: this.player.position.y,
          z: this.player.position.z + (Math.random() - 0.5) * 3,
        },
        velocity: {
          x: (Math.random() - 0.5) * 6,
          y: Math.random() * 4,
          z: (Math.random() - 0.5) * 6,
        },
        life: 1.0,
        maxLife: 1.0,
        size: 0.15,
        opacity: 1.0,
        color: { r: 0.6, g: 0.5, b: 0.4, a: 1 },
      };

      this.particles.dustParticles.push(particle);
    }
  }

  createDashEffect() {
    for (let i = 0; i < 8; i++) {
      const particle = {
        position: { ...this.player.position },
        velocity: {
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 4,
          z: (Math.random() - 0.5) * 8,
        },
        life: 0.4,
        size: 0.2,
        color: { r: 0.3, g: 0.8, b: 1, a: 0.9 },
      };

      this.particles.sparkParticles.push(particle);
    }
  }

  createCollisionParticles(position) {
    for (let i = 0; i < 6; i++) {
      const particle = {
        position: { ...position },
        velocity: {
          x: (Math.random() - 0.5) * 5,
          y: Math.random() * 3,
          z: (Math.random() - 0.5) * 5,
        },
        life: 0.6,
        size: 0.1,
        color: { r: 1, g: 0.5, b: 0, a: 0.8 },
      };

      this.particles.sparkParticles.push(particle);
    }
  }

  createWallImpactParticles(position) {
    for (let i = 0; i < 4; i++) {
      const particle = {
        position: { ...position },
        velocity: {
          x: (Math.random() - 0.5) * 3,
          y: Math.random() * 2,
          z: (Math.random() - 0.5) * 3,
        },
        life: 0.4,
        maxLife: 0.4,
        size: 0.08,
        opacity: 0.7,
        color: { r: 0.9, g: 0.9, b: 0.9, a: 0.7 },
      };

      this.particles.dustParticles.push(particle);
    }
  }

  createExplosionParticles(position, force) {
    const particleCount = Math.min(20, Math.floor(force / 50));

    for (let i = 0; i < particleCount; i++) {
      const particle = {
        position: { ...position },
        velocity: {
          x: (Math.random() - 0.5) * 20,
          y: Math.random() * 15,
          z: (Math.random() - 0.5) * 20,
        },
        life: 1.0 + Math.random() * 0.5,
        maxLife: 1.5,
        size: 0.2 + Math.random() * 0.3,
        scale: 1,
        growthRate: 2,
        opacity: 1,
        color: {
          r: 1,
          g: 0.5 + Math.random() * 0.5,
          b: Math.random() * 0.3,
          a: 1,
        },
      };

      this.particles.explosionParticles.push(particle);
    }
  }

  spawnWeatherParticles() {
    if (this.particles.weatherParticles.length > 200) return;

    const playerPos = this.player.position;
    const spawnRadius = 50;

    for (let i = 0; i < 3; i++) {
      const particle = {
        position: {
          x: playerPos.x + (Math.random() - 0.5) * spawnRadius,
          y: playerPos.y + 30 + Math.random() * 20,
          z: playerPos.z + (Math.random() - 0.5) * spawnRadius,
        },
        velocity: {
          x: this.environment.wind.x + (Math.random() - 0.5) * 2,
          y: -5 - Math.random() * 5,
          z: this.environment.wind.z + (Math.random() - 0.5) * 2,
        },
        size: 0.02 + Math.random() * 0.03,
        color: { r: 0.8, g: 0.9, b: 1, a: 0.6 },
      };

      this.particles.weatherParticles.push(particle);
    }
  }

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  calculateDistance(pos1, pos2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  createWebLine(anchorPoint) {
    // This will be handled by the graphics system
    if (this.game.graphics) {
      this.game.graphics.createWebLine(this.player.position, anchorPoint);
    }
  }

  adjustWebLength(delta) {
    if (!this.webSwing.isActive) return;

    this.webSwing.maxLength += delta * 2;
    this.webSwing.maxLength = Math.max(
      this.webSwing.minLength,
      Math.min(50, this.webSwing.maxLength)
    );
  }

  syncPhysicsToGame() {
    // Update game object positions from physics bodies
    if (this.game.graphics && this.game.graphics.player) {
      this.game.graphics.player.position.copy(this.player.body.position);
    }

    // Update enemies
    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      if (this.game.mechanics.enemies[i] && enemy.body) {
        this.game.mechanics.enemies[i].position = {
          x: enemy.body.position.x,
          y: enemy.body.position.y,
          z: enemy.body.position.z,
        };
      }
    }
  }

  reset() {
    // Reset player physics
    this.player.body.position.set(0, 10, 0);
    this.player.body.velocity.set(0, 0, 0);
    this.player.body.angularVelocity.set(0, 0, 0);

    // Reset web swing
    this.webSwing.isActive = false;
    this.webSwing.anchorPoint = null;

    // Clear particles
    this.particles.webParticles = [];
    this.particles.dustParticles = [];
    this.particles.sparkParticles = [];
    this.particles.explosionParticles = [];

    // Reset enemies
    for (let enemy of this.enemies) {
      this.world.removeBody(enemy.body);
    }
    this.enemies = [];

    // Clear explosions
    this.explosions = [];

    console.log("🔄 Physics system reset");
  }

  // ==========================================
  // PUBLIC API METHODS
  // ==========================================

  // Called by main game
  setGravity(gravity) {
    this.GRAVITY = gravity;
    this.world.gravity.set(0, gravity, 0);
  }

  // Called by main game for jumping
  requestJump() {
    this.shouldApplyJumpForce = true;
  }

  // Called by main game for web swinging
  startWebSwinging(anchorPoint) {
    this.startWebSwing(anchorPoint);
  }

  stopWebSwinging() {
    this.stopWebSwing();
  }

  // Called by main game for explosions
  createGameExplosion(position, force = 1000, radius = 10) {
    this.createExplosion(position, force, radius);
  }

  // Called by main game for enemy spawning
  spawnEnemy(position, config = {}) {
    return this.createEnemy(position, config);
  }

  // Weather control
  setWeather(type, intensity = 1) {
    switch (type) {
      case "rain":
        this.environment.weatherEffects.rain = true;
        this.environment.wind.x = intensity * 2;
        break;
      case "snow":
        this.environment.weatherEffects.snow = true;
        this.environment.wind.x = intensity;
        break;
      case "clear":
        this.environment.weatherEffects.rain = false;
        this.environment.weatherEffects.snow = false;
        this.environment.wind.x = 0;
        break;
    }

    this.environment.weatherEffects.windStrength = intensity;
  }

  // Get particle data for rendering
  getParticlesForRendering() {
    return {
      web: this.particles.webParticles,
      dust: this.particles.dustParticles,
      sparks: this.particles.sparkParticles,
      explosions: this.particles.explosionParticles,
      weather: this.particles.weatherParticles,
    };
  }

  // Get physics debug info
  getDebugInfo() {
    return {
      playerVelocity: this.player.body.velocity.length(),
      isGrounded: this.player.isGrounded,
      isSwinging: this.webSwing.isActive,
      webLength: this.webSwing.ropeLength,
      particleCount: Object.values(this.particles).reduce(
        (sum, arr) => sum + arr.length,
        0
      ),
      enemyCount: this.enemies.length,
    };
  }
}

// Export for use by other modules
window.SpiderManPhysics = SpiderManPhysics;
