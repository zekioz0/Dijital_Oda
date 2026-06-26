import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code2, Monitor, Dumbbell, Cpu, Database, User, Clock, BookOpen, Guitar, X, Volume2, VolumeX, Send, Lightbulb, LightbulbOff, Target } from 'lucide-react';
import './App.css';

const audioTracks = [
  { name: "Lofi Vibes", url: import.meta.env.BASE_URL + "lofi.mp3" }
];

/* ============================
   MINI SIMULATIONS & WIDGETS
   ============================ */

const defaultHistory = [
  { type: 'system', text: 'ZekiOS v1.0.0 (tty1)' },
  { type: 'system', text: 'SYSTEM STATUS\nCPU: 99% Motivation\nRAM: Coffee Powered\nCurrent Task: Building Something Cool' },
  { type: 'system', text: "Sisteme hoş geldiniz. Komutları görmek için 'help' yazın." }
];

const TerminalProfileMenu = () => {
  const [activeTab, setActiveTab] = useState('about');

  return (
    <div style={{ border: '1px solid #444', padding: '15px', borderRadius: '12px', marginTop: '10px', background: 'rgba(20, 20, 25, 0.8)', fontFamily: 'sans-serif', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
      <div style={{ marginBottom: '15px', color: '#32d74b', fontFamily: 'monospace', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '1.2rem' }}>⚡</span> [ ZekiOS - Kullanıcı Profili ]
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '15px' }}>
        <button className="status-badge" style={{ background: activeTab === 'about' ? '#5e5ce6' : '#222', color: '#fff', cursor: 'pointer', border: 'none', padding: '6px 12px' }} onClick={() => setActiveTab('about')}>Hakkımda</button>
        <button className="status-badge" style={{ background: activeTab === 'edu' ? '#5e5ce6' : '#222', color: '#fff', cursor: 'pointer', border: 'none', padding: '6px 12px' }} onClick={() => setActiveTab('edu')}>Eğitim</button>
        <button className="status-badge" style={{ background: activeTab === 'skills' ? '#5e5ce6' : '#222', color: '#fff', cursor: 'pointer', border: 'none', padding: '6px 12px' }} onClick={() => setActiveTab('skills')}>Yetenekler</button>
        <button className="status-badge" style={{ background: '#222', color: '#fff', cursor: 'pointer', border: '1px solid #5e5ce6', padding: '5px 11px' }} onClick={() => window.open('https://github.com/zekioz0', '_blank')}>GitHub ↗</button>
      </div>

      <div style={{ color: '#ccc', fontSize: '0.95rem', lineHeight: '1.6', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #5e5ce6' }}>
        {activeTab === 'about' && (
          <div>
            Merhaba, ben Zeki! Yazılım geliştirmeyi bir işten çok <b>"inşa etme sanatı"</b> olarak görüyorum. Sadece kod yazmakla kalmıyor; sistem mimarileri kurgulamayı, verimliliği artırmayı ve hem yazılım hem de donanım dünyasını bir araya getiren projelere kafa yormayı seviyorum.
          </div>
        )}
        {activeTab === 'edu' && (
          <div>
            🎓 <b>Bilgisayar Mühendisliği (2. Sınıf)</b><br />
            Teorik temelleri pratikle buluşturduğum bir eğitim süreci. Özellikle algoritmalar, gömülü sistemler ve yazılım mimarileri üzerine yoğunlaşıyorum. Sürekli öğrenme ve kendini geliştirme felsefesine inanıyorum.
          </div>
        )}
        {activeTab === 'skills' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <b style={{ color: '#ff9f0a' }}>Frontend:</b><br />React.js, JavaScript, Modern CSS
            </div>
            <div>
              <b style={{ color: '#32d74b' }}>Backend:</b><br />Python, Java, Spring Boot, C#
            </div>
            <div>
              <b style={{ color: '#0a84ff' }}>Sistem & Ağ:</b><br />Bilgisayar Ağları, OS Mimarisi
            </div>
            <div>
              <b style={{ color: '#ff375f' }}>Donanım:</b><br />Arduino, ESP32, Lojik Devreler
            </div>
            <div style={{ gridColumn: 'span 2', marginTop: '5px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <b style={{ color: '#bf5af2' }}>Tasarım & Hobiler:</b><br />Blender 3D Modelleme, Gelişmiş UI/UX Tasarım, Calisthenics, Boks
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TerminalComponent = () => {
  const [history, setHistory] = useState(defaultHistory);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const handleCommand = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const rawCmd = input.trim();
    const cmdParts = rawCmd.split(' ');
    const cmd = cmdParts[0].toLowerCase();

    setCommandHistory([...commandHistory, rawCmd]);
    setHistoryIndex(-1);

    // Komutu önce ekrana yazdırıyoruz
    setHistory(prev => [...prev, { type: 'user', text: `C:\\Zeki> ${rawCmd}` }]);
    setInput('');

    let response = '';

    switch (cmd) {
      case 'help':
        response = 'Komutlar: whoami, profile, skills, projects, github, date, echo, clear, sudo, contact';
        break;
      case 'whoami':
        response = 'Zeki - Bilgisayar Mühendisliği Öğrencisi.\nYazılım ve Donanım Geliştiricisi.';
        break;
      case 'profile':
        setHistory(prev => [...prev, { type: 'custom', component: <TerminalProfileMenu /> }]);
        return;
      case 'skills':
        response = '> Frontend: React, JS, CSS\n> Backend: Python, Java, C#, SQLite\n> Donanım: Dijital Devre Tasarımı, Lojik Kapılar';
        break;
      case 'projects':
        setHistory(prev => [...prev, { type: 'response', text: 'GitHub projeleri yükleniyor (API)...' }]);
        try {
          const res = await fetch('https://api.github.com/users/zekioz0/repos?sort=updated&per_page=3');
          if (!res.ok) throw new Error("API Hatası");
          const repos = await res.json();
          response = "Son Güncellenen Projeler (GitHub):\n";
          repos.forEach((repo, i) => {
            response += `${i + 1}. ${repo.name} - 🌟${repo.stargazers_count} (${repo.language || 'Karışık'})\n`;
          });
        } catch (error) {
          response = 'Projeler çekilirken bir hata oluştu veya limit doldu.';
        }
        setHistory(prev => [...prev, { type: 'response', text: response }]);
        return;
      case 'github':
        response = 'GitHub profili yeni sekmede açılıyor...';
        window.open('https://github.com/zekioz0', '_blank');
        break;
      case 'date':
        response = new Date().toLocaleString('tr-TR');
        break;
      case 'echo':
        response = cmdParts.slice(1).join(' ');
        break;
      case 'clear':
        setHistory(defaultHistory); setInput(''); return;
      case 'sudo':
        response = 'Erişim engellendi. Bu olay sistem yöneticisine raporlanacaktır.';
        break;
      case 'contact':
        if (cmdParts.length > 1) {
          response = 'Mesajınız başarıyla iletildi! Teşekkürler.';
        } else {
          response = "Kullanım: contact <mesajınız>\nÖrnek: contact Merhaba Zeki, projeni çok beğendim!";
        }
        break;
      default:
        response = `Komut bulunamadı: '${cmd}'. Geçerli komutlar için 'help' yazın.`;
    }

    // Diğer komutlar için yanıtı history'e ekle
    setHistory(prev => [...prev, { type: 'response', text: response }]);
  };

  return (
    <div className="mini-terminal">
      <div className="terminal-history">
        {history.map((line, i) => (
          <div key={i} className={`term-line ${line.type}`}>
            {line.text && line.text}
            {line.component && line.component}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleCommand} className="terminal-input-form">
        <span className="prompt">C:\Zeki&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck="false"
        />
      </form>
    </div>
  );
};

const LogicGateSim = () => {
  const [inputA, setInputA] = useState(false);
  const [inputB, setInputB] = useState(false);

  const sum = inputA !== inputB; // XOR gate
  const carry = inputA && inputB; // AND gate

  return (
    <div className="logic-sim">
      <h3 className="sim-title">Half-Adder (Yarım Toplayıcı) Simülasyonu</h3>
      <div className="sim-container" style={{ flexDirection: 'column', gap: '20px' }}>
        <div className="switches" style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className={`switch ${inputA ? 'on' : 'off'}`} onClick={() => setInputA(!inputA)}>
            Giriş A: {inputA ? '1' : '0'}
          </button>
          <button className={`switch ${inputB ? 'on' : 'off'}`} onClick={() => setInputB(!inputB)}>
            Giriş B: {inputB ? '1' : '0'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <div className={`lightbulb ${sum ? 'on' : 'off'}`} style={{ flexDirection: 'column', padding: '10px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>SUM (XOR)</span>
            {sum ? '💡 1' : '🔌 0'}
          </div>
          <div className={`lightbulb ${carry ? 'on' : 'off'}`} style={{ flexDirection: 'column', padding: '10px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>CARRY (AND)</span>
            {carry ? '💡 1' : '🔌 0'}
          </div>
        </div>
      </div>
      <p className="sim-desc">"Bilgisayarların nasıl işlem (toplama) yaptığının temeli: A ve B toplanır, SUM ve CARRY (elde) üretilir."</p>
    </div>
  );
};

const SkillBars = () => (
  <div className="skill-bars">
    <div className="skill">
      <span className="name">Strateji & Mimari</span>
      <div className="bar"><motion.div className="fill blue" initial={{ width: 0 }} animate={{ width: '95%' }} transition={{ duration: 1 }} /></div>
    </div>
    <div className="skill">
      <span className="name">React & Frontend</span>
      <div className="bar"><motion.div className="fill green" initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1, delay: 0.2 }} /></div>
    </div>
    <div className="skill">
      <span className="name">Backend (Python/Java)</span>
      <div className="bar"><motion.div className="fill purple" initial={{ width: 0 }} animate={{ width: '80%' }} transition={{ duration: 1, delay: 0.4 }} /></div>
    </div>
    <div className="skill">
      <span className="name">Donanım & Lojik</span>
      <div className="bar"><motion.div className="fill orange" initial={{ width: 0 }} animate={{ width: '75%' }} transition={{ duration: 1, delay: 0.6 }} /></div>
    </div>
  </div>
);

const PosterModalContent = () => {
  return (
    <div className="content-wrapper">
      <div className="modern-card" style={{ borderLeft: '3px solid #ff9f0a', background: 'rgba(0,0,0,0.4)' }}>
        <h4 style={{ color: '#ff9f0a', marginBottom: '5px', fontSize: '1.1rem' }}>🎸 Rust in Peace</h4>
        <p style={{ fontSize: '0.9rem', color: '#a1a1a6', lineHeight: '1.6' }}>
          Kulaklıktan yükselen yüksek tempolu bateriler ve teknik riffler... Derin odaklanma seanslarında
          matematiksel bir ritim bulmak için ideal.
        </p>
      </div>
      <div className="modern-card" style={{ borderLeft: '3px solid #bf5af2', background: 'rgba(0,0,0,0.4)' }}>
        <h4 style={{ color: '#bf5af2', marginBottom: '5px', fontSize: '1.1rem' }}>🤖 Neon Genesis Evangelion</h4>
        <p style={{ fontSize: '0.9rem', color: '#a1a1a6', lineHeight: '1.6' }}>
          Siberpunk atmosferi, mecha tasarımları ve distopik evrenler. Teknoloji ile varoluşsal krizlerin kesiştiği
          karanlık bir estetik ve ilham kaynağı.
        </p>
      </div>
    </div>
  );
};

const MediaShelf = () => {
  const [activeTab, setActiveTab] = useState('literature');
  const [activeItem, setActiveItem] = useState(null);

  const data = {
    literature: [
      { title: "Gotik Edebiyat", desc: "Karanlık atmosferler, gizemli şatolar, Edgar Allan Poe ve Mary Shelley'nin tekinsiz dünyaları.", icon: "🦇" },
      { title: "Bilim Kurgu", desc: "Gelecek tasvirleri, uzay yolculukları, distopyalar ve Frank Herbert gibi ustaların eserleri.", icon: "🚀" },
      { title: "Şiir & Melankoli", desc: "Duyguların en saf hali. Yağmurlu günlerde Cemal Süreya veya Nazım Hikmet okumak.", icon: "📜" },
      { title: "Felsefe & Psikoloji", desc: "İnsan doğası, varoluşçuluk ve ahlak felsefesi üzerine derin düşünce okumaları.", icon: "🧠" }
    ],
    games: [
      { title: "Grand Strategy & Taktik", desc: "HOI4, EU4, Civilization ve Total War. Tarihi yeniden yazmayı ve koca bir imparatorluğu yönetmeyi seviyorum.", icon: "🌍" },
      { title: "Hikaye & RPG", desc: "The Witcher 3, Cyberpunk 2077 ve Disco Elysium. Kararların sonuçlarını hissettiğim derin dünyalar.", icon: "🎭" },
      { title: "Indie & Sandbox", desc: "Stardew Valley, Terraria, Minecraft. Bazen sadece kafa dinlemek ve kendi küçük çiftliğimi/kalemi kurmak için.", icon: "🌾" }
    ],
    hobbies: [
      { title: "Blender 3D & Çizim", desc: "Hayal gücümü ekrana aktarıyorum. Blender ile 3D modelleme yapmak ve boş zamanlarımda çizimle uğraşmak büyük bir zevk.", icon: "🎨" },
      { title: "Lego İnşası", desc: "Parçaları birleştirip karmaşık yapılar ortaya çıkarmak, hem odaklanmamı sağlıyor hem de zihnim için harika bir terapi.", icon: "🧱" },
      { title: "Warhammer Evreni", desc: "Warhammer'ın o devasa, gotik ve karanlık lore'una (hikayesine) dalmak, saatlerce o evreni araştırmak favorim.", icon: "⚔️" },
      { title: "Gitar & Müzik", desc: "Elektro gitar çalmak, rifflerle uğraşmak ve müziğin matematiğinde kaybolmak en büyük deşarj yöntemim.", icon: "🎸" },
      { title: "Elektronik & Donanım", desc: "Mikrodenetleyiciler, lojik kapılar ve lehim kokusuyla geçen üretken saatler.", icon: "⚙️" }
    ],
    academic: [
      { title: "Clean Code - Robert C. Martin", desc: "Sadece çalışan değil, okunabilir ve sürdürülebilir kod yazma felsefesi.", icon: "📘" },
      { title: "Operating Systems - Silberschatz", desc: "İşletim sistemlerinin derinlikleri, bellek yönetimi ve concurrency.", icon: "📙" },
      { title: "Digital Logic Design", desc: "Mantık kapılarından mikroişlemcilere kadar donanımın en temelleri.", icon: "📗" },
      { title: "Computer Architecture - Patterson", desc: "Donanım ve yazılımın kesiştiği o muazzam yapı.", icon: "📕" }
    ]
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveItem(null); // Sekme değiştiğinde seçimi sıfırla
  };

  return (
    <div className="interactive-books">
      <div className="shelf-tabs">
        <button className={`shelf-tab ${activeTab === 'literature' ? 'active' : ''}`} onClick={() => handleTabChange('literature')}>Edebiyat</button>
        <button className={`shelf-tab ${activeTab === 'games' ? 'active' : ''}`} onClick={() => handleTabChange('games')}>Oyunlar</button>
        <button className={`shelf-tab ${activeTab === 'hobbies' ? 'active' : ''}`} onClick={() => handleTabChange('hobbies')}>Hobiler</button>
        <button className={`shelf-tab ${activeTab === 'academic' ? 'active' : ''}`} onClick={() => handleTabChange('academic')}>Akademi</button>
      </div>

      <div className="books-list">
        {data[activeTab].map((item, i) => (
          <div key={i} className={`book-item ${activeItem === i ? 'active' : ''}`} onMouseEnter={() => setActiveItem(i)}>
            {item.icon} {item.title}
          </div>
        ))}
      </div>
      <div className="book-details">
        {activeItem !== null ? (
          <motion.div key={activeItem} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h4>{data[activeTab][activeItem].title}</h4>
            <p>{data[activeTab][activeItem].desc}</p>
          </motion.div>
        ) : (
          <p className="book-hint">İncelemek için bir öğenin üzerine gelin.</p>
        )}
      </div>
    </div>
  );
};

const CoffeeRoutine = () => {
  const [activeTab, setActiveTab] = useState('night');
  const [activeItem, setActiveItem] = useState(null);

  const data = {
    night: [
      { title: "Gece Mesaisi", desc: "Dünya uyurken başlayan sessizlik, odaklanmak için en verimli saatlerim.", icon: "🌙" },
      { title: "Koyu Kahve", desc: "Gece uzun sürdüğünde zihnimi açık tutan, kodlama ritüelimin vazgeçilmezi.", icon: "☕" },
      { title: "Sistem Tasarımı", desc: "Gecenin sessizliğinde karmaşık mimarileri ve algoritmaları kâğıda dökmek.", icon: "📝" }
    ],
    work: [
      { title: "Deep Work", desc: "Dış dünyadan tamamen izole olduğum, kesintisiz kodlama seansları.", icon: "🧠" },
      { title: "Problem Çözme", desc: "Ekran başında değil, yürüyüş yaparken veya kahve yudumlarken gelen o 'Aha!' anları.", icon: "💡" },
      { title: "Lofi & Odak", desc: "Arka planda çalan hafif lofi müzikleri ile ritmi bulmak.", icon: "🎧" }
    ],
    funFacts: [
      { title: "Tam Bir Gece Kuşu", desc: "En iyi fikirler ve en temiz kodlar genelde sabaha karşı 3 sularında yazılıyor.", icon: "🦉" },
      { title: "Gitar Molası", desc: "Kodda tıkandığımda elektro gitarımı elime alıp birkaç riff çalmak zihnimi sıfırlıyor.", icon: "🎸" },
      { title: "Masa Düzeni", desc: "Karmaşık bir masa bazen ilham verir derler ama benim masam her zaman simetrik ve düzenlidir.", icon: "📐" }
    ]
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveItem(null);
  };

  return (
    <div className="interactive-books">
      <div className="shelf-tabs">
        <button className={`shelf-tab ${activeTab === 'night' ? 'active' : ''}`} onClick={() => handleTabChange('night')}>Gece</button>
        <button className={`shelf-tab ${activeTab === 'work' ? 'active' : ''}`} onClick={() => handleTabChange('work')}>Çalışma</button>
        <button className={`shelf-tab ${activeTab === 'funFacts' ? 'active' : ''}`} onClick={() => handleTabChange('funFacts')}>Gerçekler</button>
      </div>

      <div className="books-list">
        {data[activeTab].map((item, i) => (
          <div key={i} className={`book-item ${activeItem === i ? 'active' : ''}`} onMouseEnter={() => setActiveItem(i)}>
            {item.icon} {item.title}
          </div>
        ))}
      </div>
      <div className="book-details">
        {activeItem !== null ? (
          <motion.div key={activeItem} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h4>{data[activeTab][activeItem].title}</h4>
            <p>{data[activeTab][activeItem].desc}</p>
          </motion.div>
        ) : (
          <p className="book-hint">İncelemek için bir öğenin üzerine gelin.</p>
        )}
      </div>
    </div>
  );
};

const PomodoroTimer = () => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [customMins, setCustomMins] = useState("");

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => setTime(t => t - 1), 1000);
    } else if (!isActive) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const setTimer = (mins) => {
    if (!mins || isNaN(mins) || mins <= 0) return;
    setIsActive(false);
    setSelectedDuration(mins);
    setTime(mins * 60);
    setCustomMins("");
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    setTimer(parseInt(customMins));
  };

  const mins = Math.floor(time / 60).toString().padStart(2, '0');
  const secs = (time % 60).toString().padStart(2, '0');

  return (
    <div className="pomodoro">
      <div className="timer-display">{mins}:{secs}</div>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '15px' }}>
        <button className="status-badge" style={{ background: selectedDuration === 25 ? '#5e5ce6' : '#222', color: '#fff', cursor: 'pointer', border: 'none' }} onClick={() => setTimer(25)}>25 dk (Klasik)</button>
        <button className="status-badge" style={{ background: selectedDuration === 50 ? '#ff9f0a' : '#222', color: '#fff', cursor: 'pointer', border: 'none' }} onClick={() => setTimer(50)}>50 dk (Derin)</button>
        <button className="status-badge" style={{ background: selectedDuration === 5 ? '#32d74b' : '#222', color: '#fff', cursor: 'pointer', border: 'none' }} onClick={() => setTimer(5)}>5 dk (Mola)</button>
        <button className="status-badge" style={{ background: selectedDuration === 10 ? '#30b0c7' : '#222', color: '#fff', cursor: 'pointer', border: 'none' }} onClick={() => setTimer(10)}>10 dk (Mola)</button>
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '5px', background: 'rgba(255, 255, 255, 0.05)', padding: '3px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <input
            type="number"
            value={customMins}
            onChange={(e) => setCustomMins(e.target.value)}
            placeholder="dk"
            style={{ width: '45px', background: 'transparent', border: 'none', color: '#fff', padding: '2px 8px', outline: 'none', fontSize: '0.85rem', textAlign: 'center', fontWeight: '500' }}
            min="1"
          />
          <button type="submit" style={{ background: 'rgba(94, 92, 230, 0.8)', color: '#fff', cursor: 'pointer', border: 'none', padding: '4px 14px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '600', transition: 'all 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = '#5e5ce6'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(94, 92, 230, 0.8)'; e.currentTarget.style.transform = 'scale(1)'; }}>
            Kur
          </button>
        </form>
      </div>
      <div className="timer-controls">
        <button className="timer-btn" onClick={() => setIsActive(!isActive)}>{isActive ? 'Durdur' : 'Başlat'}</button>
        <button className="timer-btn reset" onClick={() => setTimer(selectedDuration)}>Sıfırla</button>
      </div>
      <p className="timer-desc">Farklı odaklanma seviyelerine göre tasarlanmış süre ölçer. Özel süre de ayarlayabilirsiniz.</p>
    </div>
  );
};

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <div className="live-clock"><Clock size={14} /> {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>;
};

const PunchingBagGame = ({ onClose }) => {
  const [hits, setHits] = useState(0);
  const [isPunching, setIsPunching] = useState(false);

  const handlePunch = (e) => {
    e.stopPropagation();
    setHits(prev => prev + 1);
    setIsPunching(true);
    setTimeout(() => setIsPunching(false), 150);
  };

  return (
    <div className="modern-card center punching-game-card" style={{ padding: '15px', background: 'rgba(200, 50, 50, 0.15)', border: '1px solid rgba(200, 50, 50, 0.4)', cursor: 'pointer', userSelect: 'none', transition: 'all 0.1s', position: 'relative' }} onClick={handlePunch} title="Stres atmak için hızlıca tıkla!">
      <button onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ position: 'absolute', top: '5px', right: '5px', background: 'transparent', border: 'none', color: '#ff9f9f', cursor: 'pointer', fontSize: '1rem' }}>✖</button>
      <motion.div
        animate={isPunching ? { rotate: [0, -25, 25, -15, 15, 0], scale: 1.05 } : { rotate: 0, scale: 1 }}
        transition={{ duration: 0.15 }}
        style={{ marginTop: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'center', transformOrigin: 'top center' }}
      >
        <div style={{ position: 'relative', width: '35px', height: '60px', background: '#c0392b', borderRadius: '15px 15px 25px 25px', boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.5), inset 5px 5px 10px rgba(255,255,255,0.2)' }}>
          <div style={{ position: 'absolute', top: '-15px', left: '15px', width: '5px', height: '15px', background: '#7f8c8d' }}></div>
          <div style={{ position: 'absolute', top: '15px', width: '100%', height: '4px', background: 'rgba(0,0,0,0.3)' }}></div>
        </div>
      </motion.div>
      <span style={{ fontWeight: 600, color: '#ff6b6b', fontSize: '1.1rem' }}>Kum Torbası ({hits})</span>
      <span style={{ fontSize: '0.8rem', color: '#ff9f9f', marginTop: '5px' }}>
        {hits === 0 ? "Vurmak için tıkla!" : hits < 20 ? "Daha sert vur!" : hits < 50 ? "Harika kombo!" : "Tyson mısın mübarek!"}
      </span>
    </div>
  );
};

const DisciplineRoutine = () => {
  const [showGame, setShowGame] = useState(false);

  return (
    <div className="content-wrapper">
      <PomodoroTimer />
      <div className="modern-card">
        <h3 style={{ marginBottom: '10px' }}>Fiziksel Dayanıklılık</h3>
        <div className="gym-cards">
          {showGame ? (
            <PunchingBagGame onClose={() => setShowGame(false)} />
          ) : (
            <div className="modern-card center" style={{ padding: '15px', background: 'rgba(200, 50, 50, 0.1)', border: '1px dashed rgba(200, 50, 50, 0.5)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '8px' }} onClick={() => setShowGame(true)} title="Mini Oyunu Başlat!" onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(200, 50, 50, 0.2)'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(200, 50, 50, 0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}>
              <span style={{ fontSize: '2rem' }}>🎮🥊</span>
              <span style={{ fontWeight: 600, color: '#ff9f9f' }}>Boks Antrenmanı</span>
              <span style={{ fontSize: '0.85rem', color: '#a1a1a6', lineHeight: '1.4' }}>Ağır kum torbası seansları. Refleks, patlayıcı güç ve kodlama sonrası stres atmak için birebir. <br /><br /><span style={{ color: '#ff6b6b' }}>(Mini oyunu oynamak için tıkla!)</span></span>
            </div>
          )}
          <div className="modern-card center" style={{ padding: '15px', background: 'rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '2rem' }}>🤸‍♂️</span>
            <span style={{ fontWeight: 600, color: '#fff' }}>Calisthenics</span>
            <span style={{ fontSize: '0.85rem', color: '#a1a1a6', lineHeight: '1.4' }}>Vücut ağırlığıyla güç inşası. Barfiks, amuda kalkma denemeleri ve limitsiz fiziksel & mental irade kontrolü. Spor salonuna ihtiyaç duymadan sınırları zorlamak.</span>
          </div>
        </div>
      </div>
      <div className="modern-card">
        <h3 style={{ marginBottom: '10px' }}>Zihinsel & Çalışma Rutini</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#a1a1a6', fontSize: '0.9rem', lineHeight: '1.8' }}>
          <li>🧠 <b>Deep Work:</b> Dış dünyadan izole, en az 2 saatlik derin odaklanma seansları.</li>
          <li>📝 <b>Planlama:</b> Koda dökmeden önce sistemin mimarisini mutlaka kâğıda çizmek.</li>
          <li>☕ <b>Erken Kalkış:</b> Sabahın ilk saatlerindeki sessizliğin ve kahvenin getirdiği verim.</li>
        </ul>
      </div>
    </div>
  );
};

/* ============================
   MAIN APPLICATION
   ============================ */

function App() {
  const [activeModal, setActiveModal] = useState(null);
  const [introStep, setIntroStep] = useState(0);

  // Easter Egg
  useEffect(() => {
    console.log(
      "%c Sistemin mimarisi ve kedinin sinir katsayısı özenle ayarlandı. İyi Gezintiler! :) ",
      "background: #141419; color: #32d74b; font-size: 14px; font-weight: bold; border-radius: 4px; padding: 10px; border: 1px solid #32d74b;"
    );
  }, []);

  // Advanced Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const audioRef = useRef(null);

  // Parallax & Environment State
  const roomRef = useRef(null);
  const [isNightMode, setIsNightMode] = useState(false);

  // Cat Petting State
  const [isPetting, setIsPetting] = useState(false);
  const [catMessage, setCatMessage] = useState("");
  const petTimeoutRef = useRef(null);
  const clickCountRef = useRef(0);
  const lastClickTimeRef = useRef(0);

  const handleMouseMove = (e) => {
    if (!roomRef.current) return;
    // Fare hareketini doğrudan DOM üzerinden uyguluyoruz, böylece React her karede re-render atıp siteyi kasmaz!
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    roomRef.current.style.transform = `translate(${-x}px, ${-y}px)`;
  };

  const handlePetCat = (e) => {
    e.stopPropagation();

    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    lastClickTimeRef.current = now;

    // Ard arda tıklama kontrolü (3.5 saniyeden kısa aralıklarla tıklanırsa arka arkaya sayılır)
    if (timeSinceLastClick < 3500) {
      clickCountRef.current += 1;
    } else {
      clickCountRef.current = 1;
    }

    setIsPetting(true);

    const normalMessages = [
      "Mrrrr... 😻",
      "Mrrrr... 😻",
      "Miyav! 🐾",
      "Zzz... Hı? Ne oldu?",
      "Patilerime dokunma.",
      "Hoşgeldin, çalışıyor muyuz?"
    ];

    const angryMessages = [
      "Yeter da, git kod yaz!",
      "Dikkatimi dağıtıyorsun, uyuyacağım.",
      "Kafamı çok sevdin, kel kalacağım.",
      "Bak tırmalarım ha...",
      "Klavyene oturmamı mı istiyorsun?",
      "Mama kabım boş, seveceğine mama ver!",
      "Beni sal, ekrana bak sen.",
      "SABRIM TAŞIYOR... 😼"
    ];

    const isSpam = clickCountRef.current >= 4;
    // Spam atılırsa kesinlikle sinirli, normal tıklamada ise %30 ihtimalle sinirli tepki verir (Kedi sonuçta :D)
    const showAngryMessage = isSpam || Math.random() < 0.3;

    if (showAngryMessage) {
      setCatMessage(angryMessages[Math.floor(Math.random() * angryMessages.length)]);
    } else {
      setCatMessage(normalMessages[Math.floor(Math.random() * normalMessages.length)]);
    }

    // Önceki zamanlayıcıyı iptal et (animasyon ve mesaj hemen gitmesin diye)
    if (petTimeoutRef.current) {
      clearTimeout(petTimeoutRef.current);
    }

    petTimeoutRef.current = setTimeout(() => {
      setIsPetting(false);
      setCatMessage("");
      clickCountRef.current = 0;
    }, 2500);
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play prevented", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const togglePlay = (e) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleVolume = (e) => {
    e.stopPropagation();
    setVolume(parseFloat(e.target.value));
  };

  useEffect(() => {
    if (introStep < 4) {
      const timer = setTimeout(() => {
        setIntroStep(prev => prev + 1);
      }, introStep === 0 ? 800 : introStep === 1 ? 1200 : introStep === 2 ? 800 : 1000);
      return () => clearTimeout(timer);
    }
  }, [introStep]);

  const closeModal = () => setActiveModal(null);

  // Modal İçerik Sağlayıcı
  const getModalData = (key) => {
    switch (key) {
      case 'pc': return {
        icon: <Code2 size={28} className="modal-icon" />, title: "Sistem Terminali",
        content: <TerminalComponent />
      };
      case 'hardware': return {
        icon: <Cpu size={28} className="modal-icon" />, title: "Donanım & Lojik",
        content: (
          <div className="content-wrapper">
            <LogicGateSim />
            <div className="modern-card">
              <h3>24 Saatlik Dijital Saat Projesi</h3>
              <p style={{ marginBottom: '10px' }}>74xx Mantık Kapıları, 7490 Sayıcı ve LM358N Entegresi ile breadboard üzerinde sıfırdan kurulan gerçek zamanlı elektronik saat devresi.</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span className="status-badge success">Lojik testler başarılı</span>
                <span className="status-badge" style={{ backgroundColor: 'rgba(94, 92, 230, 0.2)', color: '#5e5ce6' }}>74LS47 Dekoder</span>
                <span className="status-badge" style={{ backgroundColor: 'rgba(94, 92, 230, 0.2)', color: '#5e5ce6' }}>7 Segment Display</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="modern-card center" style={{ padding: '20px' }}>
                <span style={{ fontSize: '2.5rem', marginBottom: '10px', display: 'block' }}>🔌</span>
                <h4 style={{ color: '#fff', marginBottom: '5px' }}>Gömülü Sistemler</h4>
                <p style={{ fontSize: '0.8rem', color: '#a1a1a6' }}>Arduino, ESP32 ve Raspberry Pi ile IoT ve sensör okuma projeleri.</p>
              </div>
              <div className="modern-card center" style={{ padding: '20px' }}>
                <span style={{ fontSize: '2.5rem', marginBottom: '10px', display: 'block' }}>🛠️</span>
                <h4 style={{ color: '#fff', marginBottom: '5px' }}>Atölye Ekipmanları</h4>
                <p style={{ fontSize: '0.8rem', color: '#a1a1a6' }}>Havya, Multimetre ve Osiloskop. Lehim dumanını solumadan kod yazılmaz.</p>
              </div>
            </div>
          </div>
        )
      };
      case 'poster': return {
        icon: <User size={28} className="modal-icon" />, title: "İlham & Kültür",
        content: <PosterModalContent />
      };
      case 'postit-learning': return {
        icon: <Lightbulb size={28} className="modal-icon" style={{ color: '#ffd60a' }} />, title: "Şu An Öğreniyorum",
        content: (
          <div className="content-wrapper">
            <div className="modern-card" style={{ background: '#ffd60a', color: '#000' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontWeight: '600', lineHeight: '1.8' }}>
                <li>[x] React Optimization</li>
                <li>[x] Spring Boot Architecture</li>
                <li>[-] Embedded Systems (WIP)</li>
                <li>[ ] Computer Networks (Pending)</li>
              </ul>
            </div>
          </div>
        )
      };
      case 'calendar': return {
        icon: <Target size={28} className="modal-icon" />, title: "Günün Hedefi",
        content: (
          <div className="content-wrapper">
            <div className="modern-card center" style={{ border: '2px dashed rgba(255,255,255,0.2)' }}>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '15px', color: '#fff' }}>"Bugün dünden daha iyi bir şey üret."</h3>
              <div style={{ color: '#86868b', fontSize: '0.9rem' }}>
                <p>➔ Build</p>
                <p>➔ Break</p>
                <p>➔ Fix</p>
                <p>➔ Repeat</p>
              </div>
            </div>
          </div>
        )
      };
      case 'whiteboard': return {
        icon: <BookOpen size={28} className="modal-icon" />, title: "Sistem Tasarımı & Karalamalar",
        content: (
          <div className="content-wrapper">
            <div className="modern-card" style={{ background: '#fff', color: '#000', fontFamily: 'monospace' }}>
              <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>Project X Architecture</h3>
              <p>- Event-Driven microservices</p>
              <p>- REST APIs + WebSockets</p>
              <p>- Redis caching layer</p>
              <br />
              <p>Logic Gate Idea:</p>
              <p>[A] --|AND|-- [Q]</p>
              <p>[B] --|   |</p>
            </div>
          </div>
        )
      };
      case 'postit-think': return {
        icon: <Cpu size={28} className="modal-icon" style={{ color: '#ff9f0a' }} />, title: "Hatırlatma",
        content: (
          <div className="content-wrapper">
            <div className="modern-card center" style={{ background: '#ff9f0a', color: '#000', fontWeight: 'bold', fontSize: '1.2rem' }}>
              Önce düşün.<br />Sonra kodla.
            </div>
          </div>
        )
      };
      case 'gym': return {
        icon: <Dumbbell size={28} className="modal-icon" />, title: "Disiplin & Rutin",
        content: <DisciplineRoutine />
      };
      case 'shelf': return {
        icon: <BookOpen size={28} className="modal-icon" />, title: "Kitaplık & Arşiv",
        content: <MediaShelf />
      };
      case 'coffee': return {
        icon: <Clock size={28} className="modal-icon" />, title: "Günlük Rutin & Gerçekler",
        content: <CoffeeRoutine />
      };
      case 'window': return {
        icon: <Target size={28} className="modal-icon" />, title: "Şehir & Hayaller",
        content: (
          <div className="content-wrapper">
            <div className="modern-card highlight-card">
              <div className="pulse-indicator"></div>
              <h3>İzmir'den Dünyaya</h3>
              <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                Şu an İzmir'in sıcak, denize çıkan sokaklarında kod yazıyorum.
                Penceremden görünen manzara bir gün global ölçekte yankı uyandıracak projelere açılacak.
                Hayalim, Ege'nin bu güzel şehrinden çıkıp küresel çapta etki yaratan
                donanım ve yazılım sistemleri inşa etmek.
              </p>
            </div>
          </div>
        )
      };
      default: return null;
    }
  };

  const renderIntro = () => (
    <motion.div
      className="bios-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
    >
      <div className="bios-content">
        {introStep >= 1 && <p>ZekiOS(C) 2026</p>}
        {introStep >= 1 && <p>Checking memory... <span>OK</span></p>}
        {introStep >= 2 && <p>Loading modules... <span>DONE</span></p>}
        {introStep >= 3 && <p>Initializing Interactive Subsystems...</p>}
        {introStep >= 4 && (
          <motion.button
            className="bios-btn"
            onClick={() => setIntroStep(5)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Sistemi Başlat [Enter]
          </motion.button>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="app-wrapper" onMouseMove={handleMouseMove}>

      <audio ref={audioRef} src={audioTracks[0].url} loop />

      <AnimatePresence>
        {introStep < 5 && renderIntro()}
      </AnimatePresence>

      {introStep >= 5 && (
        <motion.div
          className="main-layout"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="top-right-controls">
            <LiveClock />
            {/* Gece/Gündüz Şalteri */}
            <button className="theme-toggle" onClick={() => setIsNightMode(!isNightMode)} title="Işıkları Kapat">
              {isNightMode ? <LightbulbOff size={24} /> : <Lightbulb size={24} />}
            </button>
          </div>

          <div className="room-container" style={{ marginTop: 0 }}>
            <div
              ref={roomRef}
              className={`room-background ${isNightMode ? 'night' : ''}`}
            >
              {/* Odanın temel resmi, arka plan yerine img olarak ekleniyor ki kutu tam şeklini alsın */}
              <img src={`${import.meta.env.BASE_URL}oda.png`} alt="Dijital Oda" className="room-image" />

              {/* Lightweight CRT & Vignette Effect */}
              <div className="crt-overlay"></div>
              <div className="vignette-overlay"></div>

              <div className="hud-box pc-area" onClick={() => setActiveModal('pc')}>
                <span className="hud-icon">💻</span>
                <div className="hud-label">💻 Yazılım Terminali</div>
              </div>
              <div className="hud-box hardware-area" onClick={() => setActiveModal('hardware')}>
                <span className="hud-icon">⚙️</span>
                <div className="hud-label">⚙️ Donanım</div>
              </div>
              <div className="hud-box poster-area" onClick={() => setActiveModal('poster')}>
                <span className="hud-icon">👾</span>
                <div className="hud-label">👾 İlham & Kültür</div>
              </div>
              <div className="hud-box gym-area" onClick={() => setActiveModal('gym')}>
                <span className="hud-icon">🥊</span>
                <div className="hud-label">🥊 Disiplin</div>
              </div>
              <div className="hud-box shelf-area" onClick={() => setActiveModal('shelf')}>
                <span className="hud-icon">📚</span>
                <div className="hud-label">📚 Kitaplık</div>
              </div>
              <div className="hud-box window-area" onClick={() => setActiveModal('window')}>
                <span className="hud-icon">🌅</span>
                <div className="hud-label">🌅 Manzara</div>
              </div>
              <div className="hud-box coffee-area" onClick={() => setActiveModal('coffee')}>
                <span className="hud-icon">☕</span>
                <div className="hud-label">☕ Rutin</div>
              </div>

              {/* Çevresel Hikaye Anlatımı Alanları */}
              <div className="hud-box story-point postit-learning-area" onClick={() => setActiveModal('postit-learning')}>
                <span className="hud-icon">📝</span>
                <div className="hud-label">Şu An Öğreniyorum</div>
              </div>
              <div className="hud-box story-point calendar-area" onClick={() => setActiveModal('calendar')}>
                <span className="hud-icon">📅</span>
                <div className="hud-label">Günün Hedefi</div>
              </div>
              <div className="hud-box story-point whiteboard-area" onClick={() => setActiveModal('whiteboard')}>
                <span className="hud-icon">📋</span>
                <div className="hud-label">Sistem Tasarımı</div>
              </div>
              <div className="hud-box story-point postit-think-area" onClick={() => setActiveModal('postit-think')}>
                <span className="hud-icon">📌</span>
                <div className="hud-label">Hatırlatma</div>
              </div>

              {/* Kedi Tıklama Alanı */}
              <div className="hud-box cat-area" onClick={handlePetCat}>
                <span className="hud-icon">🐈</span>
                <div className="cat-name-tag">🐾 Açgöz</div>
                {catMessage && (
                  <div className="cat-speech-bubble">
                    {catMessage}
                  </div>
                )}
                {isPetting && (
                  <div className="petting-animation">
                    <span className="hand-emoji">🤚</span>
                    <span className="heart h1">❤️</span>
                    <span className="heart h2">💖</span>
                    <span className="heart h3">✨</span>
                    <span className="heart h4">❤️</span>
                  </div>
                )}
              </div>

              {/* Gece Modu Karanlık Katmanı */}
              {isNightMode && (
                <>
                  <div className="darkness-overlay"></div>
                  <div className="monitor-glow"></div>
                </>
              )}
            </div>
          </div>

          <div className="advanced-audio-widget">
            <div className="audio-header">
              <button className="play-btn" onClick={togglePlay}>
                {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <div className="audio-info">
                <span className="track-name">{audioTracks[0].name}</span>
                <span className="track-status">{isPlaying ? 'Çalıyor...' : 'Duraklatıldı'}</span>
              </div>
            </div>
            <div className="audio-controls">
              <input
                type="range" min="0" max="1" step="0.01"
                value={volume} onChange={handleVolume} className="volume-slider"
              />
            </div>
          </div>

        </motion.div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className={`classy-modal ${isNightMode ? 'night-modal' : ''}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-btn" onClick={closeModal}><X size={24} /></button>
              <div className="modal-header">
                {getModalData(activeModal).icon}
                <h2>{getModalData(activeModal).title}</h2>
              </div>
              <div className="modal-body">
                {getModalData(activeModal).content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;