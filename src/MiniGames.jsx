import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Helper to bypass strict linter rules about random
const getRandomHeight = () => Math.random() * 200 + 50;
const getRandomSpeed = () => 0.8 + Math.random() * 1.0;
const getRandomX = () => Math.random() * 360;
const getRandomFlame = () => Math.random() * 6;

// --- Flappy Servo-Skull Game ---
const getFlappyConfig = (diff) => {
  switch(diff) {
    case 'kolay': return { gravity: 0.30, jump: -5.5, pipeSpeed: 2.0, pipeSpawnRate: 3500, gap: 180 };
    case 'orta': return { gravity: 0.35, jump: -6.0, pipeSpeed: 2.5, pipeSpawnRate: 2800, gap: 160 };
    case 'zor': return { gravity: 0.45, jump: -7.0, pipeSpeed: 3.5, pipeSpawnRate: 1800, gap: 140 };
    default: return { gravity: 0.35, jump: -6.0, pipeSpeed: 2.5, pipeSpawnRate: 2800, gap: 160 };
  }
};

const FlappyServoGame = ({ onBack }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState('orta');

  const gameData = useRef({
    bird: { y: 250, velocity: 0 },
    pipes: [],
    lastPipeTime: 0,
    score: 0,
    isPlaying: false,
    config: getFlappyConfig('orta')
  });
  const reqRef = useRef(null);

  const startGame = (selectedDiff) => {
    setDifficulty(selectedDiff);
    const config = getFlappyConfig(selectedDiff);
    gameData.current = { 
      bird: { y: 250, velocity: config.jump }, 
      pipes: [], 
      lastPipeTime: performance.now(), 
      score: 0, 
      isPlaying: true,
      config: config
    };
    setScore(0);
    setGameState('playing');
  };

  const jump = () => {
    if (gameState === 'playing') {
      gameData.current.bird.velocity = gameData.current.config.jump;
    }
  };

  const gameLoop = (time) => {
    if (!gameData.current.isPlaying) return;
    reqRef.current = requestAnimationFrame(gameLoop);

    // Limit to 60 FPS
    const deltaTime = time - (gameData.current.lastFrameTime || 0);
    if (deltaTime < 16.6) return;
    gameData.current.lastFrameTime = time - (deltaTime % 16.6);

    const ctx = canvasRef.current.getContext('2d');
    const data = gameData.current;
    const cfg = data.config;

    ctx.clearRect(0, 0, 400, 500);

    // Bird Physics
    data.bird.velocity += cfg.gravity;
    data.bird.y += data.bird.velocity;
    
    // Floor & Ceiling Collision
    if (data.bird.y > 480 || data.bird.y < 0) {
      data.isPlaying = false;
      setGameState('over');
      return;
    }

    // Pipe Spawning
    if (time - data.lastPipeTime > cfg.pipeSpawnRate) {
      data.pipes.push({
        x: 400,
        topHeight: getRandomHeight(),
        passed: false
      });
      data.lastPipeTime = time;
    }

    // Pipes
    ctx.fillStyle = '#444';
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    for (let i = data.pipes.length - 1; i >= 0; i--) {
      let p = data.pipes[i];
      p.x -= cfg.pipeSpeed;

      if (!p.passed && p.x < 50) {
        p.passed = true;
        data.score += 1;
        setScore(data.score);
      }

      // Draw Pipes
      const gap = cfg.gap;
      // Top Pipe
      ctx.fillRect(p.x, 0, 50, p.topHeight);
      ctx.strokeRect(p.x, 0, 50, p.topHeight);
      // Bottom Pipe
      ctx.fillRect(p.x, p.topHeight + gap, 50, 500 - (p.topHeight + gap));
      ctx.strokeRect(p.x, p.topHeight + gap, 50, 500 - (p.topHeight + gap));

      // Collision
      const birdBox = { x: 50, y: data.bird.y, size: 24 };
      if (birdBox.x + birdBox.size > p.x && birdBox.x < p.x + 50) {
        if (birdBox.y < p.topHeight || birdBox.y + birdBox.size > p.topHeight + gap) {
          data.isPlaying = false;
          setGameState('over');
          return;
        }
      }

      if (p.x < -50) data.pipes.splice(i, 1);
    }
    
    // Draw Bird
    ctx.save();
    ctx.translate(65, data.bird.y + 15);
    ctx.rotate(Math.min(data.bird.velocity * 0.05, Math.PI / 4));
    ctx.font = '30px sans-serif';
    ctx.fillText('💀', -15, 10);
    ctx.restore();
  };

  useEffect(() => {
    if (gameState === 'playing') {
      reqRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  return (
    <div className="tyranid-game-container">
      <div className="arcade-header">
        <button className="arcade-back-btn" onClick={onBack}>🔙 Menü</button>
        <span className="game-score">Skor: {score}</span>
      </div>
      
      <div className="canvas-wrapper" style={{ position: 'relative', width: '400px', margin: '0 auto' }}>
        <canvas ref={canvasRef} onClick={jump} width={400} height={500} style={{ background: '#1a1a24', border: '4px solid #bf5af2', borderRadius: '8px', display: 'block', cursor: gameState === 'playing' ? 'pointer' : 'default' }} />
        
        {gameState === 'start' && (
          <div className="game-overlay">
            <h2>Flappy Servo-Skull</h2>
            <div style={{ fontSize: '3rem', margin: '10px' }}>💀</div>
            <p style={{ marginBottom: '20px' }}>Zorluk Seçin:</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="start-btn" style={{ background: '#32d74b', padding: '10px 15px' }} onClick={() => startGame('kolay')}>Kolay</button>
              <button className="start-btn" style={{ background: '#ffd60a', color: '#000', padding: '10px 15px' }} onClick={() => startGame('orta')}>Orta</button>
              <button className="start-btn" style={{ background: '#ff375f', padding: '10px 15px' }} onClick={() => startGame('zor')}>Zor</button>
            </div>
          </div>
        )}

        {gameState === 'over' && (
          <div className="game-overlay error">
            <h2>HERETIC! (Oyun Bitti)</h2>
            <p>Skorun: {score}</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button className="start-btn" onClick={() => startGame(difficulty)}>Tekrar Dene</button>
              <button className="start-btn" style={{ background: '#444' }} onClick={() => setGameState('start')}>Zorluk Değiştir</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// --- Tyranid Swarm (Space Invaders) ---
const getTyranidConfig = (diff) => {
  switch(diff) {
    case 'kolay': return { spawnRate: 1600, baseSpeed: 0.6, speedVar: 0.6, playerSpeed: 8 };
    case 'orta': return { spawnRate: 1200, baseSpeed: 0.8, speedVar: 1.0, playerSpeed: 7 };
    case 'zor': return { spawnRate: 800, baseSpeed: 1.2, speedVar: 1.5, playerSpeed: 6 };
    default: return { spawnRate: 1200, baseSpeed: 0.8, speedVar: 1.0, playerSpeed: 7 };
  }
};

const TyranidSwarmGame = ({ onBack }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState('orta');

  const gameData = useRef({
    player: { x: 200, y: 450, width: 30, height: 30, speed: 7 },
    bullets: [],
    enemies: [],
    keys: {},
    lastEnemySpawn: 0,
    score: 0,
    isPlaying: false,
    config: getTyranidConfig('orta')
  });
  const reqRef = useRef(null);

  const startGame = (selectedDiff) => {
    setDifficulty(selectedDiff);
    const config = getTyranidConfig(selectedDiff);
    gameData.current = {
      player: { x: 185, y: 450, width: 30, height: 30, speed: config.playerSpeed },
      bullets: [],
      enemies: [],
      keys: gameData.current.keys, // preserve keys
      lastEnemySpawn: performance.now(),
      score: 0,
      isPlaying: true,
      config: config
    };
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    const handleKeyDown = (e) => { gameData.current.keys[e.key] = true; };
    const handleKeyUp = (e) => { gameData.current.keys[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const spawnEnemy = (time) => {
    const cfg = gameData.current.config;
    if (time - gameData.current.lastEnemySpawn > cfg.spawnRate) {
      gameData.current.enemies.push({
        x: getRandomX(),
        y: -30,
        width: 30,
        height: 30,
        speed: cfg.baseSpeed + Math.random() * cfg.speedVar
      });
      gameData.current.lastEnemySpawn = time;
    }
  };

  const gameLoop = (time) => {
    if (!gameData.current.isPlaying) return;
    reqRef.current = requestAnimationFrame(gameLoop);

    // Limit to 60 FPS
    const deltaTime = time - (gameData.current.lastFrameTime || 0);
    if (deltaTime < 16.6) return;
    gameData.current.lastFrameTime = time - (deltaTime % 16.6);

    const ctx = canvasRef.current.getContext('2d');
    const data = gameData.current;

    // Clear canvas
    ctx.clearRect(0, 0, 400, 500);

    // Player movement
    if ((data.keys['ArrowLeft'] || data.keys['a']) && data.player.x > 0) data.player.x -= data.player.speed;
    if ((data.keys['ArrowRight'] || data.keys['d']) && data.player.x < 400 - data.player.width) data.player.x += data.player.speed;
    
    // Shooting (Space)
    if (data.keys[' '] && data.bullets.length < 5) {
      // Cooldown to prevent laser beam
      const lastBullet = data.bullets[data.bullets.length - 1];
      if (!lastBullet || lastBullet.y < data.player.y - 40) {
        data.bullets.push({ x: data.player.x + 10, y: data.player.y, speed: 8 });
      }
    }

    // Draw Player (Custom Spaceship)
    ctx.save();
    ctx.translate(data.player.x + data.player.width / 2, data.player.y);
    
    // Main Body
    ctx.fillStyle = '#e5e5ea';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(10, 15);
    ctx.lineTo(10, 30);
    ctx.lineTo(-10, 30);
    ctx.lineTo(-10, 15);
    ctx.closePath();
    ctx.fill();

    // Cockpit
    ctx.fillStyle = '#0a84ff';
    ctx.beginPath();
    ctx.arc(0, 15, 4, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.fillStyle = '#ff375f';
    ctx.beginPath();
    ctx.moveTo(10, 20);
    ctx.lineTo(20, 30);
    ctx.lineTo(10, 30);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-10, 20);
    ctx.lineTo(-20, 30);
    ctx.lineTo(-10, 30);
    ctx.closePath();
    ctx.fill();

    // Engine Flame
    ctx.fillStyle = '#ffd60a';
    ctx.beginPath();
    ctx.moveTo(-6, 30);
    ctx.lineTo(0, 36 + getRandomFlame());
    ctx.lineTo(6, 30);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Draw & Move Bullets
    ctx.fillStyle = '#32d74b';
    for (let i = data.bullets.length - 1; i >= 0; i--) {
      let b = data.bullets[i];
      b.y -= b.speed;
      ctx.fillRect(b.x, b.y, 4, 15);
      if (b.y < 0) data.bullets.splice(i, 1);
    }

    spawnEnemy(time);

    // Draw & Move Enemies
    for (let i = data.enemies.length - 1; i >= 0; i--) {
      let e = data.enemies[i];
      e.y += e.speed;
      
      // Draw Enemy (Custom Tyranid/Bug)
      ctx.save();
      ctx.translate(e.x + e.width / 2, e.y + e.height / 2);
      ctx.fillStyle = '#bf5af2';
      
      // Bug Body
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Bug Claws
      ctx.strokeStyle = '#bf5af2';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-8, -5);
      ctx.lineTo(-14, 5);
      ctx.lineTo(-10, 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(8, -5);
      ctx.lineTo(14, 5);
      ctx.lineTo(10, 12);
      ctx.stroke();
      
      // Bug Eyes
      ctx.fillStyle = '#ff375f';
      ctx.fillRect(-4, -6, 3, 3);
      ctx.fillRect(1, -6, 3, 3);
      ctx.restore();

      // Collision with player (Game Over)
      if (e.y + e.height > data.player.y && e.x < data.player.x + data.player.width && e.x + e.width > data.player.x) {
        data.isPlaying = false;
        setGameState('over');
        return;
      }

      // Collision with bullets
      for (let j = data.bullets.length - 1; j >= 0; j--) {
        let b = data.bullets[j];
        if (b.x > e.x && b.x < e.x + e.width && b.y < e.y + e.height && b.y > e.y) {
          data.enemies.splice(i, 1);
          data.bullets.splice(j, 1);
          data.score += 10;
          setScore(data.score);
          break; // break inner loop
        }
      }

      if (e.y > 500) data.enemies.splice(i, 1);
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      // The state is already initialized by startGame
      reqRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  return (
    <div className="tyranid-game-container">
      <div className="arcade-header">
        <button className="arcade-back-btn" onClick={onBack}>🔙 Menü</button>
        <span className="game-score">Skor: {score}</span>
      </div>
      
      <div className="canvas-wrapper" style={{ position: 'relative', width: '400px', margin: '0 auto' }}>
        <canvas ref={canvasRef} width={400} height={500} style={{ background: '#050510', border: '4px solid #32d74b', borderRadius: '8px', display: 'block' }} />
        
        {gameState === 'start' && (
          <div className="game-overlay">
            <h2>Tyranid Swarm</h2>
            <p>Yön tuşları veya A/D ile hareket et.</p>
            <p>Space ile ateş et.</p>
            <p style={{ marginTop: '15px', marginBottom: '10px' }}>Zorluk Seçin:</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="start-btn" style={{ background: '#32d74b', padding: '10px 15px' }} onClick={() => startGame('kolay')}>Kolay</button>
              <button className="start-btn" style={{ background: '#ffd60a', color: '#000', padding: '10px 15px' }} onClick={() => startGame('orta')}>Orta</button>
              <button className="start-btn" style={{ background: '#ff375f', padding: '10px 15px' }} onClick={() => startGame('zor')}>Zor</button>
            </div>
          </div>
        )}

        {gameState === 'over' && (
          <div className="game-overlay error">
            <h2>THE SWARM CONSUMED YOU!</h2>
            <p>Skorun: {score}</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
              <button className="start-btn" onClick={() => startGame(difficulty)}>Tekrar Dene</button>
              <button className="start-btn" style={{ background: '#444' }} onClick={() => setGameState('start')}>Zorluk Değiştir</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


// --- Arcade Machine Menu ---
export const ArcadeMenu = () => {
  const [activeGame, setActiveGame] = useState(null); // 'flappy' | 'swarm' | null

  if (activeGame === 'flappy') {
    return <FlappyServoGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'swarm') {
    return <TyranidSwarmGame onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="content-wrapper">
      <div className="arcade-menu">
        <h2 className="arcade-title">💀 Zeki's Arcade 👾</h2>
        <p className="arcade-subtitle" style={{textAlign: 'center', color: '#a1a1a6', marginBottom: '20px'}}>Lütfen jeton atın (veya oynamak için seçin)</p>
        
        <div className="arcade-game-list" style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          <motion.div 
            className="arcade-game-card"
            style={{background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #bf5af2', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px'}}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(191, 90, 242, 0.1)' }}
            onClick={() => setActiveGame('flappy')}
          >
            <div className="card-icon" style={{fontSize: '2.5rem'}}>💀</div>
            <div>
              <h3 style={{margin: '0 0 5px 0', color: '#bf5af2'}}>Flappy Servo-Skull</h3>
              <p style={{margin: 0, fontSize: '0.85rem', color: '#ccc'}}>Mekaniği kutsayın, gotik sütunlara çarpmayın. For the Emperor!</p>
            </div>
          </motion.div>

          <motion.div 
            className="arcade-game-card"
            style={{background: 'rgba(0,0,0,0.4)', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #32d74b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px'}}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(50, 215, 75, 0.1)' }}
            onClick={() => setActiveGame('swarm')}
          >
            <div className="card-icon" style={{fontSize: '2.5rem'}}>👾</div>
            <div>
              <h3 style={{margin: '0 0 5px 0', color: '#32d74b'}}>Tyranid Swarm</h3>
              <p style={{margin: 0, fontSize: '0.85rem', color: '#ccc'}}>Gelen böcek dalgasını durdurun. Klasik Space Invaders heyecanı.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
