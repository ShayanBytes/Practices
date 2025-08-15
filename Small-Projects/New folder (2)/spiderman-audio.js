// ==========================================
// SPIDER-MAN 3D GAME - AUDIO ENGINE
// Advanced Web Audio API & Sound Management
// ==========================================

console.log("🔊 Spider-Man Audio script loaded");

class SpiderManAudio {
  constructor(game) {
    this.game = game;
    this.isInitialized = false;

    // Web Audio API components
    this.audioContext = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.compressor = null;
    this.reverb = null;
    this.analyser = null;

    // Audio sources and buffers
    this.audioBuffers = new Map();
    this.activeSources = new Map();
    this.musicSources = new Map();
    this.loadingPromises = new Map();

    // 3D Audio system
    this.spatialAudio = {
      listener: null,
      panners: new Map(),
      maxDistance: 100,
      refDistance: 10,
      rolloffFactor: 1,
      coneInnerAngle: 360,
      coneOuterAngle: 0,
      coneOuterGain: 0,
    };

    // Audio settings
    this.settings = {
      masterVolume: 0.8,
      musicVolume: 0.6,
      sfxVolume: 0.9,
      enabled: true,
      spatialAudioEnabled: true,
      reverbEnabled: true,
      compressionEnabled: true,
    };

    // Sound effect definitions
    this.soundEffects = {
      // Movement sounds
      jump: { file: "sounds/jump.mp3", volume: 0.7, pitch: 1.0, loop: false },
      land: { file: "sounds/land.mp3", volume: 0.8, pitch: 1.0, loop: false },
      footstep: {
        file: "sounds/footstep.mp3",
        volume: 0.4,
        pitch: 1.0,
        loop: false,
      },
      wallCrawl: {
        file: "sounds/wall_crawl.mp3",
        volume: 0.5,
        pitch: 1.0,
        loop: true,
      },

      // Web swinging sounds
      webSwing: {
        file: "sounds/web_swing.mp3",
        volume: 0.9,
        pitch: 1.0,
        loop: false,
      },
      webShoot: {
        file: "sounds/web_shoot.mp3",
        volume: 0.8,
        pitch: 1.0,
        loop: false,
      },
      webZip: {
        file: "sounds/web_zip.mp3",
        volume: 0.7,
        pitch: 1.0,
        loop: false,
      },
      webAttach: {
        file: "sounds/web_attach.mp3",
        volume: 0.6,
        pitch: 1.0,
        loop: false,
      },

      // Combat sounds
      punch: { file: "sounds/punch.mp3", volume: 0.8, pitch: 1.0, loop: false },
      kick: { file: "sounds/kick.mp3", volume: 0.7, pitch: 1.0, loop: false },
      block: { file: "sounds/block.mp3", volume: 0.6, pitch: 1.0, loop: false },
      hit: { file: "sounds/hit.mp3", volume: 0.9, pitch: 1.0, loop: false },

      // Environment sounds
      explosion: {
        file: "sounds/explosion.mp3",
        volume: 1.0,
        pitch: 1.0,
        loop: false,
      },
      glass_break: {
        file: "sounds/glass_break.mp3",
        volume: 0.8,
        pitch: 1.0,
        loop: false,
      },
      metal_clang: {
        file: "sounds/metal_clang.mp3",
        volume: 0.7,
        pitch: 1.0,
        loop: false,
      },
      wind: { file: "sounds/wind.mp3", volume: 0.3, pitch: 1.0, loop: true },

      // UI sounds
      menu_select: {
        file: "sounds/menu_select.mp3",
        volume: 0.5,
        pitch: 1.0,
        loop: false,
      },
      menu_confirm: {
        file: "sounds/menu_confirm.mp3",
        volume: 0.6,
        pitch: 1.0,
        loop: false,
      },
      achievement: {
        file: "sounds/achievement.mp3",
        volume: 0.8,
        pitch: 1.0,
        loop: false,
      },
      pickup: {
        file: "sounds/pickup.mp3",
        volume: 0.7,
        pitch: 1.0,
        loop: false,
      },

      // Spider-Man specific
      spiderSense: {
        file: "sounds/spider_sense.mp3",
        volume: 0.9,
        pitch: 1.0,
        loop: false,
      },
      thwip: { file: "sounds/thwip.mp3", volume: 0.8, pitch: 1.0, loop: false },
      quip: { file: "sounds/quip.mp3", volume: 0.7, pitch: 1.0, loop: false },

      // Enemy sounds
      enemyHit: {
        file: "sounds/enemy_hit.mp3",
        volume: 0.8,
        pitch: 1.0,
        loop: false,
      },
      enemyDefeated: {
        file: "sounds/enemy_defeated.mp3",
        volume: 0.9,
        pitch: 1.0,
        loop: false,
      },
      enemyAttack: {
        file: "sounds/enemy_attack.mp3",
        volume: 0.7,
        pitch: 1.0,
        loop: false,
      },

      // Game state sounds
      gameOver: {
        file: "sounds/game_over.mp3",
        volume: 0.9,
        pitch: 1.0,
        loop: false,
      },
      levelUp: {
        file: "sounds/level_up.mp3",
        volume: 0.8,
        pitch: 1.0,
        loop: false,
      },
      reload: {
        file: "sounds/reload.mp3",
        volume: 0.6,
        pitch: 1.0,
        loop: false,
      },
    };

    // Music tracks
    this.musicTracks = {
      menu: { file: "music/menu_theme.mp3", volume: 0.7, loop: true },
      gameplay: { file: "music/gameplay_theme.mp3", volume: 0.6, loop: true },
      combat: { file: "music/combat_theme.mp3", volume: 0.8, loop: true },
      swinging: { file: "music/swinging_theme.mp3", volume: 0.7, loop: true },
      boss: { file: "music/boss_theme.mp3", volume: 0.9, loop: true },
      victory: { file: "music/victory_theme.mp3", volume: 0.8, loop: false },
      ambient: { file: "music/ambient_city.mp3", volume: 0.4, loop: true },
    };

    // Dynamic audio system
    this.dynamicAudio = {
      currentMusicTrack: null,
      musicCrossfading: false,
      crossfadeTime: 2.0,
      adaptiveVolume: true,
      musicLayers: new Map(),
      ambientSounds: new Map(),
    };

    // Audio effects processing
    this.effects = {
      echo: null,
      lowpass: null,
      highpass: null,
      distortion: null,
      chorus: null,
      flanger: null,
      pitch: null,
    };

    // Performance monitoring
    this.performance = {
      activeSources: 0,
      maxSources: 32,
      memoryUsage: 0,
      processingLoad: 0,
    };

    // Audio visualization
    this.visualization = {
      enabled: false,
      fftSize: 1024,
      dataArray: null,
      canvas: null,
      context: null,
    };

    this.init();
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================

  async init() {
    console.log("🔊 Initializing Spider-Man Audio Engine...");

    try {
      // Initialize Web Audio API
      await this.initAudioContext();

      // Setup audio graph
      this.setupAudioGraph();

      // Initialize 3D audio
      this.init3DAudio();

      // Setup audio effects
      this.setupAudioEffects();

      // Load essential audio files
      await this.loadEssentialAudio();

      // Setup dynamic audio system
      this.setupDynamicAudio();

      // Initialize audio visualization
      this.initAudioVisualization();

      this.isInitialized = true;
      console.log("✅ Audio engine initialized successfully!");
    } catch (error) {
      console.error("❌ Failed to initialize audio engine:", error);
      this.settings.enabled = false;
    }
  }

  async initAudioContext() {
    // Create audio context with optimal settings
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      throw new Error("Web Audio API not supported");
    }

    this.audioContext = new AudioContext({
      latencyHint: "interactive",
      sampleRate: 44100,
    });

    // Handle audio context state
    if (this.audioContext.state === "suspended") {
      // Audio context is suspended, will be resumed on user interaction
      this.setupUserActivation();
    }
  }

  setupUserActivation() {
    const resumeAudio = async () => {
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
        console.log("🔊 Audio context resumed");
      }

      // Remove event listeners after first activation
      document.removeEventListener("click", resumeAudio);
      document.removeEventListener("keydown", resumeAudio);
    };

    document.addEventListener("click", resumeAudio);
    document.addEventListener("keydown", resumeAudio);
  }

  setupAudioGraph() {
    // Create master gain node
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = this.settings.masterVolume;

    // Create music gain node
    this.musicGain = this.audioContext.createGain();
    this.musicGain.gain.value = this.settings.musicVolume;

    // Create SFX gain node
    this.sfxGain = this.audioContext.createGain();
    this.sfxGain.gain.value = this.settings.sfxVolume;

    // Create compressor for dynamic range control
    this.compressor = this.audioContext.createDynamicsCompressor();
    this.compressor.threshold.value = -24;
    this.compressor.knee.value = 30;
    this.compressor.ratio.value = 12;
    this.compressor.attack.value = 0.003;
    this.compressor.release.value = 0.25;

    // Create analyser for visualization
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = this.visualization.fftSize;
    this.analyser.smoothingTimeConstant = 0.8;

    // Connect audio graph
    this.musicGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);

    if (this.settings.compressionEnabled) {
      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
    } else {
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
    }
  }

  init3DAudio() {
    if (!this.settings.spatialAudioEnabled) return;

    // Create 3D audio listener
    this.spatialAudio.listener = this.audioContext.listener;

    // Set up listener properties
    if (this.spatialAudio.listener.forwardX) {
      // Modern API
      this.spatialAudio.listener.forwardX.value = 0;
      this.spatialAudio.listener.forwardY.value = 0;
      this.spatialAudio.listener.forwardZ.value = -1;
      this.spatialAudio.listener.upX.value = 0;
      this.spatialAudio.listener.upY.value = 1;
      this.spatialAudio.listener.upZ.value = 0;
    } else {
      // Legacy API
      this.spatialAudio.listener.setOrientation(0, 0, -1, 0, 1, 0);
    }
  }

  setupAudioEffects() {
    // Create reverb impulse response
    this.createReverbImpulse();

    // Create low-pass filter
    this.effects.lowpass = this.audioContext.createBiquadFilter();
    this.effects.lowpass.type = "lowpass";
    this.effects.lowpass.frequency.value = 20000;
    this.effects.lowpass.Q.value = 1;

    // Create high-pass filter
    this.effects.highpass = this.audioContext.createBiquadFilter();
    this.effects.highpass.type = "highpass";
    this.effects.highpass.frequency.value = 20;
    this.effects.highpass.Q.value = 1;

    // Create echo effect
    this.createEchoEffect();

    // Create chorus effect
    this.createChorusEffect();
  }

  createReverbImpulse() {
    if (!this.settings.reverbEnabled) return;

    const length = this.audioContext.sampleRate * 2; // 2 seconds
    const impulse = this.audioContext.createBuffer(
      2,
      length,
      this.audioContext.sampleRate
    );

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const decay = Math.pow(1 - i / length, 2);
        channelData[i] = (Math.random() * 2 - 1) * decay * 0.5;
      }
    }

    this.reverb = this.audioContext.createConvolver();
    this.reverb.buffer = impulse;
  }

  createEchoEffect() {
    const delayTime = 0.3; // 300ms delay
    const feedback = 0.3;
    const mix = 0.2;

    this.effects.echo = {
      delay: this.audioContext.createDelay(1),
      feedback: this.audioContext.createGain(),
      wet: this.audioContext.createGain(),
      dry: this.audioContext.createGain(),
      output: this.audioContext.createGain(),
    };

    this.effects.echo.delay.delayTime.value = delayTime;
    this.effects.echo.feedback.gain.value = feedback;
    this.effects.echo.wet.gain.value = mix;
    this.effects.echo.dry.gain.value = 1 - mix;

    // Connect echo nodes
    this.effects.echo.delay.connect(this.effects.echo.feedback);
    this.effects.echo.feedback.connect(this.effects.echo.delay);
    this.effects.echo.delay.connect(this.effects.echo.wet);
    this.effects.echo.wet.connect(this.effects.echo.output);
    this.effects.echo.dry.connect(this.effects.echo.output);
  }

  createChorusEffect() {
    this.effects.chorus = {
      delay: this.audioContext.createDelay(0.1),
      lfo: this.audioContext.createOscillator(),
      lfoGain: this.audioContext.createGain(),
      dry: this.audioContext.createGain(),
      wet: this.audioContext.createGain(),
      output: this.audioContext.createGain(),
    };

    this.effects.chorus.lfo.frequency.value = 0.5; // 0.5 Hz LFO
    this.effects.chorus.lfoGain.gain.value = 0.005; // 5ms modulation depth
    this.effects.chorus.delay.delayTime.value = 0.02; // 20ms base delay
    this.effects.chorus.wet.gain.value = 0.3;
    this.effects.chorus.dry.gain.value = 0.7;

    // Connect chorus nodes
    this.effects.chorus.lfo.connect(this.effects.chorus.lfoGain);
    this.effects.chorus.lfoGain.connect(this.effects.chorus.delay.delayTime);
    this.effects.chorus.delay.connect(this.effects.chorus.wet);
    this.effects.chorus.wet.connect(this.effects.chorus.output);
    this.effects.chorus.dry.connect(this.effects.chorus.output);

    this.effects.chorus.lfo.start();
  }

  async loadEssentialAudio() {
    const essentialSounds = [
      "jump",
      "webSwing",
      "punch",
      "spiderSense",
      "menu_select",
    ];

    const essentialMusic = ["menu", "gameplay"];

    // Load essential sound effects
    const soundPromises = essentialSounds.map((sound) => this.loadSound(sound));

    // Load essential music
    const musicPromises = essentialMusic.map((track) => this.loadMusic(track));

    await Promise.all([...soundPromises, ...musicPromises]);

    console.log("🔊 Essential audio loaded");
  }

  setupDynamicAudio() {
    // Initialize ambient sound layers
    this.dynamicAudio.ambientSounds.set("city", {
      volume: 0.3,
      sounds: ["wind", "traffic", "distant_sirens"],
    });

    this.dynamicAudio.ambientSounds.set("rooftop", {
      volume: 0.4,
      sounds: ["wind", "distant_city"],
    });

    this.dynamicAudio.ambientSounds.set("street", {
      volume: 0.5,
      sounds: ["traffic", "footsteps", "city_noise"],
    });
  }

  initAudioVisualization() {
    this.visualization.dataArray = new Uint8Array(
      this.analyser.frequencyBinCount
    );

    // Setup visualization canvas if needed
    if (this.visualization.enabled) {
      this.setupVisualizationCanvas();
    }
  }

  setupVisualizationCanvas() {
    this.visualization.canvas = document.createElement("canvas");
    this.visualization.canvas.width = 256;
    this.visualization.canvas.height = 100;
    this.visualization.canvas.style.position = "fixed";
    this.visualization.canvas.style.top = "10px";
    this.visualization.canvas.style.right = "10px";
    this.visualization.canvas.style.zIndex = "1000";
    this.visualization.canvas.style.border = "1px solid #fff";

    this.visualization.context = this.visualization.canvas.getContext("2d");
    document.body.appendChild(this.visualization.canvas);
  }

  // ==========================================
  // AUDIO LOADING
  // ==========================================

  async loadSound(soundName) {
    if (this.audioBuffers.has(soundName)) {
      return this.audioBuffers.get(soundName);
    }

    if (this.loadingPromises.has(soundName)) {
      return this.loadingPromises.get(soundName);
    }

    const soundConfig = this.soundEffects[soundName];
    if (!soundConfig) {
      console.warn(`Sound effect '${soundName}' not found`);
      return null;
    }

    const loadPromise = this.loadAudioFile(soundConfig.file);
    this.loadingPromises.set(soundName, loadPromise);

    try {
      const buffer = await loadPromise;
      this.audioBuffers.set(soundName, buffer);
      this.loadingPromises.delete(soundName);
      return buffer;
    } catch (error) {
      console.error(`Failed to load sound '${soundName}':`, error);
      this.loadingPromises.delete(soundName);
      return null;
    }
  }

  async loadMusic(trackName) {
    if (this.audioBuffers.has(trackName)) {
      return this.audioBuffers.get(trackName);
    }

    if (this.loadingPromises.has(trackName)) {
      return this.loadingPromises.get(trackName);
    }

    const trackConfig = this.musicTracks[trackName];
    if (!trackConfig) {
      console.warn(`Music track '${trackName}' not found`);
      return null;
    }

    const loadPromise = this.loadAudioFile(trackConfig.file);
    this.loadingPromises.set(trackName, loadPromise);

    try {
      const buffer = await loadPromise;
      this.audioBuffers.set(trackName, buffer);
      this.loadingPromises.delete(trackName);
      return buffer;
    } catch (error) {
      console.error(`Failed to load music '${trackName}':`, error);
      this.loadingPromises.delete(trackName);
      return null;
    }
  }

  async loadAudioFile(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      return audioBuffer;
    } catch (error) {
      // Fallback: generate procedural audio
      console.warn(`Generating procedural audio for: ${url}`);
      return this.generateProceduralAudio(url);
    }
  }

  generateProceduralAudio(filename) {
    // Generate simple procedural audio based on filename
    const duration = 0.5; // 500ms
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(
      1,
      duration * sampleRate,
      sampleRate
    );
    const data = buffer.getChannelData(0);

    if (filename.includes("punch") || filename.includes("hit")) {
      // Generate punch sound
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        const envelope = Math.exp(-t * 8);
        const noise = (Math.random() * 2 - 1) * envelope;
        const tone = Math.sin(2 * Math.PI * 100 * t) * envelope * 0.3;
        data[i] = (noise + tone) * 0.5;
      }
    } else if (filename.includes("web")) {
      // Generate web sound
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        const envelope = Math.exp(-t * 3);
        const sweep = Math.sin(2 * Math.PI * (200 + t * 800) * t) * envelope;
        data[i] = sweep * 0.4;
      }
    } else if (filename.includes("jump")) {
      // Generate jump sound
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        const envelope = Math.exp(-t * 5);
        const whoosh = Math.sin(2 * Math.PI * (50 + t * 200) * t) * envelope;
        data[i] = whoosh * 0.3;
      }
    } else {
      // Generate generic sound
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        const envelope = Math.exp(-t * 4);
        const tone = Math.sin(2 * Math.PI * 440 * t) * envelope;
        data[i] = tone * 0.2;
      }
    }

    return buffer;
  }

  // ==========================================
  // SOUND PLAYBACK
  // ==========================================

  async playSound(soundName, options = {}) {
    if (!this.settings.enabled || !this.isInitialized) return null;

    const buffer = await this.loadSound(soundName);
    if (!buffer) return null;

    const soundConfig = this.soundEffects[soundName];
    const sourceId = this.generateSourceId();

    // Create audio source
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    source.loop = options.loop !== undefined ? options.loop : soundConfig.loop;

    // Set volume
    const volume =
      (options.volume !== undefined ? options.volume : soundConfig.volume) *
      this.settings.sfxVolume;
    gainNode.gain.value = volume;

    // Set pitch
    const pitch =
      options.pitch !== undefined ? options.pitch : soundConfig.pitch;
    source.playbackRate.value = pitch;

    // Apply 3D positioning if specified
    let pannerNode = null;
    if (options.position && this.settings.spatialAudioEnabled) {
      pannerNode = this.create3DAudioSource(options.position);
      source.connect(pannerNode);
      pannerNode.connect(gainNode);
    } else {
      source.connect(gainNode);
    }

    // Apply audio effects
    let finalNode = gainNode;
    if (options.effects) {
      finalNode = this.applyAudioEffects(gainNode, options.effects);
    }

    finalNode.connect(this.sfxGain);

    // Start playback
    const startTime = options.delay
      ? this.audioContext.currentTime + options.delay
      : 0;
    source.start(startTime);

    // Handle fade in
    if (options.fadeIn) {
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + options.fadeIn);
    }

    // Store active source
    const sourceInfo = {
      source: source,
      gainNode: gainNode,
      pannerNode: pannerNode,
      soundName: soundName,
      startTime: this.audioContext.currentTime,
      volume: volume,
    };

    this.activeSources.set(sourceId, sourceInfo);

    // Clean up when finished
    source.addEventListener("ended", () => {
      this.activeSources.delete(sourceId);
      this.performance.activeSources = this.activeSources.size;
    });

    this.performance.activeSources = this.activeSources.size;

    return sourceId;
  }

  async playMusic(trackName, options = {}) {
    if (!this.settings.enabled || !this.isInitialized) return null;

    const buffer = await this.loadMusic(trackName);
    if (!buffer) return null;

    const trackConfig = this.musicTracks[trackName];

    // Stop current music if crossfading is disabled
    if (!options.crossfade && this.dynamicAudio.currentMusicTrack) {
      this.stopMusic();
    }

    // Create music source
    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    source.loop = trackConfig.loop;

    const volume =
      (options.volume !== undefined ? options.volume : trackConfig.volume) *
      this.settings.musicVolume;

    // Handle crossfading
    if (options.crossfade && this.dynamicAudio.currentMusicTrack) {
      this.crossfadeMusic(trackName, source, gainNode, volume);
    } else {
      gainNode.gain.value = options.fadeIn ? 0 : volume;
    }

    source.connect(gainNode);
    gainNode.connect(this.musicGain);

    source.start();

    // Handle fade in
    if (options.fadeIn) {
      gainNode.gain.linearRampToValueAtTime(
        volume,
        this.audioContext.currentTime + options.fadeIn
      );
    }

    // Store music source
    this.musicSources.set(trackName, {
      source: source,
      gainNode: gainNode,
      volume: volume,
    });

    this.dynamicAudio.currentMusicTrack = trackName;

    return trackName;
  }

  crossfadeMusic(newTrackName, newSource, newGainNode, newVolume) {
    const currentTrack = this.musicSources.get(
      this.dynamicAudio.currentMusicTrack
    );
    const crossfadeTime = this.dynamicAudio.crossfadeTime;
    const currentTime = this.audioContext.currentTime;

    if (currentTrack) {
      // Fade out current track
      currentTrack.gainNode.gain.linearRampToValueAtTime(
        0,
        currentTime + crossfadeTime
      );

      // Stop and clean up current track after fade
      setTimeout(() => {
        currentTrack.source.stop();
        this.musicSources.delete(this.dynamicAudio.currentMusicTrack);
      }, crossfadeTime * 1000);
    }

    // Fade in new track
    newGainNode.gain.setValueAtTime(0, currentTime);
    newGainNode.gain.linearRampToValueAtTime(
      newVolume,
      currentTime + crossfadeTime
    );

    this.dynamicAudio.musicCrossfading = true;
    setTimeout(() => {
      this.dynamicAudio.musicCrossfading = false;
    }, crossfadeTime * 1000);
  }

  create3DAudioSource(position) {
    const panner = this.audioContext.createPanner();

    // Set panner properties
    panner.panningModel = "HRTF";
    panner.distanceModel = "inverse";
    panner.refDistance = this.spatialAudio.refDistance;
    panner.maxDistance = this.spatialAudio.maxDistance;
    panner.rolloffFactor = this.spatialAudio.rolloffFactor;
    panner.coneInnerAngle = this.spatialAudio.coneInnerAngle;
    panner.coneOuterAngle = this.spatialAudio.coneOuterAngle;
    panner.coneOuterGain = this.spatialAudio.coneOuterGain;

    // Set position
    if (panner.positionX) {
      // Modern API
      panner.positionX.value = position.x;
      panner.positionY.value = position.y;
      panner.positionZ.value = position.z;
    } else {
      // Legacy API
      panner.setPosition(position.x, position.y, position.z);
    }

    return panner;
  }

  applyAudioEffects(inputNode, effects) {
    let currentNode = inputNode;

    if (effects.includes("reverb") && this.reverb) {
      const reverbGain = this.audioContext.createGain();
      const dryGain = this.audioContext.createGain();
      const wetGain = this.audioContext.createGain();
      const outputGain = this.audioContext.createGain();

      reverbGain.gain.value = 0.3;
      dryGain.gain.value = 0.7;
      wetGain.gain.value = 0.3;

      currentNode.connect(dryGain);
      currentNode.connect(reverbGain);
      reverbGain.connect(this.reverb);
      this.reverb.connect(wetGain);

      dryGain.connect(outputGain);
      wetGain.connect(outputGain);

      currentNode = outputGain;
    }

    if (effects.includes("echo") && this.effects.echo) {
      currentNode.connect(this.effects.echo.dry);
      currentNode.connect(this.effects.echo.delay);
      currentNode = this.effects.echo.output;
    }

    if (effects.includes("lowpass")) {
      this.effects.lowpass.frequency.value = 1000;
      currentNode.connect(this.effects.lowpass);
      currentNode = this.effects.lowpass;
    }

    if (effects.includes("distortion")) {
      const distortion = this.createDistortionEffect();
      currentNode.connect(distortion);
      currentNode = distortion;
    }

    return currentNode;
  }

  createDistortionEffect() {
    const waveshaper = this.audioContext.createWaveShaper();
    const samples = 44100;
    const curve = new Float32Array(samples);
    const degree = 50;

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] =
        ((3 + degree) * x * 20 * Math.PI) /
        180 /
        (Math.PI + degree * Math.abs(x));
    }

    waveshaper.curve = curve;
    waveshaper.oversample = "4x";

    return waveshaper;
  }

  // ==========================================
  // SOUND CONTROL
  // ==========================================

  stopSound(sourceId) {
    const sourceInfo = this.activeSources.get(sourceId);
    if (sourceInfo) {
      sourceInfo.source.stop();
      this.activeSources.delete(sourceId);
      this.performance.activeSources = this.activeSources.size;
    }
  }

  stopAllSounds() {
    for (const [sourceId, sourceInfo] of this.activeSources) {
      sourceInfo.source.stop();
    }
    this.activeSources.clear();
    this.performance.activeSources = 0;
  }

  stopMusic(fadeOut = true) {
    if (this.dynamicAudio.currentMusicTrack) {
      const currentTrack = this.musicSources.get(
        this.dynamicAudio.currentMusicTrack
      );

      if (currentTrack) {
        if (fadeOut) {
          const fadeTime = 1.0;
          currentTrack.gainNode.gain.linearRampToValueAtTime(
            0,
            this.audioContext.currentTime + fadeTime
          );
          setTimeout(() => {
            currentTrack.source.stop();
            this.musicSources.delete(this.dynamicAudio.currentMusicTrack);
          }, fadeTime * 1000);
        } else {
          currentTrack.source.stop();
          this.musicSources.delete(this.dynamicAudio.currentMusicTrack);
        }
      }

      this.dynamicAudio.currentMusicTrack = null;
    }
  }

  pauseMusic() {
    if (this.dynamicAudio.currentMusicTrack) {
      const currentTrack = this.musicSources.get(
        this.dynamicAudio.currentMusicTrack
      );
      if (currentTrack) {
        currentTrack.gainNode.gain.value = 0;
        currentTrack.pausedVolume = currentTrack.volume;
      }
    }
  }

  resumeMusic() {
    if (this.dynamicAudio.currentMusicTrack) {
      const currentTrack = this.musicSources.get(
        this.dynamicAudio.currentMusicTrack
      );
      if (currentTrack && currentTrack.pausedVolume !== undefined) {
        currentTrack.gainNode.gain.value = currentTrack.pausedVolume;
        delete currentTrack.pausedVolume;
      }
    }
  }

  setSoundVolume(sourceId, volume, fadeTime = 0) {
    const sourceInfo = this.activeSources.get(sourceId);
    if (sourceInfo) {
      if (fadeTime > 0) {
        sourceInfo.gainNode.gain.linearRampToValueAtTime(
          volume * this.settings.sfxVolume,
          this.audioContext.currentTime + fadeTime
        );
      } else {
        sourceInfo.gainNode.gain.value = volume * this.settings.sfxVolume;
      }
      sourceInfo.volume = volume;
    }
  }

  setMusicVolume(volume, fadeTime = 0) {
    if (fadeTime > 0) {
      this.musicGain.gain.linearRampToValueAtTime(
        volume * this.settings.masterVolume,
        this.audioContext.currentTime + fadeTime
      );
    } else {
      this.musicGain.gain.value = volume * this.settings.masterVolume;
    }
    this.settings.musicVolume = volume;
  }

  setMasterVolume(volume, fadeTime = 0) {
    if (fadeTime > 0) {
      this.masterGain.gain.linearRampToValueAtTime(
        volume,
        this.audioContext.currentTime + fadeTime
      );
    } else {
      this.masterGain.gain.value = volume;
    }
    this.settings.masterVolume = volume;
  }

  // ==========================================
  // 3D AUDIO UPDATES
  // ==========================================

  updateListener(position, orientation) {
    if (!this.settings.spatialAudioEnabled || !this.spatialAudio.listener)
      return;

    const listener = this.spatialAudio.listener;

    // Update position
    if (listener.positionX) {
      // Modern API
      listener.positionX.value = position.x;
      listener.positionY.value = position.y;
      listener.positionZ.value = position.z;
    } else {
      // Legacy API
      listener.setPosition(position.x, position.y, position.z);
    }

    // Update orientation
    if (orientation && listener.forwardX) {
      // Modern API
      listener.forwardX.value = orientation.forward.x;
      listener.forwardY.value = orientation.forward.y;
      listener.forwardZ.value = orientation.forward.z;
      listener.upX.value = orientation.up.x;
      listener.upY.value = orientation.up.y;
      listener.upZ.value = orientation.up.z;
    } else if (orientation) {
      // Legacy API
      listener.setOrientation(
        orientation.forward.x,
        orientation.forward.y,
        orientation.forward.z,
        orientation.up.x,
        orientation.up.y,
        orientation.up.z
      );
    }
  }

  update3DSound(sourceId, position, velocity) {
    const sourceInfo = this.activeSources.get(sourceId);
    if (sourceInfo && sourceInfo.pannerNode) {
      const panner = sourceInfo.pannerNode;

      // Update position
      if (panner.positionX) {
        // Modern API
        panner.positionX.value = position.x;
        panner.positionY.value = position.y;
        panner.positionZ.value = position.z;
      } else {
        // Legacy API
        panner.setPosition(position.x, position.y, position.z);
      }

      // Update velocity (for Doppler effect)
      if (velocity && panner.velocityX) {
        panner.velocityX.value = velocity.x;
        panner.velocityY.value = velocity.y;
        panner.velocityZ.value = velocity.z;
      } else if (velocity) {
        panner.setVelocity(velocity.x, velocity.y, velocity.z);
      }
    }
  }

  // ==========================================
  // DYNAMIC AUDIO SYSTEM
  // ==========================================

  updateDynamicAudio(gameState) {
    // Adaptive music based on game state
    this.updateAdaptiveMusic(gameState);

    // Ambient sound management
    this.updateAmbientSounds(gameState);

    // Dynamic audio effects
    this.updateDynamicEffects(gameState);
  }

  updateAdaptiveMusic(gameState) {
    let targetTrack = null;

    if (gameState.isSwinging && gameState.speed > 15) {
      targetTrack = "swinging";
    } else if (gameState.isInCombat) {
      targetTrack = "combat";
    } else if (gameState.gameState === "playing") {
      targetTrack = "gameplay";
    } else if (gameState.gameState === "menu") {
      targetTrack = "menu";
    }

    if (targetTrack && targetTrack !== this.dynamicAudio.currentMusicTrack) {
      this.playMusic(targetTrack, { crossfade: true });
    }
  }

  updateAmbientSounds(gameState) {
    const playerHeight = gameState.height || 0;
    let ambientType = "street";

    if (playerHeight > 30) {
      ambientType = "rooftop";
    } else if (playerHeight > 10) {
      ambientType = "city";
    }

    const ambientConfig = this.dynamicAudio.ambientSounds.get(ambientType);
    if (ambientConfig) {
      // Adjust ambient volume based on context
      const targetVolume = ambientConfig.volume * this.settings.masterVolume;
      // Implementation would manage ambient sound layers
    }
  }

  updateDynamicEffects(gameState) {
    // Apply reverb based on environment
    if (this.reverb) {
      const reverbAmount = gameState.isIndoors ? 0.8 : 0.2;
      // Adjust reverb parameters
    }

    // Apply low-pass filter for underwater or muffled effects
    if (gameState.isUnderwater) {
      this.effects.lowpass.frequency.value = 800;
    } else {
      this.effects.lowpass.frequency.value = 20000;
    }

    // Speed-based pitch effects for wind/movement sounds
    if (gameState.isSwinging && gameState.speed > 10) {
      const pitchMod = 1 + (gameState.speed - 10) * 0.02;
      // Apply pitch modulation to wind sounds
    }
  }

  // ==========================================
  // AUDIO VISUALIZATION
  // ==========================================

  updateVisualization() {
    if (!this.visualization.enabled || !this.visualization.context) return;

    this.analyser.getByteFrequencyData(this.visualization.dataArray);

    const canvas = this.visualization.canvas;
    const ctx = this.visualization.context;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const barWidth = width / this.visualization.dataArray.length;
    let x = 0;

    for (let i = 0; i < this.visualization.dataArray.length; i++) {
      const barHeight = (this.visualization.dataArray[i] / 255) * height;

      const red = barHeight + 25 * (i / this.visualization.dataArray.length);
      const green = 250 * (i / this.visualization.dataArray.length);
      const blue = 50;

      ctx.fillStyle = `rgb(${red},${green},${blue})`;
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);

      x += barWidth;
    }
  }

  // ==========================================
  // UPDATE LOOP
  // ==========================================

  update() {
    if (!this.isInitialized) return;

    // Update 3D audio listener based on player position
    if (this.game.graphics && this.game.graphics.player) {
      const playerPos = this.game.graphics.player.position;
      const cameraDir = this.game.graphics.getCameraDirection();
      const cameraUp = { x: 0, y: 1, z: 0 };

      this.updateListener(playerPos, {
        forward: cameraDir,
        up: cameraUp,
      });
    }

    // Update dynamic audio system
    this.updateDynamicAudio({
      gameState: this.game.gameState,
      isSwinging: this.game.mechanics.isSwinging,
      isInCombat: this.game.mechanics.isCombatMode,
      height: this.game.gameStats.height,
      speed: this.calculatePlayerSpeed(),
      isIndoors: false, // Would be determined by game logic
      isUnderwater: false,
    });

    // Update audio visualization
    this.updateVisualization();

    // Clean up finished sources
    this.cleanupFinishedSources();

    // Update performance metrics
    this.updatePerformanceMetrics();
  }

  calculatePlayerSpeed() {
    if (this.game.physics && this.game.physics.player) {
      const velocity = this.game.physics.player.velocity;
      return Math.sqrt(
        velocity.x * velocity.x +
          velocity.y * velocity.y +
          velocity.z * velocity.z
      );
    }
    return 0;
  }

  cleanupFinishedSources() {
    const currentTime = this.audioContext.currentTime;
    const toRemove = [];

    for (const [sourceId, sourceInfo] of this.activeSources) {
      // Check if source has been playing longer than buffer duration
      const buffer = sourceInfo.source.buffer;
      if (buffer && !sourceInfo.source.loop) {
        const duration = buffer.duration;
        if (currentTime - sourceInfo.startTime > duration) {
          toRemove.push(sourceId);
        }
      }
    }

    toRemove.forEach((sourceId) => {
      this.activeSources.delete(sourceId);
    });

    this.performance.activeSources = this.activeSources.size;
  }

  updatePerformanceMetrics() {
    this.performance.memoryUsage = this.audioBuffers.size * 1024; // Rough estimate
    this.performance.processingLoad =
      this.performance.activeSources / this.performance.maxSources;
  }

  // ==========================================
  // SETTINGS AND CONFIGURATION
  // ==========================================

  applySettings(settings) {
    Object.assign(this.settings, settings);

    // Update volume levels
    this.setMasterVolume(this.settings.masterVolume, 0.5);
    this.setMusicVolume(this.settings.musicVolume, 0.5);
    this.sfxGain.gain.linearRampToValueAtTime(
      this.settings.sfxVolume,
      this.audioContext.currentTime + 0.5
    );

    // Toggle spatial audio
    if (!this.settings.spatialAudioEnabled) {
      // Convert all 3D sources to regular sources
      this.convert3DToMono();
    }

    // Toggle effects
    this.updateEffectSettings();
  }

  convert3DToMono() {
    for (const [sourceId, sourceInfo] of this.activeSources) {
      if (sourceInfo.pannerNode) {
        // Disconnect panner and connect directly
        sourceInfo.source.disconnect();
        sourceInfo.source.connect(sourceInfo.gainNode);
        sourceInfo.pannerNode = null;
      }
    }
  }

  updateEffectSettings() {
    // Enable/disable compression
    if (this.settings.compressionEnabled) {
      this.masterGain.disconnect();
      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.analyser);
    } else {
      this.masterGain.disconnect();
      this.compressor.disconnect();
      this.masterGain.connect(this.analyser);
    }
  }

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  generateSourceId() {
    return `source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  isPlaying(soundName) {
    for (const [sourceId, sourceInfo] of this.activeSources) {
      if (sourceInfo.soundName === soundName) {
        return true;
      }
    }
    return false;
  }

  getCurrentMusicTrack() {
    return this.dynamicAudio.currentMusicTrack;
  }

  getAudioContext() {
    return this.audioContext;
  }

  getPerformanceInfo() {
    return {
      activeSources: this.performance.activeSources,
      maxSources: this.performance.maxSources,
      memoryUsage: this.performance.memoryUsage,
      processingLoad: this.performance.processingLoad,
      audioBuffers: this.audioBuffers.size,
      contextState: this.audioContext.state,
    };
  }

  // ==========================================
  // CLEANUP
  // ==========================================

  destroy() {
    // Stop all sounds
    this.stopAllSounds();
    this.stopMusic(false);

    // Disconnect all nodes
    if (this.masterGain) this.masterGain.disconnect();
    if (this.musicGain) this.musicGain.disconnect();
    if (this.sfxGain) this.sfxGain.disconnect();
    if (this.compressor) this.compressor.disconnect();
    if (this.analyser) this.analyser.disconnect();

    // Close audio context
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }

    // Clear data structures
    this.audioBuffers.clear();
    this.activeSources.clear();
    this.musicSources.clear();
    this.loadingPromises.clear();

    // Remove visualization canvas
    if (this.visualization.canvas && this.visualization.canvas.parentNode) {
      this.visualization.canvas.parentNode.removeChild(
        this.visualization.canvas
      );
    }

    console.log("🔇 Audio engine destroyed");
  }
}

// Export for use by other modules
window.SpiderManAudio = SpiderManAudio;
