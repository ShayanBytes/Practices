// ==========================================
// SPIDER-MAN 3D GAME - GRAPHICS ENGINE
// Advanced Three.js Rendering & Visual Effects
// ==========================================

console.log("🎨 Spider-Man Graphics script loaded");

class SpiderManGraphics {
  constructor(game) {
    this.game = game;
    this.isInitialized = false;

    // Three.js core components
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.canvas = null;

    // Player and character models (will be initialized in init())
    this.player = {
      model: null,
      mixer: null,
      animations: {},
      position: { x: 0, y: 10, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    };

    // Camera system (will be initialized in init())
    this.cameraSystem = {
      offset: { x: 0, y: 5, z: 10 },
      lookAtOffset: { x: 0, y: 2, z: 0 },
      smoothness: 0.1,
      rotationX: 0,
      rotationY: 0,
      maxRotationX: Math.PI / 3,
      minRotationX: -Math.PI / 3,
      distance: 10,
      minDistance: 3,
      maxDistance: 20,
      isFirstPerson: false,
      shake: {
        intensity: 0,
        duration: 0,
        elapsed: 0,
        offset: { x: 0, y: 0, z: 0 },
      },
    };

    // Environment
    this.environment = {
      buildings: [],
      ground: null,
      skybox: null,
      city: {
        size: 400,
        buildingCount: 100,
        streetWidth: 8,
        blockSize: 30,
      },
      lighting: {
        ambient: null,
        directional: null,
        pointLights: [],
        spotLights: [],
      },
    };

    // Visual effects
    this.effects = {
      webLines: [],
      explosions: [],
      particles: {
        systems: {},
        geometries: {},
        materials: {},
      },
      postProcessing: {
        composer: null,
        passes: {},
        enabled: true,
      },
      weather: {
        rain: null,
        snow: null,
        fog: null,
      },
    };

    // Materials and shaders
    this.materials = {
      player: null,
      building: null,
      ground: null,
      web: null,
      glass: null,
      metal: null,
      custom: {},
    };

    // Performance settings
    this.performance = {
      shadowMapSize: 1024,
      renderDistance: 200,
      lodLevels: 3,
      particleLimit: 1000,
      fpsTarget: 60,
      adaptiveQuality: true,
    };

    // Asset loading (will be initialized in init())
    this.loaders = {};

    // UI integration (will be initialized in init())
    this.ui = {};

    this.init();
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  init() {
    console.log("🎨 Initializing Spider-Man Graphics Engine...");

    // Check if Three.js is available
    if (typeof THREE === "undefined") {
      console.error("❌ THREE.js library not loaded");
      return;
    }

    try {
      // Initialize Three.js objects now that the library is available
      this.initializeThreeJSObjects();

      // Get canvas element
      this.canvas = this.game.canvas;
      if (!this.canvas) {
        throw new Error("Game canvas not found");
      }

      // Try full initialization first
      this.initFullGraphicsSystem();
    } catch (error) {
      console.error("❌ Full graphics init failed, trying basic mode:", error);
      try {
        this.initBasicGraphicsSystem();
      } catch (basicError) {
        console.error("❌ Basic graphics init also failed:", basicError);
        throw basicError;
      }
    }
  }

  initFullGraphicsSystem() {
    // Initialize Three.js renderer
    this.initRenderer();

    // Create scene
    this.initScene();

    // Setup camera
    this.initCamera();

    // Setup lighting
    this.initLighting();

    // Create materials
    this.initMaterials();

    // Generate environment
    this.initEnvironment();

    // Create player model
    this.initPlayer();

    // Setup post-processing (optional)
    try {
      this.initPostProcessing();
    } catch (error) {
      console.warn("⚠️ Post-processing disabled:", error.message);
    }

    // Initialize particle systems (optional)
    try {
      this.initParticleSystems();
    } catch (error) {
      console.warn("⚠️ Particle systems disabled:", error.message);
    }

    // Setup weather effects (optional)
    try {
      this.initWeatherEffects();
    } catch (error) {
      console.warn("⚠️ Weather effects disabled:", error.message);
    }

    this.isInitialized = true;
    console.log("✅ Full graphics engine initialized successfully!");
  }

  initBasicGraphicsSystem() {
    console.log("🎨 Initializing basic graphics mode...");

    // Get canvas element if not already set
    if (!this.canvas) {
      this.canvas = this.game.canvas;
      if (!this.canvas) {
        throw new Error("Game canvas not found");
      }
    }

    // Create basic renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x87CEEB, 1); // Sky blue instead of dark blue

    // Create basic scene
    this.scene = new THREE.Scene();

    // Create basic camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 10, 20);

    // Add basic lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    this.scene.add(directionalLight);

    // Create basic player (red cube) - handle both object types
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    this.player.model = new THREE.Mesh(geometry, material);
    
    // Set position - handle both plain objects and Vector3
    if (this.player.position.isVector3) {
      this.player.model.position.copy(this.player.position);
    } else {
      this.player.model.position.set(
        this.player.position.x,
        this.player.position.y,
        this.player.position.z
      );
    }
    this.scene.add(this.player.model);

    // Create basic ground
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    this.scene.add(ground);

    // Add some basic buildings for visual interest
    for (let i = 0; i < 5; i++) {
      const buildingGeometry = new THREE.BoxGeometry(4, 8, 4);
      const buildingMaterial = new THREE.MeshLambertMaterial({ 
        color: new THREE.Color().setHSL(Math.random(), 0.5, 0.5)
      });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(
        (Math.random() - 0.5) * 50,
        4,
        (Math.random() - 0.5) * 50
      );
      this.scene.add(building);
    }

    this.isInitialized = true;
    console.log("✅ Basic graphics system initialized!");
    console.log("📊 Scene objects:", this.scene.children.length);
    console.log("📷 Camera position:", this.camera.position);
    console.log("🎮 Player model:", !!this.player.model);
  }

  initializeThreeJSObjects() {
    // Convert plain objects to Three.js objects
    this.player.position = new THREE.Vector3(0, 10, 0);
    this.player.rotation = new THREE.Euler(0, 0, 0);
    this.player.scale = new THREE.Vector3(1, 1, 1);

    this.cameraSystem.offset = new THREE.Vector3(0, 5, 10);
    this.cameraSystem.lookAtOffset = new THREE.Vector3(0, 2, 0);
    this.cameraSystem.shake.offset = new THREE.Vector3();

    // Initialize loaders
    this.loaders = {
      texture: new THREE.TextureLoader(),
      gltf: null, // Will be initialized if available
      font: null, // Will be initialized if available
      audio: new THREE.AudioLoader(),
    };

    // Try to initialize advanced loaders if available
    if (window.THREE && THREE.GLTFLoader) {
      this.loaders.gltf = new THREE.GLTFLoader();
    }
    if (window.THREE && THREE.FontLoader) {
      this.loaders.font = new THREE.FontLoader();
    }

    // Initialize UI integration
    this.ui = {
      raycaster: new THREE.Raycaster(),
      mouse: new THREE.Vector2(),
      intersects: [],
      targetIndicators: [],
    };
  }

  initRenderer() {
    // Create WebGL renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });

    // Configure renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x0a0a1a, 1);

    // Enable shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.shadowMap.autoUpdate = true;

    // Configure rendering settings
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Performance optimizations
    this.renderer.info.autoReset = false;
  }

  initScene() {
    this.scene = new THREE.Scene();

    // Add fog for atmosphere
    this.scene.fog = new THREE.FogExp2(0x1a1a2e, 0.003);

    // Set background
    this.scene.background = new THREE.Color(0x0f0f23);
  }

  initCamera() {
    // Create perspective camera
    this.camera = new THREE.PerspectiveCamera(
      75, // FOV
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near clipping plane
      1000 // Far clipping plane
    );

    // Position camera
    this.camera.position.copy(this.cameraSystem.offset);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Add camera to scene
    this.scene.add(this.camera);
  }

  initLighting() {
    // Ambient light
    this.environment.lighting.ambient = new THREE.AmbientLight(0x404080, 0.3);
    this.scene.add(this.environment.lighting.ambient);

    // Directional light (sun)
    this.environment.lighting.directional = new THREE.DirectionalLight(
      0xffffff,
      1.0
    );
    this.environment.lighting.directional.position.set(50, 100, 50);
    this.environment.lighting.directional.castShadow = true;

    // Configure shadow camera
    const shadowCam = this.environment.lighting.directional.shadow.camera;
    shadowCam.left = -100;
    shadowCam.right = 100;
    shadowCam.top = 100;
    shadowCam.bottom = -100;
    shadowCam.near = 1;
    shadowCam.far = 200;

    this.environment.lighting.directional.shadow.mapSize.width =
      this.performance.shadowMapSize;
    this.environment.lighting.directional.shadow.mapSize.height =
      this.performance.shadowMapSize;

    this.scene.add(this.environment.lighting.directional);

    // City point lights
    this.createCityLights();
  }

  createCityLights() {
    const lightCount = 20;
    const citySize = this.environment.city.size;

    for (let i = 0; i < lightCount; i++) {
      // Street lights
      const streetLight = new THREE.PointLight(0xffaa44, 0.8, 30);
      streetLight.position.set(
        (Math.random() - 0.5) * citySize,
        8 + Math.random() * 5,
        (Math.random() - 0.5) * citySize
      );
      streetLight.castShadow = true;
      streetLight.shadow.mapSize.width = 512;
      streetLight.shadow.mapSize.height = 512;

      this.scene.add(streetLight);
      this.environment.lighting.pointLights.push(streetLight);

      // Building window lights
      if (i < 10) {
        const windowLight = new THREE.PointLight(0x88aaff, 0.5, 20);
        windowLight.position.set(
          (Math.random() - 0.5) * citySize,
          15 + Math.random() * 30,
          (Math.random() - 0.5) * citySize
        );

        this.scene.add(windowLight);
        this.environment.lighting.pointLights.push(windowLight);
      }
    }
  }

  initMaterials() {
    // Player material (Spider-Man suit)
    this.materials.player = new THREE.MeshPhongMaterial({
      color: 0xdc143c,
      shininess: 100,
      specular: 0x333333,
    });

    // Building materials
    this.materials.building = new THREE.MeshLambertMaterial({
      color: 0x666666,
    });

    // Ground material
    this.materials.ground = new THREE.MeshLambertMaterial({
      color: 0x333333,
    });

    // Web material
    this.materials.web = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
      linewidth: 2,
    });

    // Glass material
    this.materials.glass = new THREE.MeshPhysicalMaterial({
      color: 0x88ccff,
      transparent: true,
      opacity: 0.3,
      roughness: 0.1,
      metalness: 0.0,
      transmission: 0.9,
      thickness: 0.5,
    });

    // Metal material
    this.materials.metal = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.8,
      roughness: 0.2,
    });

    // Custom shader materials
    this.createCustomShaders();
  }

  createCustomShaders() {
    // Web swing effect shader
    this.materials.custom.webSwing = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        opacity: { value: 1.0 },
        color: { value: new THREE.Color(0xffffff) },
      },
      vertexShader: `
                varying vec2 vUv;
                varying vec3 vPosition;
                uniform float time;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    
                    vec3 pos = position;
                    pos.x += sin(time * 5.0 + position.y * 0.1) * 0.1;
                    pos.z += cos(time * 5.0 + position.y * 0.1) * 0.1;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
      fragmentShader: `
                uniform float time;
                uniform float opacity;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    float alpha = opacity * (1.0 - vUv.y);
                    alpha *= sin(time * 10.0 + vPosition.y * 0.5) * 0.5 + 0.5;
                    
                    gl_FragColor = vec4(color, alpha);
                }
            `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    // Spider sense effect shader
    this.materials.custom.spiderSense = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        intensity: { value: 1.0 },
        center: { value: new THREE.Vector3(0, 0, 0) },
      },
      vertexShader: `
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    vPosition = position;
                    vNormal = normal;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                uniform float time;
                uniform float intensity;
                uniform vec3 center;
                varying vec3 vPosition;
                varying vec3 vNormal;
                
                void main() {
                    float dist = distance(vPosition, center);
                    float pulse = sin(time * 5.0 - dist * 0.5) * 0.5 + 0.5;
                    float alpha = intensity * pulse * (1.0 - dist * 0.01);
                    
                    vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(1.0, 1.0, 0.0), pulse);
                    gl_FragColor = vec4(color, alpha);
                }
            `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
  }

  initEnvironment() {
    // Create ground
    this.createGround();

    // Generate city buildings
    this.generateCity();

    // Create skybox
    this.createSkybox();

    // Add environmental details
    this.addEnvironmentalDetails();
  }

  createGround() {
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);

    // Add some terrain variation
    const vertices = groundGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      vertices[i + 2] = Math.random() * 0.5; // Small height variations
    }
    groundGeometry.attributes.position.needsUpdate = true;
    groundGeometry.computeVertexNormals();

    this.environment.ground = new THREE.Mesh(
      groundGeometry,
      this.materials.ground
    );
    this.environment.ground.rotation.x = -Math.PI / 2;
    this.environment.ground.receiveShadow = true;

    this.scene.add(this.environment.ground);
  }

  generateCity() {
    const citySize = this.environment.city.size;
    const blockSize = this.environment.city.blockSize;
    const streetWidth = this.environment.city.streetWidth;

    // Create city grid
    for (let x = -citySize / 2; x < citySize / 2; x += blockSize) {
      for (let z = -citySize / 2; z < citySize / 2; z += blockSize) {
        // Skip some blocks for variety
        if (Math.random() < 0.1) continue;

        // Create building in this block
        this.createBuilding({
          x: x + (Math.random() - 0.5) * (blockSize - streetWidth),
          z: z + (Math.random() - 0.5) * (blockSize - streetWidth),
          width: 8 + Math.random() * 12,
          height: 20 + Math.random() * 60,
          depth: 8 + Math.random() * 12,
          style: Math.floor(Math.random() * 3),
        });
      }
    }
  }

  createBuilding(config) {
    let buildingGeometry;

    // Different building styles
    switch (config.style) {
      case 0: // Simple box building
        buildingGeometry = new THREE.BoxGeometry(
          config.width,
          config.height,
          config.depth
        );
        break;
      case 1: // Tapered building
        buildingGeometry = new THREE.CylinderGeometry(
          config.width * 0.7,
          config.width,
          config.height,
          8
        );
        break;
      case 2: // Modern glass building
        buildingGeometry = new THREE.BoxGeometry(
          config.width,
          config.height,
          config.depth
        );
        break;
    }

    // Create building material based on style
    let buildingMaterial;
    if (config.style === 2) {
      buildingMaterial = this.materials.glass;
    } else {
      buildingMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color().setHSL(0, 0, 0.1 + Math.random() * 0.4),
      });
    }

    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(config.x, config.height / 2, config.z);
    building.castShadow = true;
    building.receiveShadow = true;

    // Add building details
    this.addBuildingDetails(building, config);

    this.scene.add(building);
    this.environment.buildings.push({
      mesh: building,
      config: config,
      isWebAttachable: true,
    });
  }

  addBuildingDetails(building, config) {
    // Add windows
    const windowGeometry = new THREE.PlaneGeometry(1, 1.5);
    const windowMaterial = new THREE.MeshBasicMaterial({
      color: Math.random() > 0.7 ? 0xffff88 : 0x001122,
      transparent: true,
      opacity: 0.8,
    });

    // Add windows to building faces
    const windowsPerRow = Math.floor(config.width / 3);
    const windowRows = Math.floor(config.height / 4);

    for (let row = 0; row < windowRows; row++) {
      for (let col = 0; col < windowsPerRow; col++) {
        if (Math.random() < 0.8) {
          // Not all windows are lit
          const window = new THREE.Mesh(windowGeometry, windowMaterial.clone());
          window.position.set(
            (col - windowsPerRow / 2) * 3,
            (row - windowRows / 2) * 4,
            config.depth / 2 + 0.01
          );
          building.add(window);
        }
      }
    }

    // Add rooftop details
    if (Math.random() < 0.3) {
      const antennaGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5);
      const antennaMaterial = this.materials.metal;
      const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
      antenna.position.set(0, config.height / 2 + 2.5, 0);
      building.add(antenna);
    }
  }

  createSkybox() {
    // Create gradient skybox
    const skyboxGeometry = new THREE.SphereGeometry(500, 32, 16);
    const skyboxMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x0077be) },
        bottomColor: { value: new THREE.Color(0x89b2eb) },
        offset: { value: 33 },
        exponent: { value: 0.6 },
      },
      vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
      side: THREE.BackSide,
    });

    this.environment.skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    this.scene.add(this.environment.skybox);
  }

  addEnvironmentalDetails() {
    // Add street lamps
    this.createStreetLamps();

    // Add traffic lights
    this.createTrafficLights();

    // Add vehicles (static for now)
    this.createVehicles();
  }

  createStreetLamps() {
    const lampCount = 30;
    const citySize = this.environment.city.size;

    for (let i = 0; i < lampCount; i++) {
      const lampGroup = new THREE.Group();

      // Lamp post
      const postGeometry = new THREE.CylinderGeometry(0.1, 0.15, 8);
      const postMaterial = this.materials.metal;
      const post = new THREE.Mesh(postGeometry, postMaterial);
      post.position.y = 4;
      post.castShadow = true;

      // Lamp head
      const headGeometry = new THREE.SphereGeometry(0.5);
      const headMaterial = new THREE.MeshBasicMaterial({
        color: 0xffdd88,
        transparent: true,
        opacity: 0.7,
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 8.5;

      lampGroup.add(post);
      lampGroup.add(head);

      // Position in city
      lampGroup.position.set(
        (Math.random() - 0.5) * citySize,
        0,
        (Math.random() - 0.5) * citySize
      );

      this.scene.add(lampGroup);
    }
  }

  createTrafficLights() {
    const lightCount = 15;
    const citySize = this.environment.city.size;

    for (let i = 0; i < lightCount; i++) {
      const trafficLightGroup = new THREE.Group();

      // Main post
      const postGeometry = new THREE.CylinderGeometry(0.2, 0.2, 6);
      const post = new THREE.Mesh(postGeometry, this.materials.metal);
      post.position.y = 3;

      // Light box
      const boxGeometry = new THREE.BoxGeometry(1, 2, 0.5);
      const boxMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
      const lightBox = new THREE.Mesh(boxGeometry, boxMaterial);
      lightBox.position.y = 6;

      // Traffic lights
      const colors = [0xff0000, 0xffff00, 0x00ff00];
      for (let j = 0; j < 3; j++) {
        const lightGeometry = new THREE.CircleGeometry(0.2);
        const lightMaterial = new THREE.MeshBasicMaterial({
          color: j === Math.floor(Math.random() * 3) ? colors[j] : 0x333333,
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(0, 6.5 - j * 0.5, 0.26);
        trafficLightGroup.add(light);
      }

      trafficLightGroup.add(post);
      trafficLightGroup.add(lightBox);

      trafficLightGroup.position.set(
        (Math.random() - 0.5) * citySize * 0.8,
        0,
        (Math.random() - 0.5) * citySize * 0.8
      );

      this.scene.add(trafficLightGroup);
    }
  }

  createVehicles() {
    const vehicleCount = 20;
    const citySize = this.environment.city.size;

    for (let i = 0; i < vehicleCount; i++) {
      const vehicleGroup = new THREE.Group();

      // Car body
      const bodyGeometry = new THREE.BoxGeometry(4, 1.5, 2);
      const bodyMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.5),
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 1;
      body.castShadow = true;

      // Wheels
      const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 8);
      const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });

      const positions = [
        { x: -1.3, z: 0.8 },
        { x: 1.3, z: 0.8 },
        { x: -1.3, z: -0.8 },
        { x: 1.3, z: -0.8 },
      ];

      positions.forEach((pos) => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos.x, 0.3, pos.z);
        wheel.rotation.z = Math.PI / 2;
        vehicleGroup.add(wheel);
      });

      vehicleGroup.add(body);

      vehicleGroup.position.set(
        (Math.random() - 0.5) * citySize * 0.9,
        0,
        (Math.random() - 0.5) * citySize * 0.9
      );
      vehicleGroup.rotation.y = Math.random() * Math.PI * 2;

      this.scene.add(vehicleGroup);
    }
  }

  initPlayer() {
    // Create Spider-Man model
    this.createPlayerModel();

    // Setup animations
    this.setupPlayerAnimations();
  }

  createPlayerModel() {
    // Create a simple Spider-Man representation
    const playerGroup = new THREE.Group();

    // Body
    const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1.2, 4, 8);
    const body = new THREE.Mesh(bodyGeometry, this.materials.player);
    body.castShadow = true;
    body.receiveShadow = true;

    // Head
    const headGeometry = new THREE.SphereGeometry(0.3);
    const headMaterial = new THREE.MeshPhongMaterial({
      color: 0xdc143c,
      shininess: 100,
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1;
    head.castShadow = true;

    // Spider emblem
    const emblemGeometry = new THREE.CircleGeometry(0.15);
    const emblemMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.8,
    });
    const emblem = new THREE.Mesh(emblemGeometry, emblemMaterial);
    emblem.position.set(0, 0.2, 0.41);

    // Arms and legs (simple cylinders for now)
    const limbGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8);
    const limbMaterial = this.materials.player;

    // Arms
    const leftArm = new THREE.Mesh(limbGeometry, limbMaterial);
    leftArm.position.set(-0.6, 0.3, 0);
    leftArm.rotation.z = Math.PI / 6;
    leftArm.castShadow = true;

    const rightArm = new THREE.Mesh(limbGeometry, limbMaterial);
    rightArm.position.set(0.6, 0.3, 0);
    rightArm.rotation.z = -Math.PI / 6;
    rightArm.castShadow = true;

    // Legs
    const leftLeg = new THREE.Mesh(limbGeometry, limbMaterial);
    leftLeg.position.set(-0.2, -0.8, 0);
    leftLeg.castShadow = true;

    const rightLeg = new THREE.Mesh(limbGeometry, limbMaterial);
    rightLeg.position.set(0.2, -0.8, 0);
    rightLeg.castShadow = true;

    playerGroup.add(body);
    playerGroup.add(head);
    playerGroup.add(emblem);
    playerGroup.add(leftArm);
    playerGroup.add(rightArm);
    playerGroup.add(leftLeg);
    playerGroup.add(rightLeg);

    // Position player
    playerGroup.position.copy(this.player.position);

    this.player.model = playerGroup;
    this.scene.add(playerGroup);
  }

  setupPlayerAnimations() {
    // Create simple animation mixer
    this.player.mixer = new THREE.AnimationMixer(this.player.model);

    // Define animation clips (simplified)
    this.player.animations = {
      idle: null,
      running: null,
      jumping: null,
      swinging: null,
      wallCrawling: null,
    };

    // For now, we'll handle animations through direct transforms
    this.currentAnimation = "idle";
    this.animationTime = 0;
  }

  initPostProcessing() {
    if (!window.EffectComposer) {
      console.warn("Post-processing not available - EffectComposer not loaded");
      return;
    }

    // Create composer
    this.effects.postProcessing.composer = new EffectComposer(this.renderer);

    // Render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.effects.postProcessing.composer.addPass(renderPass);

    // Bloom pass
    if (window.UnrealBloomPass) {
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // strength
        0.4, // radius
        0.85 // threshold
      );
      this.effects.postProcessing.composer.addPass(bloomPass);
      this.effects.postProcessing.passes.bloom = bloomPass;
    }

    // FXAA pass
    if (window.ShaderPass && window.FXAAShader) {
      const fxaaPass = new ShaderPass(FXAAShader);
      fxaaPass.material.uniforms["resolution"].value.x = 1 / window.innerWidth;
      fxaaPass.material.uniforms["resolution"].value.y = 1 / window.innerHeight;
      this.effects.postProcessing.composer.addPass(fxaaPass);
      this.effects.postProcessing.passes.fxaa = fxaaPass;
    }
  }

  initParticleSystems() {
    // Web particles
    this.createParticleSystem("web", {
      count: 1000,
      size: 0.1,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });

    // Dust particles
    this.createParticleSystem("dust", {
      count: 500,
      size: 0.05,
      color: 0x888888,
      transparent: true,
      opacity: 0.6,
    });

    // Spark particles
    this.createParticleSystem("sparks", {
      count: 300,
      size: 0.02,
      color: 0xffaa00,
      transparent: true,
      opacity: 1.0,
    });

    // Explosion particles
    this.createParticleSystem("explosions", {
      count: 200,
      size: 0.3,
      color: 0xff4400,
      transparent: true,
      opacity: 1.0,
    });
  }

  createParticleSystem(name, config) {
    // Create geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(config.count * 3);
    const colors = new Float32Array(config.count * 3);
    const sizes = new Float32Array(config.count);
    const alphas = new Float32Array(config.count);

    // Initialize arrays
    for (let i = 0; i < config.count; i++) {
      const i3 = i * 3;

      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;

      const color = new THREE.Color(config.color);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = config.size;
      alphas[i] = 0;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

    // Create material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: this.createParticleTexture() },
        time: { value: 0.0 },
      },
      vertexShader: `
                attribute float size;
                attribute float alpha;
                varying float vAlpha;
                varying vec3 vColor;
                
                void main() {
                    vAlpha = alpha;
                    vColor = color;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
      fragmentShader: `
                uniform sampler2D pointTexture;
                varying float vAlpha;
                varying vec3 vColor;
                
                void main() {
                    gl_FragColor = vec4(vColor, vAlpha);
                    gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
                    
                    if (gl_FragColor.a < 0.001) discard;
                }
            `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true,
    });

    // Create points mesh
    const points = new THREE.Points(geometry, material);
    this.scene.add(points);

    this.effects.particles.systems[name] = {
      mesh: points,
      geometry: geometry,
      material: material,
      config: config,
      activeCount: 0,
    };
  }

  createParticleTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;

    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.5)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  initWeatherEffects() {
    // Initialize rain system
    this.createRainSystem();

    // Initialize snow system
    this.createSnowSystem();

    // Initialize fog
    this.updateFog();
  }

  createRainSystem() {
    const rainCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    const velocities = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = Math.random() * 100;
      positions[i + 2] = (Math.random() - 0.5) * 200;

      velocities[i] = 0;
      velocities[i + 1] = -10 - Math.random() * 10;
      velocities[i + 2] = 0;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
      color: 0x88aaff,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
    });

    this.effects.weather.rain = new THREE.Points(geometry, material);
    this.effects.weather.rain.visible = false;
    this.scene.add(this.effects.weather.rain);
  }

  createSnowSystem() {
    const snowCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(snowCount * 3);

    for (let i = 0; i < snowCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = Math.random() * 100;
      positions[i + 2] = (Math.random() - 0.5) * 200;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.2,
      transparent: true,
      opacity: 0.8,
    });

    this.effects.weather.snow = new THREE.Points(geometry, material);
    this.effects.weather.snow.visible = false;
    this.scene.add(this.effects.weather.snow);
  }

  updateFog() {
    // Dynamic fog based on time of day or weather
    if (this.scene.fog) {
      this.scene.fog.density = 0.003; // Base density
    }
  }

  // ==========================================
  // RENDER LOOP
  // ==========================================

  render() {
    if (!this.isInitialized) {
      console.warn("⚠️ Graphics not initialized, skipping render");
      return;
    }

    if (!this.scene || !this.camera || !this.renderer) {
      console.error("❌ Missing essential graphics components:", {
        scene: !!this.scene,
        camera: !!this.camera,
        renderer: !!this.renderer,
      });
      return;
    }

    try {
      try {
        // Update animations
        this.updateAnimations();
      } catch (error) {
        console.warn("⚠️ Animation update error:", error);
      }

      try {
        // Update camera
        this.updateCamera();
      } catch (error) {
        console.warn("⚠️ Camera update error:", error);
      }

      try {
        // Update effects
        this.updateEffects();
      } catch (error) {
        console.warn("⚠️ Effects update error:", error);
      }

      try {
        // Update particles
        this.updateParticleRendering();
      } catch (error) {
        console.warn("⚠️ Particle update error:", error);
      }

      try {
        // Update weather
        this.updateWeatherRendering();
      } catch (error) {
        console.warn("⚠️ Weather update error:", error);
      }

      try {
        // Update materials
        this.updateMaterials();
      } catch (error) {
        console.warn("⚠️ Material update error:", error);
      }

      // Render scene
      if (
        this.effects.postProcessing.enabled &&
        this.effects.postProcessing.composer
      ) {
        this.effects.postProcessing.composer.render();
      } else {
        this.renderer.render(this.scene, this.camera);
      }

      // Update renderer info
      this.renderer.info.reset();
    } catch (error) {
      console.error("❌ Graphics render error:", error);
    }
  }

  updateAnimations() {
    const deltaTime = this.game.performance.deltaTime;
    this.animationTime += deltaTime;

    if (this.player.mixer) {
      this.player.mixer.update(deltaTime);
    }

    // Simple procedural animations
    this.updatePlayerAnimation();
  }

  updatePlayerAnimation() {
    if (!this.player.model) return;

    const time = this.animationTime;
    const playerMovement = this.game.playerMovement;

    // Simple walking animation
    if (
      playerMovement &&
      (Math.abs(playerMovement.x) > 0.1 || Math.abs(playerMovement.z) > 0.1)
    ) {
      // Walking/running animation
      const bobAmount = 0.1;
      const bobSpeed = 10;

      this.player.model.position.y =
        this.player.position.y + Math.sin(time * bobSpeed) * bobAmount;
      this.player.model.rotation.z = Math.sin(time * bobSpeed * 0.5) * 0.05;
    } else {
      // Idle animation
      const idleBob = 0.02;
      const idleSpeed = 2;

      this.player.model.position.y =
        this.player.position.y + Math.sin(time * idleSpeed) * idleBob;
    }

    // Web swinging animation
    if (this.game.mechanics.isSwinging) {
      this.player.model.rotation.x = Math.sin(time * 5) * 0.2;
      this.player.model.rotation.z = Math.cos(time * 3) * 0.1;
    }

    // Wall crawling animation
    if (this.game.mechanics.isWallCrawling) {
      this.player.model.rotation.x = Math.PI / 4; // Leaning against wall
    }
  }

  updateCamera() {
    if (!this.camera || !this.player.model) return;

    const deltaTime = this.game.performance.deltaTime;
    const smoothness = this.cameraSystem.smoothness;

    // Calculate target camera position
    const targetPosition = new THREE.Vector3();
    targetPosition.copy(this.player.model.position);
    
    // Add offset - handle both Vector3 and plain objects
    if (this.cameraSystem.offset.isVector3) {
      targetPosition.add(this.cameraSystem.offset);
    } else {
      targetPosition.x += this.cameraSystem.offset.x;
      targetPosition.y += this.cameraSystem.offset.y;
      targetPosition.z += this.cameraSystem.offset.z;
    }

    // Apply camera shake
    if (this.cameraSystem.shake.duration > 0) {
      this.updateCameraShake(deltaTime);
      if (this.cameraSystem.shake.offset.isVector3) {
        targetPosition.add(this.cameraSystem.shake.offset);
      } else {
        targetPosition.x += this.cameraSystem.shake.offset.x;
        targetPosition.y += this.cameraSystem.shake.offset.y;
        targetPosition.z += this.cameraSystem.shake.offset.z;
      }
    }

    // Smooth camera movement
    this.camera.position.lerp(targetPosition, smoothness);

    // Calculate look-at position
    const lookAtTarget = new THREE.Vector3();
    lookAtTarget.copy(this.player.model.position);
    
    // Add look-at offset
    if (this.cameraSystem.lookAtOffset.isVector3) {
      lookAtTarget.add(this.cameraSystem.lookAtOffset);
    } else {
      lookAtTarget.x += this.cameraSystem.lookAtOffset.x;
      lookAtTarget.y += this.cameraSystem.lookAtOffset.y;
      lookAtTarget.z += this.cameraSystem.lookAtOffset.z;
    }

    this.camera.lookAt(lookAtTarget);

    // Update camera system position
    this.updateCameraPosition();
  }

  updateCameraPosition() {
    // Apply mouse rotation
    const rotation = new THREE.Euler(
      this.cameraSystem.rotationX,
      this.cameraSystem.rotationY,
      0,
      "YXZ"
    );

    // Calculate offset based on rotation
    const offset = new THREE.Vector3(0, 5, 10);
    offset.applyEuler(rotation);

    this.cameraSystem.offset.copy(offset);
  }

  updateCameraShake(deltaTime) {
    const shake = this.cameraSystem.shake;

    shake.elapsed += deltaTime;

    if (shake.elapsed >= shake.duration) {
      shake.intensity = 0;
      shake.duration = 0;
      shake.elapsed = 0;
      shake.offset.set(0, 0, 0);
    } else {
      const progress = shake.elapsed / shake.duration;
      const currentIntensity = shake.intensity * (1 - progress);

      shake.offset.set(
        (Math.random() - 0.5) * currentIntensity,
        (Math.random() - 0.5) * currentIntensity,
        (Math.random() - 0.5) * currentIntensity
      );
    }
  }

  updateEffects() {
    const time = this.game.performance.lastTime * 0.001;

    // Update web line effects
    this.updateWebLines();

    // Update explosion effects
    this.updateExplosionEffects();

    // Update custom shader uniforms
    this.updateShaderUniforms(time);
  }

  updateWebLines() {
    // Clear old web lines
    this.effects.webLines = this.effects.webLines.filter((webLine) => {
      if (webLine.age > webLine.maxAge) {
        this.scene.remove(webLine.mesh);
        return false;
      }

      webLine.age += this.game.performance.deltaTime;
      webLine.mesh.material.opacity = 1 - webLine.age / webLine.maxAge;

      return true;
    });
  }

  updateExplosionEffects() {
    // Update explosion visuals
    this.effects.explosions = this.effects.explosions.filter((explosion) => {
      explosion.time += this.game.performance.deltaTime;

      if (explosion.time >= explosion.duration) {
        this.scene.remove(explosion.mesh);
        return false;
      }

      // Update explosion scale and opacity
      const progress = explosion.time / explosion.duration;
      explosion.mesh.scale.setScalar(
        explosion.startScale + progress * explosion.growthRate
      );
      explosion.mesh.material.opacity = 1 - progress;

      return true;
    });
  }

  updateShaderUniforms(time) {
    // Update web swing shader
    if (this.materials.custom.webSwing) {
      this.materials.custom.webSwing.uniforms.time.value = time;
    }

    // Update spider sense shader
    if (this.materials.custom.spiderSense) {
      this.materials.custom.spiderSense.uniforms.time.value = time;
      this.materials.custom.spiderSense.uniforms.intensity.value = this.game
        .mechanics.isSpiderSenseActive
        ? 1.0
        : 0.0;
    }
  }

  updateParticleRendering() {
    const time = this.game.performance.lastTime * 0.001;

    // Get particles from physics system
    if (this.game.physics) {
      const physicsParticles = this.game.physics.getParticlesForRendering();

      // Update each particle system
      Object.keys(physicsParticles).forEach((type) => {
        this.updateParticleSystem(type, physicsParticles[type], time);
      });
    }
  }

  updateParticleSystem(type, particles, time) {
    const system = this.effects.particles.systems[type];
    if (!system) return;

    const positions = system.geometry.attributes.position.array;
    const alphas = system.geometry.attributes.alpha.array;

    // Reset all particles to invisible
    for (let i = 0; i < alphas.length; i++) {
      alphas[i] = 0;
    }

    // Update active particles
    for (let i = 0; i < Math.min(particles.length, system.config.count); i++) {
      const particle = particles[i];
      const i3 = i * 3;

      positions[i3] = particle.position.x;
      positions[i3 + 1] = particle.position.y;
      positions[i3 + 2] = particle.position.z;

      alphas[i] = particle.opacity || particle.life || 1.0;
    }

    system.geometry.attributes.position.needsUpdate = true;
    system.geometry.attributes.alpha.needsUpdate = true;

    // Update material uniforms
    system.material.uniforms.time.value = time;
  }

  updateWeatherRendering() {
    const deltaTime = this.game.performance.deltaTime;

    // Update rain
    if (this.effects.weather.rain && this.effects.weather.rain.visible) {
      this.updateRainParticles(deltaTime);
    }

    // Update snow
    if (this.effects.weather.snow && this.effects.weather.snow.visible) {
      this.updateSnowParticles(deltaTime);
    }
  }

  updateRainParticles(deltaTime) {
    const positions =
      this.effects.weather.rain.geometry.attributes.position.array;
    const velocities =
      this.effects.weather.rain.geometry.attributes.velocity.array;

    for (let i = 0; i < positions.length; i += 3) {
      // Update position
      positions[i] += velocities[i] * deltaTime;
      positions[i + 1] += velocities[i + 1] * deltaTime;
      positions[i + 2] += velocities[i + 2] * deltaTime;

      // Reset if below ground
      if (positions[i + 1] < 0) {
        positions[i] = (Math.random() - 0.5) * 200;
        positions[i + 1] = 50 + Math.random() * 50;
        positions[i + 2] = (Math.random() - 0.5) * 200;
      }
    }

    this.effects.weather.rain.geometry.attributes.position.needsUpdate = true;
  }

  updateSnowParticles(deltaTime) {
    const positions =
      this.effects.weather.snow.geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
      // Update position with gentle falling motion
      positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.5 * deltaTime;
      positions[i + 1] -= 2 * deltaTime;
      positions[i + 2] += Math.cos(Date.now() * 0.001 + i) * 0.3 * deltaTime;

      // Reset if below ground
      if (positions[i + 1] < 0) {
        positions[i] = (Math.random() - 0.5) * 200;
        positions[i + 1] = 50 + Math.random() * 50;
        positions[i + 2] = (Math.random() - 0.5) * 200;
      }
    }

    this.effects.weather.snow.geometry.attributes.position.needsUpdate = true;
  }

  updateMaterials() {
    // Update time-based material properties
    const time = this.game.performance.lastTime * 0.001;

    // Animate building window lights
    this.environment.buildings.forEach((building) => {
      building.mesh.children.forEach((child) => {
        if (child.material && child.material.color) {
          // Flicker lights occasionally
          if (Math.random() < 0.001) {
            child.material.color.setHex(
              Math.random() > 0.7 ? 0xffff88 : 0x001122
            );
          }
        }
      });
    });
  }

  // ==========================================
  // PUBLIC API METHODS
  // ==========================================

  // Camera control
  updateCameraRotation(deltaX, deltaY) {
    this.cameraSystem.rotationY -= deltaX * 0.002;
    this.cameraSystem.rotationX -= deltaY * 0.002;

    // Clamp vertical rotation
    this.cameraSystem.rotationX = Math.max(
      this.cameraSystem.minRotationX,
      Math.min(this.cameraSystem.maxRotationX, this.cameraSystem.rotationX)
    );
  }

  getCameraDirection() {
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    return direction;
  }

  getCameraRight() {
    const right = new THREE.Vector3();
    right.crossVectors(this.camera.up, this.getCameraDirection());
    return right;
  }

  getPlayerLookDirection() {
    return this.getCameraDirection();
  }

  // Web effects
  createWebLine(startPos, endPos) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array([
      startPos.x,
      startPos.y,
      startPos.z,
      endPos.x,
      endPos.y,
      endPos.z,
    ]);

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = this.materials.custom.webSwing.clone();
    const line = new THREE.Line(geometry, material);

    this.scene.add(line);

    const webLine = {
      mesh: line,
      age: 0,
      maxAge: 2.0,
    };

    this.effects.webLines.push(webLine);
  }

  createWebProjectile(projectile) {
    const geometry = new THREE.SphereGeometry(0.05);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      projectile.position.x,
      projectile.position.y,
      projectile.position.z
    );

    this.scene.add(mesh);

    // Animate projectile
    const animate = () => {
      projectile.position.x +=
        projectile.direction.x * projectile.speed * 0.016;
      projectile.position.y +=
        projectile.direction.y * projectile.speed * 0.016;
      projectile.position.z +=
        projectile.direction.z * projectile.speed * 0.016;

      mesh.position.set(
        projectile.position.x,
        projectile.position.y,
        projectile.position.z
      );

      projectile.time += 0.016;

      if (projectile.time < projectile.maxTime) {
        requestAnimationFrame(animate);
      } else {
        this.scene.remove(mesh);
      }
    };

    animate();
  }

  // Explosion effects
  createExplosion(position, force = 1000) {
    const geometry = new THREE.SphereGeometry(1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff4400,
      transparent: true,
      opacity: 1.0,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);

    this.scene.add(mesh);

    const explosion = {
      mesh: mesh,
      time: 0,
      duration: 1.0,
      startScale: 0.1,
      growthRate: Math.max(5, force / 200),
    };

    this.effects.explosions.push(explosion);
  }

  // Screen effects
  addScreenShake(intensity, duration) {
    this.cameraSystem.shake.intensity = intensity;
    this.cameraSystem.shake.duration = duration / 1000; // Convert to seconds
    this.cameraSystem.shake.elapsed = 0;
  }

  // Web attachment point finding
  findWebAttachPoint() {
    const playerPos = this.player.model.position;
    const direction = this.getCameraDirection();

    // Raycast to find suitable attachment points
    this.ui.raycaster.set(playerPos, direction);

    const intersects = this.ui.raycaster.intersectObjects(
      this.environment.buildings.map((b) => b.mesh),
      true
    );

    if (intersects.length > 0) {
      const hit = intersects[0];
      return {
        x: hit.point.x,
        y: hit.point.y,
        z: hit.point.z,
      };
    }

    // Fallback: random point above player
    return {
      x: playerPos.x + (Math.random() - 0.5) * 50,
      y: playerPos.y + 20 + Math.random() * 30,
      z: playerPos.z + (Math.random() - 0.5) * 50,
    };
  }

  // World to screen conversion
  worldToScreen(worldPosition) {
    const vector = new THREE.Vector3(
      worldPosition.x,
      worldPosition.y,
      worldPosition.z
    );

    vector.project(this.camera);

    return {
      x: ((vector.x + 1) / 2) * window.innerWidth,
      y: ((-vector.y + 1) / 2) * window.innerHeight,
    };
  }

  // Settings application
  applySettings(settings) {
    // Update shadow quality
    this.renderer.shadowMap.enabled = settings.shadows;

    // Update resolution
    if (settings.resolution) {
      const [width, height] = settings.resolution.split("x").map(Number);
      this.resize(width, height);
    }

    // Update post-processing
    if (this.effects.postProcessing.composer) {
      this.effects.postProcessing.enabled = settings.antiAliasing;
    }

    // Update particle limits
    if (settings.particles) {
      this.performance.particleLimit =
        settings.quality === "high"
          ? 2000
          : settings.quality === "medium"
          ? 1000
          : 500;
    }
  }

  // Weather control
  setWeather(type, intensity = 1) {
    switch (type) {
      case "rain":
        this.effects.weather.rain.visible = true;
        this.effects.weather.snow.visible = false;
        this.scene.fog.density = 0.005 * intensity;
        break;
      case "snow":
        this.effects.weather.snow.visible = true;
        this.effects.weather.rain.visible = false;
        this.scene.fog.density = 0.004 * intensity;
        break;
      case "clear":
        this.effects.weather.rain.visible = false;
        this.effects.weather.snow.visible = false;
        this.scene.fog.density = 0.003;
        break;
    }
  }

  // Resize handling
  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);

    if (this.effects.postProcessing.composer) {
      this.effects.postProcessing.composer.setSize(width, height);
    }

    // Update FXAA resolution
    if (this.effects.postProcessing.passes.fxaa) {
      this.effects.postProcessing.passes.fxaa.material.uniforms[
        "resolution"
      ].value.x = 1 / width;
      this.effects.postProcessing.passes.fxaa.material.uniforms[
        "resolution"
      ].value.y = 1 / height;
    }
  }

  // Reset graphics system
  reset() {
    // Reset player position
    this.player.model.position.set(0, 10, 0);
    this.player.model.rotation.set(0, 0, 0);

    // Clear effects
    this.effects.webLines.forEach((webLine) => {
      this.scene.remove(webLine.mesh);
    });
    this.effects.webLines = [];

    this.effects.explosions.forEach((explosion) => {
      this.scene.remove(explosion.mesh);
    });
    this.effects.explosions = [];

    // Reset camera
    this.cameraSystem.rotationX = 0;
    this.cameraSystem.rotationY = 0;
    this.cameraSystem.shake.intensity = 0;

    console.log("🔄 Graphics system reset");
  }

  // Performance monitoring
  getPerformanceInfo() {
    return {
      triangles: this.renderer.info.render.triangles,
      calls: this.renderer.info.render.calls,
      points: this.renderer.info.render.points,
      lines: this.renderer.info.render.lines,
      memory: this.renderer.info.memory,
    };
  }
}

// Export for use by other modules
window.SpiderManGraphics = SpiderManGraphics;
