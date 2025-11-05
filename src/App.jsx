import React, { useState, useEffect,useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const App = () => {
  // === STATE MANAGEMENT ===
  const [scene, setScene] = useState('splash');
  const [showFlash, setShowFlash] = useState(false);
  const [particles, setParticles] = useState([]);

  // === LOGIN ===
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // === AUDIO & SOUND ===
  const [audioError, setAudioError] = useState('');
  const [audioRef, setAudioRef] = useState(null);
  const [portalAudioRef, setPortalAudioRef] = useState(null);
  const [clueAudioPlaying, setClueAudioPlaying] = useState(null);
  const [clueButtonAudioRef, setClueButtonAudioRef] = useState(null);
  const specialAudioRef = useRef(null);
  const [currentPortalMusic, setCurrentPortalMusic] = useState(null);

  // === CLUES / HINTS ===
  const [showClues, setShowClues] = useState(false);

  // === PORTALS ===
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [currentPortalIndex, setCurrentPortalIndex] = useState(0);

  // === GALLERY / CATEGORY ===
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // === SPECIAL MODE ===
  const [showSpecialModal, setShowSpecialModal] = useState(false);
  const [specialInput, setSpecialInput] = useState('');
  const [specialUnlocked, setSpecialUnlocked] = useState(false);
  const [specialError, setSpecialError] = useState('');
  const [showSpecialPhoto, setShowSpecialPhoto] = useState(false);

  // === GAMES ===
  const [selectedGame, setSelectedGame] = useState(null);

  // Memory Game
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  // Tambahkan state baru di bagian atas
  const [isLoadingMemory, setIsLoadingMemory] = useState(false);

  // Catch Game
  const [catchHearts, setCatchHearts] = useState(0);
  const [basketPosition, setBasketPosition] = useState(50);
  const [fallingItems, setFallingItems] = useState([]);
  const [catchGameActive, setCatchGameActive] = useState(false);
  const [catchMessage, setCatchMessage] = useState('');
  const [catchBackground, setCatchBackground] = useState('default');

  // === STARS PORTAL ===
  const [starsPhase, setStarsPhase] = useState('constellation');
  const [constellationProgress, setConstellationProgress] = useState(0);
  const [selectedStar, setSelectedStar] = useState(null);
  const [foundEasterEgg, setFoundEasterEgg] = useState(false);
  const [meteors, setMeteors] = useState([]);
  const [showUFO, setShowUFO] = useState(false);

  // State tambahan untuk UFO sound
  const [ufoAudio, setUfoAudio] = useState(null);

  const portals = ['gallery', 'games', 'timeline', 'stars', 'letter', 'cake', 'finale'];

  const playPortalAudio = (portalIndex) => {
    const audioPath = `/audio/soundportal${portalIndex + 1}.mp3`;
    const audio = new Audio(audioPath);
    audio.volume = 0.2;
    setPortalAudioRef(audio);
    
    audio.play().catch(err => {
      console.error('Portal audio error:', err);
    });
  };

  const goToNextPortal = () => {
    if (currentPortalIndex < portals.length - 1) {
      // Stop portal audio (sound effect)
      if (portalAudioRef) {
        portalAudioRef.pause();
        portalAudioRef.currentTime = 0;
      }
      
      // Stop current portal music - AKAN OTOMATIS DIGANTI useEffect
      if (currentPortalMusic) {
        currentPortalMusic.pause();
        currentPortalMusic.currentTime = 0;
      }
      
      setCurrentPortalIndex(currentPortalIndex + 1);
      setSelectedPortal(portals[currentPortalIndex + 1]);
      setSelectedCategory(null);
      setSelectedPhoto(null);
      setSelectedGame(null);
      setCatchGameActive(false);
    
      playPortalAudio(currentPortalIndex + 1);
    }
  };
  
  const goToPrevPortal = () => {
    if (currentPortalIndex > 0) {
      // Stop portal audio (sound effect)
      if (portalAudioRef) {
        portalAudioRef.pause();
        portalAudioRef.currentTime = 0;
      }
      
      // Stop current portal music - AKAN OTOMATIS DIGANTI useEffect
      if (currentPortalMusic) {
        currentPortalMusic.pause();
        currentPortalMusic.currentTime = 0;
      }
      
      setCurrentPortalIndex(currentPortalIndex - 1);
      setSelectedPortal(portals[currentPortalIndex - 1]);
      setSelectedCategory(null);
      setSelectedPhoto(null);
      setSelectedGame(null);
      setCatchGameActive(false);
      
      playPortalAudio(currentPortalIndex - 1);
    }
  };

  const startExperience = async () => {
    const audio = new Audio('/audio/intro.mp3');
    audio.volume = 1.0;
    setAudioRef(audio);
    
    try {
      await audio.play();
      console.log('✅ Audio playing!');
      setScene('intro');
    } catch (err) {
      console.error('❌ Audio error:', err);
      setAudioError('Audio tidak dapat diputar, tetapi animasi tetap berjalan');
      setTimeout(() => setAudioError(''), 3000);
      setScene('intro');
    }
  };

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (scene === 'intro' && audioRef) {
      const timer = setTimeout(() => {
        setShowFlash(true);
        setTimeout(() => {
          setScene('login');
          setShowFlash(false);
        }, 500);
      }, 37000);

      return () => {
        clearTimeout(timer);
        if (audioRef) {
          audioRef.pause();
          audioRef.currentTime = 0;
        }
      };
    }
  }, [scene, audioRef]);

  // Tambahkan useEffect untuk memainkan soundeffect saat showSpecialPhoto true
  useEffect(() => {
    if (showSpecialPhoto) {
      // Hentikan audio sebelumnya jika masih ada
      if (specialAudioRef.current) {
        specialAudioRef.current.pause();
        specialAudioRef.current.currentTime = 0;
      }
      
      // Buat audio baru
      const audio = new Audio('/audio/soundeffect1.mp3');
      audio.volume = 1.0;
      audio.loop = false; // Pastikan tidak looping
      specialAudioRef.current = audio;
      
      // Mainkan audio
      audio.play().catch(err => {
        console.error('Special audio error:', err);
      });
      
      // Opsional: Cleanup saat audio selesai (untuk memastikan tidak ada sisa)
      audio.onended = () => {
        specialAudioRef.current = null;
      };
    } else {
      // Pause audio jika modal ditutup
      if (specialAudioRef.current) {
        specialAudioRef.current.pause();
        specialAudioRef.current.currentTime = 0;
        specialAudioRef.current = null; // Reset ref
      }
    }
  }, [showSpecialPhoto]); // Hanya bergantung pada showSpecialPhoto

  const handleLogin = () => {
    if (!username || !password) {
      // bunyi error saat field kosong
      const audio = new Audio('/audio/sounderror.mp3');
      audio.play().catch(() => {});
      setLoginError('Masukin username dan password dulu ya, biar hatiku juga bisa masuk 💕');
      setTimeout(() => setLoginError(''), 3000);
      return;
    }

    if (username === 'Jejell' && password === '04112003') {
      console.log('🎵 Metallic chime sound');
      setLoginError('');
      setCurrentPortalIndex(0);
      setSelectedPortal('gallery');
      setScene('portals');

      playPortalAudio(0);
    } else {
      const audio = new Audio("/audio/sounderror.mp3");
      audio.play().catch(() => {});

      setLoginError('Login gagal, tapi koneksi hatinya udah tersambung 😍');
      setTimeout(() => setLoginError(''), 3000);
    }
  };

  const handleSpecialSubmit = () => {
    const correctPhrase = "Jejell akan menjadi kuat dan berani seperti superhero";

    if (specialInput.trim() === correctPhrase) {
      // ✅ SOUND BENAR
      const audio = new Audio("/audio/soundcorrect.mp3");
      audio.play().catch(() => {});

      setSpecialUnlocked(true);
      setSpecialError('');
      setShowSpecialModal(false);
      setSpecialInput('');

      setTimeout(() => {
        setShowSpecialPhoto(true);
      }, 500);
    } else {
      // ❌ SOUND SALAH
      const audio = new Audio("/audio/sounderror2.mp3");
      audio.play().catch(() => {});

      setSpecialError('Oops typo! Teliti yaa bububb kayak apis yang teliti milih bubub 🤭');
      setTimeout(() => setSpecialError(''), 3000);
    }
  };


  const playClueAudio = (type) => {
    const audioPath = type === 'username' ? '/audio/userclue.mp3' : '/audio/passclue.mp3';
    const audio = new Audio(audioPath);
    audio.volume = 1.0;
    setClueAudioPlaying(type);
    
    audio.play().catch(err => {
      console.error('Audio error:', err);
      alert('Audio tidak dapat diputar');
    });

    audio.onended = () => {
      setClueAudioPlaying(null);
    };
  };

  // ✅ Auto-init memory game saat pertama kali dibuka
  useEffect(() => {
    if (selectedGame === 'memory' && memoryCards.length === 0 && !isLoadingMemory) {
      initMemoryGame();
    }
  }, [selectedGame]);

  // ✅ Tambahkan fungsi preload di atas initMemoryGame
  const preloadImages = (cards) => {
    cards.forEach(card => {
      const img = new Image();
      img.src = card.path;
    });
  };

  // ✅ Update initMemoryGame - panggil preload setelah set cards
  const initMemoryGame = () => {
    if (isLoadingMemory) return;
    setIsLoadingMemory(true);

    setFlippedCards([]);
    setMatchedCards([]);
    setMemoryMoves(0);
    setMemoryCards([]);

    setTimeout(() => {
      const categories = ['selfie', 'model', 'formal', 'grid', 'mirror'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const maxPhotos = randomCategory === 'selfie' ? 19 : 
                        randomCategory === 'model' ? 4 : 
                        randomCategory === 'formal' ? 2 : 
                        randomCategory === 'grid' ? 4 : 5;

      const selectedPhotos = [];
      const usedIndices = new Set();

      while (selectedPhotos.length < 6) {
        const randomIndex = Math.floor(Math.random() * maxPhotos);
        if (!usedIndices.has(randomIndex)) {
          usedIndices.add(randomIndex);
          selectedPhotos.push({
            id: selectedPhotos.length,
            category: randomCategory,
            index: randomIndex,
            path: `/image/${randomCategory}/${randomCategory}${randomIndex + 1}.jpg`
          });
        }
      }

      const cardPairs = [...selectedPhotos, ...selectedPhotos].map((card, idx) => ({
        ...card,
        uniqueId: idx
      }));

      for (let i = cardPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
      }

      // ✅ Preload images SEBELUM set cards
      preloadImages(cardPairs);

      setMemoryCards(cardPairs);
      setIsLoadingMemory(false);
    }, 200);
  };

  const handleCardClick = (cardId) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) {
      return;
    }

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(memoryMoves + 1);
      const [first, second] = newFlipped;
      const firstCard = memoryCards.find(c => c.uniqueId === first);
      const secondCard = memoryCards.find(c => c.uniqueId === second);

      if (firstCard.id === secondCard.id) {
        setTimeout(() => {
          setMatchedCards([...matchedCards, first, second]);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Catch Hearts Game Functions
  const startCatchGame = () => {
    setCatchGameActive(true);
    setCatchHearts(0);
    setBasketPosition(50);
    setFallingItems([]);
    setCatchMessage('');
    setCatchBackground('default');
  };

  useEffect(() => {
    if (!catchGameActive) return;

    const spawnInterval = setInterval(() => {
      const isHeart = Math.random() > 0.15;
      const newItem = {
        id: Date.now() + Math.random(),
        x: Math.random() * 90,
        y: -10,
        isHeart,
        speed: 2 + Math.random() * 2
      };
      setFallingItems(prev => [...prev, newItem]);
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [catchGameActive]);

  useEffect(() => {
    if (!catchGameActive) return;

    const moveInterval = setInterval(() => {
      setFallingItems(prev => {
        const updated = prev.map(item => ({
          ...item,
          y: item.y + item.speed
        }));

        updated.forEach(item => {
          if (item.y > 75 && item.y < 85) {
            if (Math.abs(item.x - basketPosition) < 8) {
              if (item.isHeart) {
                const newCount = catchHearts + 1;
                setCatchHearts(newCount);
                
                if (newCount === 10) setCatchMessage("Setiap hati ini, satu untuk kamu. ❤️");
                else if (newCount === 20) setCatchMessage("Kamu nggak sadar, tapi kamu selalu bisa nangkep hatiku juga. 💕");
                else if (newCount === 30) {
                  setCatchMessage("Love meter +1 — makin sayang tiap detik 😚");
                  setCatchBackground('petals');
                }
                else if (newCount === 40) setCatchMessage("You're my favorite person to fall for. 💘");
                else if (newCount === 50) {
                  setCatchMessage("My world gets brighter every time I see you.");
                  setCatchBackground('night');
                }
                else if (newCount === 60) setCatchMessage("You're loved more than you know 💗");
                else if (newCount === 70) setCatchMessage("🎁 Unlocked: 💋💞🌷 (Special Stickers!)");
                else if (newCount === 80) setCatchMessage("You're not just catching hearts… you're catching mine. 💓");
                else if (newCount === 90) setCatchBackground('glowing');
                else if (newCount === 100) {
                  setCatchMessage("100 hearts for the one who already has mine. ❤️ I love you, Jejell.");
                  setCatchBackground('aurora');
                }
                
                setTimeout(() => setCatchMessage(''), 3000);
              } else {
                const newCount = Math.max(0, catchHearts - 5);
                setCatchHearts(newCount);
                setCatchMessage("💔 Heart Bomb! -5 hearts");
                setTimeout(() => setCatchMessage(''), 2000);
              }
              item.y = 100;
            }
          }
        });

        return updated.filter(item => item.y < 100);
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, [catchGameActive, basketPosition, catchHearts]);

  useEffect(() => {
    if (!catchGameActive) return;

    const handleMouseMove = (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      setBasketPosition(Math.max(5, Math.min(95, x)));
    };

    const gameArea = document.getElementById('catch-game-area');
    if (gameArea) {
      gameArea.addEventListener('mousemove', handleMouseMove);
      return () => gameArea.removeEventListener('mousemove', handleMouseMove);
    }
  }, [catchGameActive]);

  // Constellation animation effect
  useEffect(() => {
    if (selectedPortal === 'stars' && starsPhase === 'constellation') {
      const interval = setInterval(() => {
        setConstellationProgress(prev => {
          if (prev >= 135) {
            clearInterval(interval);
            // Delay 2 detik setelah 100% baru pindah ke interactive
            setTimeout(() => setStarsPhase('interactive'), 2000);
            return 135;
          }
          return prev + 1;
        });
      }, 40); // Dipercepat sedikit: 50ms -> 40ms agar total ~4 detik

      return () => clearInterval(interval);
    }
  }, [selectedPortal, starsPhase]);

// Meteor shower effect
  useEffect(() => {
    if (selectedPortal === 'stars' && starsPhase === 'interactive') {
      const meteorInterval = setInterval(() => {
        const wishes = [
          'Sehat selalu ya bububb sayangg..💫',
          'Semoga semua impianmu tercapai ✨',
          'Love you to the moon and back 🌙',
          'Forever grateful for you 💖',
          'You make my world brighter ⭐',
          'Best birthday ever! 🎉'
        ];

        const newMeteor = {
          id: Date.now(),
          x: Math.random() * 60 + 15,  // ✅ UBAH: 15-75% (lebih aman dari pinggir)
          y: Math.random() * 40 + 30,  // 30-70%
          rotation: -45 + (Math.random() * 20 - 10),
          wish: wishes[Math.floor(Math.random() * wishes.length)]
        };

        setMeteors(prev => [...prev, newMeteor]);

        setTimeout(() => {
          setMeteors(prev => prev.filter(m => m.id !== newMeteor.id));
        }, 4000);
      }, 3000);

      return () => clearInterval(meteorInterval);
    }
  }, [selectedPortal, starsPhase]);

  // UFO Easter Egg
  useEffect(() => {
    if (selectedPortal === 'stars' && starsPhase === 'interactive') {
      const ufoTimer = setTimeout(() => {
        setShowUFO(true);

        // Play UFO sound when animation starts
        const audio = new Audio('/audio/soundufo.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {});
        setUfoAudio(audio); // simpan referensi audio UFO
      }, 5000);

      // Cleanup
      return () => {
        clearTimeout(ufoTimer);
        if (ufoAudio) {
          ufoAudio.pause();
          ufoAudio.currentTime = 0;
        }
      };
    }
  }, [selectedPortal, starsPhase]);

  // Portal Music Management
  useEffect(() => {
    if (scene === 'portals' && selectedPortal) {
      // Stop previous portal music
      if (currentPortalMusic) {
        currentPortalMusic.pause();
        currentPortalMusic.currentTime = 0;
      }

      // Stop UFO sound ketika ganti portal
      if (ufoAudio) {
        ufoAudio.pause();
        ufoAudio.currentTime = 0;
      }

      // Audio mapping untuk setiap portal
      const portalMusicMap = {
        gallery: '/audio/musicgallery.mp3',
        games: '/audio/musicgames.mp3',
        timeline: '/audio/musictimeline.mp3',
        stars: '/audio/musicstars.mp3',
        letter: '/audio/musicletter.mp3',
        cake: '/audio/musiccake.mp3',
        finale: '/audio/musicclosing.mp3'
      };

      const musicPath = portalMusicMap[selectedPortal];
      if (musicPath) {
        const audio = new Audio(musicPath);
        audio.volume = 0.3;
        audio.loop = true;
        setCurrentPortalMusic(audio);

        audio.play().catch(err => {
          console.error('Portal music error:', err);
        });
      }
    }

    // Cleanup: stop music when leaving portals
    return () => {
      if (currentPortalMusic) {
        currentPortalMusic.pause();
        currentPortalMusic.currentTime = 0;
      }
      // Stop UFO sound juga saat keluar scene
      if (ufoAudio) {
        ufoAudio.pause();
        ufoAudio.currentTime = 0;
      }
    };
  }, [selectedPortal, scene]);


  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Splash Screen */}
      <AnimatePresence>
        {scene === 'splash' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center bg-black z-50 cursor-pointer"
            onClick={startExperience}
          >
            <div className="text-center space-y-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex items-center justify-center gap-3"
              >
                <div className="bg-red-600 px-3 py-1.5">
                  <h1 className="text-4xl font-black text-white" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                    JEJELL
                  </h1>
                </div>
                <div className="bg-black border-2 border-white px-3 py-1.5">
                  <h2 className="text-3xl font-bold text-white tracking-widest" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                    STUDIOS
                  </h2>
                </div>
              </motion.div>

              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 border-4 border-cyan-400 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyan-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white tracking-wider">CLICK TO START</p>
                <p className="text-sm text-gray-500">Audio will play automatically</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Error Message */}
      {audioError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-500/90 text-black px-6 py-2 rounded-full text-sm font-bold animate-pulse">
          {audioError}
        </div>
      )}

      {/* Login Error Message */}
      {loginError && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none"
        >
          <div className="bg-red-700/90 text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 pointer-events-auto">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {loginError}
          </div>
        </motion.div>
      )}
      
      {/* Animated Particles Background */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-blue-400/30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Flash Transition */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white z-50"
          />
        )}
      </AnimatePresence>

      {/* Scene 1: Intro Animation */}
      <AnimatePresence>
        {scene === 'intro' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black" />
            
            {[0, 0.3, 0.6, 0.9, 1.2].map((delay, idx) => (
              <motion.div
                key={`ring-${idx}`}
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{ scale: [0, 4, 4], opacity: [0, 0.6, 0], rotate: [0, 180, 180] }}
                transition={{ duration: 4, delay, ease: 'easeOut' }}
                className={`absolute w-96 h-96 border-4 rounded-full ${idx % 2 === 0 ? 'border-red-500' : 'border-cyan-400'}`}
              />
            ))}

            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`hex-${i}`}
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{ scale: [0, 2, 1.5], opacity: [0, 0.8, 0], rotate: [0, 360, 360] }}
                transition={{ duration: 5, delay: 5 + (i * 0.2), ease: 'easeInOut' }}
                className="absolute"
                style={{
                  width: `${100 + i * 50}px`,
                  height: `${100 + i * 50}px`,
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  border: '3px solid',
                  borderColor: i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#22d3ee' : '#fbbf24'
                }}
              />
            ))}

            {[...Array(24)].map((_, i) => (
              <motion.div
                key={`burst-${i}`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: [0, 2, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, delay: 8 + (i * 0.08), repeat: 2, repeatDelay: 0.3 }}
                className="absolute h-1"
                style={{
                  width: '600px',
                  background: `linear-gradient(to right, transparent, ${i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#22d3ee' : '#fff'}, transparent)`,
                  transform: `rotate(${i * 15}deg)`,
                  transformOrigin: 'center'
                }}
              />
            ))}

            {[...Array(40)].map((_, i) => {
              const angle = (i / 40) * Math.PI * 2;
              const distance = 200 + Math.random() * 200;
              return (
                <motion.div
                  key={`particle-${i}`}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ 
                    x: [0, Math.cos(angle) * distance],
                    y: [0, Math.sin(angle) * distance],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 4, delay: 12 + (i * 0.05), ease: 'easeOut' }}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#22d3ee' : '#fbbf24',
                    boxShadow: `0 0 10px ${i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#22d3ee' : '#fbbf24'}`
                  }}
                />
              );
            })}

            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`square-${i}`}
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{ scale: [0, 1.5, 0], opacity: [0, 0.7, 0], rotate: [0, 720, 720] }}
                transition={{ duration: 6, delay: 16 + (i * 0.3), ease: 'easeInOut' }}
                className="absolute border-4"
                style={{
                  width: `${80 + i * 40}px`,
                  height: `${80 + i * 40}px`,
                  borderColor: i % 2 === 0 ? '#ef4444' : '#22d3ee'
                }}
              />
            ))}
            
            <div className="relative z-10 flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, opacity: 0, rotateY: -180, z: -1000 }}
                animate={{ 
                  scale: [0, 1.5, 1.2, 1],
                  opacity: [0, 1, 1, 1],
                  rotateY: [180, 0, 0, 0],
                  z: [-1000, 100, 50, 0]
                }}
                transition={{ duration: 2.5, ease: 'backOut', times: [0, 0.6, 0.85, 1] }}
                className="relative bg-red-600 px-6 py-3 flex items-center justify-center"
                style={{
                  boxShadow: '0 0 60px rgba(220, 38, 38, 1), inset 0 0 20px rgba(255, 255, 255, 0.2)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <motion.div
                  animate={{ x: [0, -2, 2, -2, 0], opacity: [0, 0.3, 0.3, 0.3, 0] }}
                  transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 8, delay: 10 }}
                  className="absolute inset-0 bg-cyan-400 mix-blend-screen"
                />
                
                <motion.h1 
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(220, 38, 38, 0.8)',
                      '0 0 60px rgba(255,255,255,1), 0 0 80px rgba(220, 38, 38, 1)',
                      '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(220, 38, 38, 0.8)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 3 }}
                  className="text-7xl font-black tracking-tight text-white relative z-10"
                  style={{ fontFamily: 'Arial Black, sans-serif', letterSpacing: '-0.02em' }}
                >
                  JEJELL
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 0.2, delay: 10, repeat: 15, repeatDelay: 0.2 }}
                  className="absolute inset-0 border-2 border-yellow-300"
                />
              </motion.div>

              <motion.div
                initial={{ scale: 0, opacity: 0, rotateY: 180, z: -1000 }}
                animate={{ 
                  scale: [0, 1.5, 1.2, 1],
                  opacity: [0, 1, 1, 1],
                  rotateY: [-180, 0, 0, 0],
                  z: [-1000, 100, 50, 0]
                }}
                transition={{ duration: 2.5, delay: 0.5, ease: 'backOut', times: [0, 0.6, 0.85, 1] }}
                className="relative bg-black border-4 border-white px-6 py-3 flex items-center justify-center"
                style={{
                  boxShadow: '0 0 50px rgba(255, 255, 255, 0.5), inset 0 0 20px rgba(34, 211, 238, 0.2)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <motion.div
                  animate={{ x: [0, 2, -2, 2, 0], opacity: [0, 0.3, 0.3, 0.3, 0] }}
                  transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 8, delay: 10.15 }}
                  className="absolute inset-0 bg-red-500 mix-blend-screen"
                />

                <motion.h2
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(34, 211, 238, 0.5), 0 0 40px rgba(255,255,255,0.5)',
                      '0 0 60px rgba(34, 211, 238, 1), 0 0 80px rgba(255,255,255,1)',
                      '0 0 20px rgba(34, 211, 238, 0.5), 0 0 40px rgba(255,255,255,0.5)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 3.5 }}
                  className="text-5xl font-bold tracking-widest text-white relative z-10"
                  style={{ fontFamily: 'Arial Black, sans-serif', letterSpacing: '0.15em' }}
                >
                  STUDIOS
                </motion.h2>
              </motion.div>
              
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{ duration: 1.5, delay: 2, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-80"
                style={{ mixBlendMode: 'overlay' }}
              />

              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`spark-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0, 1, 0], scale: [1, 1.02, 1, 1.02, 1], rotate: [0, 2, -2, 2, 0] }}
                  transition={{ duration: 0.15, delay: 10 + (i * 0.8), repeat: 3, repeatDelay: 0.1 }}
                  className="absolute inset-0 border-4 border-yellow-300"
                  style={{ mixBlendMode: 'screen', boxShadow: '0 0 20px rgba(253, 224, 71, 0.8)' }}
                />
              ))}

              <motion.div
                animate={{ x: [0, -3, 3, -3, 3, -2, 2, 0], y: [0, 2, -2, 2, -2, 1, -1, 0] }}
                transition={{ duration: 0.4, delay: 19, repeat: 4, repeatDelay: 0.2 }}
                className="absolute inset-0"
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.1, delay: 22, repeat: 10, repeatDelay: 0.2 }}
                className="absolute inset-0 bg-white mix-blend-difference"
              />

              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 5, 6], opacity: [0, 1, 0] }}
                transition={{ duration: 2.5, delay: 34, ease: 'easeOut' }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-white blur-3xl"
              />

              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: [0, 3, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, delay: 34.5 + (i * 0.03), ease: 'easeOut' }}
                  className="absolute w-[600px] h-2 bg-white blur-sm"
                  style={{ transform: `rotate(${i * 22.5}deg)`, transformOrigin: 'center' }}
                />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.5 }}
              animate={{ 
                opacity: [0, 1, 1, 1, 0], 
                y: [100, 0, 0, 0, -50],
                scale: [0.5, 1.2, 1, 1, 0.8]
              }}
              transition={{ duration: 7, delay: 25, times: [0, 0.15, 0.3, 0.85, 1], ease: 'easeOut' }}
              className="absolute bottom-20 text-center"
            >
              <motion.p 
                className="text-5xl font-black text-cyan-400 tracking-wider"
                style={{ fontFamily: 'Arial Black, sans-serif' }}
              >
                WELCOME TO JEJELLVERSE
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [0, 1, 1, 0] }}
                transition={{ duration: 7, delay: 25.3, times: [0, 0.2, 0.8, 1] }}
                className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-2 mx-auto"
                style={{ width: '100%' }}
              />

              {[...Array(20)].map((_, i) => {
                const angle = (i / 20) * Math.PI * 2;
                const radius = 150;
                return (
                  <motion.div
                    key={`sparkle-${i}`}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ 
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      x: [0, Math.cos(angle) * radius],
                      y: [0, Math.sin(angle) * radius]
                    }}
                    transition={{ duration: 2, delay: 26 + (i * 0.05), ease: 'easeOut' }}
                    className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full"
                    style={{ boxShadow: '0 0 6px #fff, 0 0 12px #22d3ee' }}
                  />
                );
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene 2: Login Page */}
      <AnimatePresence>
        {scene === 'login' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <motion.div
              animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-black"
              style={{ backgroundSize: '200% 200%' }}
            />

            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 blur-xl"
            />

            <motion.div
              animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-40 right-32 w-48 h-48 rounded-full bg-gradient-to-br from-red-500/10 to-orange-500/10 blur-xl"
            />

            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 right-20 w-24 h-24 border-4 border-yellow-400/30 rounded-full"
            />

            <motion.div
              animate={{ opacity: [0, 0.8, 0], scaleY: [0, 1, 0] }}
              transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 5 }}
              className="absolute top-0 left-1/4 w-1 h-64 bg-gradient-to-b from-blue-400 to-transparent"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                className="relative z-10 w-full max-w-md p-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/85 to-gray-900/85 backdrop-blur-xl rounded-3xl border border-blue-400/40 shadow-2xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/8 to-indigo-500/8 rounded-3xl animate-pulse" />

                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="text-center mb-8"
                  >
                    <h2 className="text-4xl font-black bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent mb-2">
                      JEJELL
                    </h2>
                    <p className="text-sm text-cyan-400 tracking-widest">STUDIOS</p>
                  </motion.div>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="text-center text-gray-400 mb-8 text-sm tracking-wide"
                  >
                    Welcome to Jejellverse 
                  </motion.p>

                  <div className="space-y-6">
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.7 }}
                    >
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.9 }}
                    >
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                      />
                    </motion.div>

                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 2.1 }}
                      whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(34, 211, 238, 0.5)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogin}
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/80 transition-all duration-300 cursor-pointer"
                    >
                      LOGIN
                    </motion.button>

                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.7 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        // Play sound effect
                        const audio = new Audio('/audio/soundclue.mp3');
                        audio.volume = 1.0;
                        setClueButtonAudioRef(audio);
                        audio.play().catch(err => {
                          console.error('Clue button audio error:', err);
                        });

                        // Show clues modal
                        setShowClues(true);
                      }}
                      className="mt-4 w-full py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white text-sm font-bold rounded-lg shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/50 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
                      </svg>
                      CLUE
                    </motion.button>
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5 }}
                    className="text-center text-gray-600 text-xs mt-8"
                  >
                    Selamat Datang di Dunia Jejell
                  </motion.p>
                </div>

                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-2xl" />
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-2xl" />
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-2xl" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-cyan-400/50 rounded-br-2xl" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clue Modal */}
      <AnimatePresence>
        {showClues && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowClues(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl p-8 rounded-2xl border border-cyan-500/30 shadow-2xl max-w-md w-full mx-4"
            >
              <button
                onClick={() => setShowClues(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center mb-8">
                <h3 className="text-3xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text mb-2">
                  CLUE
                </h3>
                <p className="text-sm text-gray-400">Dengarkan petunjuk untuk login</p>
              </div>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => playClueAudio('username')}
                  disabled={clueAudioPlaying !== null}
                  className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
                    clueAudioPlaying === 'username'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-700 shadow-lg shadow-cyan-500/50 animate-pulse'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/60'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    {clueAudioPlaying === 'username' ? (
                      <>
                        <rect x="6" y="4" width="3" height="12" rx="1.5">
                          <animate attributeName="height" values="12;6;12" dur="0.6s" repeatCount="indefinite"/>
                          <animate attributeName="y" values="4;7;4" dur="0.6s" repeatCount="indefinite"/>
                        </rect>
                        <rect x="11" y="4" width="3" height="12" rx="1.5">
                          <animate attributeName="height" values="8;12;8" dur="0.6s" repeatCount="indefinite" begin="0.2s"/>
                          <animate attributeName="y" values="6;4;6" dur="0.6s" repeatCount="indefinite" begin="0.2s"/>
                        </rect>
                      </>
                    ) : (
                      <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"/>
                    )}
                  </svg>
                  <span className="text-white">
                    {clueAudioPlaying === 'username' ? 'Playing...' : 'Username Clue'}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => playClueAudio('password')}
                  disabled={clueAudioPlaying !== null}
                  className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 ${
                    clueAudioPlaying === 'password'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-700 shadow-lg shadow-purple-500/50 animate-pulse'
                      : 'bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30 hover:shadow-purple-500/60'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    {clueAudioPlaying === 'password' ? (
                      <>
                        <rect x="6" y="4" width="3" height="12" rx="1.5">
                          <animate attributeName="height" values="12;6;12" dur="0.6s" repeatCount="indefinite"/>
                          <animate attributeName="y" values="4;7;4" dur="0.6s" repeatCount="indefinite"/>
                        </rect>
                        <rect x="11" y="4" width="3" height="12" rx="1.5">
                          <animate attributeName="height" values="8;12;8" dur="0.6s" repeatCount="indefinite" begin="0.2s"/>
                          <animate attributeName="y" values="6;4;6" dur="0.6s" repeatCount="indefinite" begin="0.2s"/>
                        </rect>
                      </>
                    ) : (
                      <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"/>
                    )}
                  </svg>
                  <span className="text-white">
                    {clueAudioPlaying === 'password' ? 'Playing...' : 'Password Clue'}
                  </span>
                </motion.button>
              </div>

              <p className="text-center text-gray-500 text-xs mt-6">
                Klik tombol untuk mendengarkan petunjuk
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene 3: Portal Experiences */}
      <AnimatePresence>
        {scene === 'portals' && selectedPortal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-50"
          >
            {/* PORTAL 1: Gallery */}
            {selectedPortal === 'gallery' && (
              <div className="absolute inset-0 bg-gradient-to-br from-pink-950 via-rose-950 to-black overflow-y-auto">
                <div className="min-h-screen flex flex-col items-center justify-start p-8 pt-16">
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                  >
                    <motion.h1
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-5xl md:text-6xl font-black mb-4 flex items-center justify-center gap-3"
                    >
                      <span className="text-6xl">😍</span>
                      <span className="text-transparent bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text">
                        THE WAY I SEE HER
                      </span>
                      <span className="text-6xl">😍</span>
                    </motion.h1>
                    
                    <p className="text-lg md:text-xl text-gray-400 italic">
                      A glimpse of you through the eyes that love you most.
                    </p>
                  </motion.div>

                  {!selectedCategory ? (
                    <>
                      <div className="max-w-5xl w-full mb-8">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                          {[
                            { name: 'selfie', emoji: '🤳', color: 'pink' },
                            { name: 'model', emoji: '📸', color: 'purple' },
                            { name: 'formal', emoji: '💼', color: 'brown' },
                            { name: 'grid', emoji: '⊞', color: 'slate' },
                            { name: 'mirror', emoji: '🪞', color: 'emerald' }
                          ].map((cat, idx) => (
                            <motion.button
                              key={cat.name}
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
                              whileHover={{ scale: 1.05, y: -5 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedCategory(cat.name)}
                              className="relative group cursor-pointer"
                            >
                              <div className={`relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl p-6 rounded-2xl border-2 transition-all ${
                                cat.color === 'pink' ? 'border-pink-500/50 group-hover:border-pink-400' :
                                cat.color === 'purple' ? 'border-purple-500/50 group-hover:border-purple-400' :
                                cat.color === 'brown' ? 'border-amber-700/50 group-hover:border-orange-600' :
                                cat.color === 'slate' ? 'border-slate-500/50 group-hover:border-slate-400' :
                                'border-emerald-500/50 group-hover:border-emerald-400'
                              }`}>
                                {cat.name === 'grid' ? (
                                  <svg 
                                    className="w-10 h-10 mx-auto mb-2 text-slate-400 group-hover:text-slate-300 transition-colors" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                                  </svg>
                                ) : (
                                  <div className="text-4xl mb-2">{cat.emoji}</div>
                                )}
                                <h3 className={`text-lg font-bold mb-1 uppercase ${
                                  cat.color === 'pink' ? 'text-pink-400' :
                                  cat.color === 'purple' ? 'text-purple-400' :
                                  cat.color === 'brown' ? 'text-amber-600' :
                                  cat.color === 'slate' ? 'text-slate-400' :
                                  'text-emerald-400'
                                }`}>{cat.name}</h3>
                                <p className="text-xs text-gray-400">{cat.count} photos</p>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <motion.div
                        initial={{ scale: 0, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="max-w-5xl w-full mb-12"
                      >
                        <motion.button
                          onClick={() => !specialUnlocked && setShowSpecialModal(true)}
                          disabled={specialUnlocked}
                          whileHover={!specialUnlocked ? { scale: 1.02 } : {}}
                          whileTap={!specialUnlocked ? { scale: 0.98 } : {}}
                          className={`w-full cursor-${specialUnlocked ? 'default' : 'pointer'}`}
                        >
                          <motion.div
                            animate={specialUnlocked ? {} : {
                              boxShadow: [
                                '0 0 20px rgba(234, 179, 8, 0.3)',
                                '0 0 40px rgba(234, 179, 8, 0.6)',
                                '0 0 20px rgba(234, 179, 8, 0.3)',
                              ]
                            }}
                            transition={{ duration: 2, repeat: specialUnlocked ? 0 : Infinity }}
                            className={`relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl p-8 rounded-2xl border-2 ${
                              specialUnlocked ? 'border-green-500/70' : 'border-yellow-500/50'
                            }`}
                          >
                            <div className="text-center">
                              <motion.div
                                animate={specialUnlocked ? { rotate: 0 } : { rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: specialUnlocked ? 0 : Infinity }}
                                className="text-6xl mb-4"
                              >
                                {specialUnlocked ? '🔓' : '🔒'}
                              </motion.div>
                              <h3 className={`text-2xl md:text-3xl font-black mb-2 ${
                                specialUnlocked ? 'text-green-400' : 'text-yellow-400'
                              }`}>
                                {specialUnlocked ? 'SPECIAL PHOTO UNLOCKED!' : 'SPECIAL PHOTO'}
                              </h3>
                              <p className="text-gray-400 italic">
                                {specialUnlocked 
                                  ? 'Klik untuk melihat foto special 💝'
                                  : 'Something Special Awaits You...'}
                              </p>
                              {!specialUnlocked && (
                                <p className="text-sm text-gray-600 mt-4">
                                  Klik untuk membuka 🔑
                                </p>
                              )}
                            </div>
                          </motion.div>
                        </motion.button>
                        
                        {specialUnlocked && (
                          <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowSpecialPhoto(true)}
                            className="w-full mt-4 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl shadow-xl transition-all"
                          >
                            ✨ LIHAT FOTO SPECIAL ✨
                          </motion.button>
                        )}
                      </motion.div>

                      {/* Navigation Buttons - Fixed Position */}
                      <div className="fixed bottom-8 left-8 right-8 flex justify-between pointer-events-none z-50">
                        {currentPortalIndex > 0 && (
                          <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={goToPrevPortal}
                            className="px-6 py-3 bg-gray-800/90 backdrop-blur-sm text-white rounded-lg font-bold flex items-center gap-2 shadow-xl border border-gray-700 hover:border-pink-500/50 transition-all pointer-events-auto"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                            </svg>
                            Previous
                          </motion.button>
                        )}
                        <div className="flex-1"></div>
                        {currentPortalIndex < portals.length - 1 && (
                          <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={goToNextPortal}
                            className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-bold shadow-xl flex items-center gap-2 pointer-events-auto"
                          >
                            Next
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </motion.button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="max-w-6xl w-full">
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05, x: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(null)}
                        className="mb-8 px-6 py-3 bg-gray-800/80 text-gray-300 rounded-lg font-bold flex items-center gap-2 border border-gray-700 hover:border-pink-500/50 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Categories
                      </motion.button>

                      <h2 className="text-3xl font-black text-pink-400 mb-8 capitalize text-center">
                        {selectedCategory} Gallery
                      </h2>

                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
                        {Array.from({ 
                          length: selectedCategory === 'selfie' ? 19 : 
                                  selectedCategory === 'model' ? 4 : 
                                  selectedCategory === 'formal' ? 2 : 
                                  selectedCategory === 'grid' ? 4 : 5 
                        }).map((_, idx) => {
                          const photoPath = `/image/${selectedCategory}/${selectedCategory}${idx + 1}.jpg`;
                          return (
                            <motion.div
                              key={idx}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.4, delay: idx * 0.05 }}
                              whileHover={{ scale: 1.05, zIndex: 10 }}
                              className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden cursor-pointer group border-2 border-gray-700 hover:border-pink-500/50 transition-all"
                              onClick={() => setSelectedPhoto(idx)}
                            >
                              <img
                                src={photoPath}
                                alt={`${selectedCategory} ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextElementSibling.style.display = 'flex';
                                }}
                              />
                              <div className="absolute inset-0 hidden items-center justify-center bg-gray-800">
                                <div className="text-6xl opacity-20">📷</div>
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                  <p className="text-white text-sm font-bold">Photo {idx + 1}</p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PORTAL 2: GAMES */}
            {selectedPortal === 'games' && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-indigo-950 to-black overflow-y-auto">
                <div className="min-h-screen flex flex-col items-center justify-start p-8 pt-16">
                  {!selectedGame ? (
                    <>
                      <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-12"
                      >
                        <motion.h1
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                          className="text-6xl mb-4 inline-block"
                        >
                          🎮
                        </motion.h1>
                        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text mb-4">
                          LOVE GAMES
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 italic">
                          Play together, grow closer 💕
                        </p>
                      </motion.div>

                      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <motion.button
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedGame('memory');
                          }}
                          className="relative group cursor-pointer"
                        >
                          <div className="relative bg-gradient-to-br from-pink-900/90 to-purple-900/90 backdrop-blur-xl p-8 rounded-2xl border-2 border-pink-500/50 group-hover:border-pink-400 transition-all">
                            <div className="text-6xl mb-4">🃏</div>
                            <h3 className="text-2xl font-bold text-pink-400 mb-2">MEMORY CARD</h3>
                            <p className="text-gray-400 text-sm">Match pairs of our memories!</p>
                          </div>
                        </motion.button>

                        <motion.button
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedGame('catch');
                            startCatchGame();
                          }}
                          className="relative group cursor-pointer"
                        >
                          <div className="relative bg-gradient-to-br from-red-900/90 to-pink-900/90 backdrop-blur-xl p-8 rounded-2xl border-2 border-red-500/50 group-hover:border-red-400 transition-all">
                            <div className="text-6xl mb-4">💕</div>
                            <h3 className="text-2xl font-bold text-red-400 mb-2">CATCH HEARTS</h3>
                            <p className="text-gray-400 text-sm">Catch falling hearts, avoid bombs!</p>
                          </div>
                        </motion.button>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="fixed bottom-8 left-8 right-8 flex justify-between pointer-events-none z-50">
                        {currentPortalIndex > 0 && (
                          <motion.button
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={goToPrevPortal}
                            className="px-6 py-3 bg-gray-800/90 backdrop-blur-sm text-white rounded-lg font-bold flex items-center gap-2 shadow-xl border border-gray-700 hover:border-pink-500/50 transition-all pointer-events-auto"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                            </svg>
                            Previous
                          </motion.button>
                        )}
                        <div className="flex-1"></div>
                        {currentPortalIndex < portals.length - 1 && (
                          <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={goToNextPortal}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold flex items-center gap-2 shadow-xl pointer-events-auto"
                          >
                            Next
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </motion.button>
                        )}
                      </div>
                    </>
                  ) : selectedGame === 'memory' ? (
                    <div className="max-w-5xl w-full">
                      <div className="flex items-center justify-between mb-8">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedGame(null);
                            setMemoryCards([]);
                            setFlippedCards([]);
                            setMatchedCards([]);
                            setIsLoadingMemory(false);
                          }}
                          className="px-6 py-3 bg-gray-800/80 text-gray-300 rounded-lg font-bold flex items-center gap-2 border border-gray-700 hover:border-pink-500/50 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Back
                        </motion.button>
                        
                        <div className="text-center">
                          <h2 className="text-3xl font-black text-pink-400 mb-2">🃏 MEMORY GAME</h2>
                          <p className="text-gray-400">Moves: {memoryMoves}</p>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={initMemoryGame}
                          className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg font-bold shadow-lg"
                        >
                          Restart
                        </motion.button>
                      </div>
                        
                      {memoryCards.length === 0 ? (
                        // ✅ LOADING STATE
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-20"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="text-8xl mb-6"
                          >
                            🃏
                          </motion.div>
                          <p className="text-2xl text-pink-400 font-bold mb-2">Shuffling cards...</p>
                          <p className="text-gray-500">Preparing your memory game</p>
                        </motion.div>
                      ) : matchedCards.length === memoryCards.length ? (
                        // ✅ VICTORY SCREEN
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-center py-20"
                        >
                          <div className="text-8xl mb-6">🎉</div>
                          <h3 className="text-5xl font-black text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text mb-4">
                            VICTORY!
                          </h3>
                          <p className="text-2xl text-gray-400 mb-8">You completed it in {memoryMoves} moves!</p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={initMemoryGame}
                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold text-xl shadow-lg"
                          >
                            Play Again
                          </motion.button>
                        </motion.div>
                      ) : (
                        // ✅ GAME GRID - 3 kolom untuk 6 pairs (12 cards)
                        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
                          {memoryCards.map((card) => (
                            <motion.div
                              key={card.uniqueId}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: card.uniqueId * 0.05 }}
                              whileHover={!flippedCards.includes(card.uniqueId) && !matchedCards.includes(card.uniqueId) ? { scale: 1.05 } : {}}
                              whileTap={!flippedCards.includes(card.uniqueId) && !matchedCards.includes(card.uniqueId) ? { scale: 0.95 } : {}}
                              onClick={() => handleCardClick(card.uniqueId)}
                              className="aspect-square cursor-pointer"
                              style={{ perspective: '1000px' }}
                            >
                              <motion.div
                                animate={{ rotateY: flippedCards.includes(card.uniqueId) || matchedCards.includes(card.uniqueId) ? 180 : 0 }}
                                transition={{ duration: 0.6 }}
                                className="relative w-full h-full"
                                style={{ transformStyle: 'preserve-3d' }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-6xl border-4 border-purple-400"
                                  style={{ backfaceVisibility: 'hidden' }}>
                                  ❤️
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border-4 border-pink-400"
                                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                  <img
                                    src={card.path}
                                    alt="Memory card"
                                    className="w-full h-full object-cover"
                                  />
                                  {matchedCards.includes(card.uniqueId) && (
                                    <div className="absolute inset-0 bg-green-500/40 flex items-center justify-center text-6xl">
                                      💚
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : selectedGame === 'catch' ? (
                    <div className="max-w-4xl w-full">
                      <div className="flex items-center justify-between mb-8">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedGame(null);
                            setCatchGameActive(false);
                            setCatchHearts(0);
                          }}
                          className="px-6 py-3 bg-gray-800/80 text-gray-300 rounded-lg font-bold flex items-center gap-2 border border-gray-700 hover:border-pink-500/50 transition-all"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Back
                        </motion.button>

                        <div className="text-center">
                          <h2 className="text-3xl font-black text-red-400">💕 CATCH HEARTS</h2>
                          <p className="text-2xl text-pink-400 font-bold mt-2">Hearts: {catchHearts}</p>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={startCatchGame}
                          className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-bold shadow-lg"
                        >
                          Restart
                        </motion.button>
                      </div>

                      {catchMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mb-4 text-center"
                        >
                          <p className="text-xl text-yellow-300 font-bold bg-black/50 rounded-lg px-4 py-2 inline-block">
                            {catchMessage}
                          </p>
                        </motion.div>
                      )}

                      <div
                        id="catch-game-area"
                        className={`relative w-full h-[500px] rounded-2xl border-4 border-red-500/50 overflow-hidden ${
                          catchBackground === 'default' ? 'bg-gradient-to-b from-pink-950 to-purple-950' :
                          catchBackground === 'petals' ? 'bg-gradient-to-b from-pink-300 to-rose-500' :
                          catchBackground === 'night' ? 'bg-gradient-to-b from-indigo-950 to-purple-950' :
                          catchBackground === 'glowing' ? 'bg-gradient-to-b from-yellow-900 to-orange-950' :
                          'bg-gradient-to-b from-cyan-900 via-purple-900 to-pink-900'
                        }`}
                      >
                        {catchBackground === 'petals' && (
                          <div className="absolute inset-0 pointer-events-none">  {/* ✅ FIXED: pointer-events-none agar tidak interfere dengan mouse movement */}
                            {/* ✅ FIXED: Reduced particles: Petals: 30 → 20 */}
                            {[...Array(20)].map((_, i) => (  // Changed from 30
                              <motion.div
                                key={`petal-${i}`}
                                initial={{ y: -50, x: Math.random() * 100 + '%', opacity: 0 }}
                                animate={{ y: '120%', opacity: [0, 1, 0] }}
                                transition={{ duration: 5 + Math.random() * 3, delay: Math.random() * 5, repeat: Infinity }}
                                className="absolute text-2xl"
                              >
                                🌸
                              </motion.div>
                            ))}
                          </div>
                        )}

                        {catchBackground === 'night' && (
                          <div className="absolute inset-0 pointer-events-none">  {/* ✅ FIXED: pointer-events-none */}
                            {/* ✅ FIXED: Reduced particles: Stars: 50 → 30 */}
                            {[...Array(30)].map((_, i) => (  // Changed from 50
                              <motion.div
                                key={`star-${i}`}
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 2, repeat: Infinity }}
                                className="absolute w-1 h-1 bg-white rounded-full"
                                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                              />
                            ))}
                          </div>
                        )}

                        {fallingItems.map((item) => (
                          <motion.div
                            key={item.id}
                            className="absolute text-4xl"
                            style={{ left: `${item.x}%`, top: `${item.y}%` }}
                          >
                            {item.isHeart ? '💕' : '💣'}
                          </motion.div>
                        ))}

                        <motion.div
                          className={`absolute bottom-4 w-20 h-16 flex items-center justify-center text-5xl ${
                            catchBackground === 'glowing' ? 'drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]' : ''
                          }`}
                          style={{ left: `${basketPosition}%`, transform: 'translateX(-50%)' }}
                          animate={catchBackground === 'aurora' ? { 
                            filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'],
                          } : {}}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          🧺
                        </motion.div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}

            {/* PORTAL 3: Love Timeline */}
            {selectedPortal === 'timeline' && (
              <div className="absolute inset-0 bg-gradient-to-br from-rose-950 via-pink-950 to-black overflow-y-auto">
                <div className="min-h-screen flex flex-col items-center justify-start p-8 pt-16 pb-32">
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                  >
                    <motion.h1
                      className="text-5xl md:text-6xl font-black mb-4 flex items-center justify-center gap-3"
                    >
                      <span className="text-6xl">💝</span>
                      <span className="text-transparent bg-gradient-to-r from-rose-400 via-pink-400 to-red-400 bg-clip-text">
                        LOVE TIMELINE
                      </span>
                      <span className="text-6xl">💝</span>
                    </motion.h1>
                    <p className="text-lg md:text-xl text-gray-400 italic">
                      Perjalanan Kita — Dari Awal Hingga Sekarang 💖
                    </p>
                  </motion.div>

                  <div className="max-w-4xl w-full relative">
                    {/* Timeline Vertical Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-500 via-pink-500 to-red-500 opacity-30" />

                    {/* Timeline Items */}
                    {[
                      { emoji: '📍', title: 'Awal Kenal', desc: 'Pertemuan online sederhana dari grup Unpad ke Idol Reborn💫', delay: 0.2 },
                      { emoji: '📆', title: '24 Juni – Awal Cerita Kita', desc: 'Saat Apis memberanikan diri buat reply sidang bububb, siapa sangka dari percakapan kecil itu tumbuh rasa yang besar (sukses nihh rencanaku hehe). ❤️', delay: 0.4 },
                      { emoji: '⚡', title: 'Momen Skripsi & Recharge Energy', desc: 'Di tengah skripsi dan lelahnya hari, satu notif dari bubub bisa langsung nge-recharge semangat Apis. ✨', delay: 0.6 },
                      { emoji: '🏋️‍♂️', title: 'Hobi Sama, Rasa Juga Sama', desc: 'Dari gym, tawa, sampai isengan kecil, semua bikin kita makin dekat dan saling ngerti. 💪', delay: 0.8 },
                      { emoji: '🧠', title: 'Personality Test & Fast Respon Era', desc: 'Hanya dari satu ajakan sederhana mengajak tes kepribadian, komunikasi kita langsung berubah cie". Responnya jadi cepat, hati pun semakin dekat. 🤭', delay: 1.0 },
                      { emoji: '💞', title: 'Sweetheart Moment', desc: 'Saat bubub gak tahan terus manggil “sweetheart”, hati Apis langsung luluh. Dari situ, kata “sayang” pun akhirnya terucap setiap harinya 🥰', delay: 1.2 },
                      { emoji: '🎬', title: 'Movie Time', desc: 'Bubub nyuruh nonton film sore, Apis langsung nurut aja padahal belum tentu filmnya seru ya, soalnya yang penting dari bubub. 😝', delay: 1.4 },
                      { emoji: '😢', title: 'Suka & Duka', desc: 'Dari setiap luka, kita belajar untuk saling memahami. Kini, cinta kita terasa lebih tenang, lebih dalam, dan lebih nyata. 🌷', delay: 1.6 },
                      { emoji: '📚', title: 'Belajar & Mempersiapkan Masa Depan', desc: 'Sama-sama belajar, berjuang, dan menata karier. Semua demi masa depan dan impian jadi keluarga Cemara. 🏡💫', delay: 1.8 },
                      { emoji: '👥', title: 'Tentang Kita', desc: 'Bubub sibuk nyeruput kopi, Apis sibuk nonton MU, tapi ujung-ujungnya yang dicari tetap satu yaa yaitu kabar dari satu sama lain yeayy. ☕⚽', delay: 2.0 },
                      { emoji: '🎓', title: 'Menuju Wisuda – Babak Baru', desc: 'Sebentar lagi kita wisuda nihh! Ini bukan akhir ya, melainkan awal babak baru menuju masa depan yang kita impikan bersama. 🤵🏻🧕🏻', delay: 2.2 }
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: item.delay }}
                        className="relative flex gap-6 mb-12"
                      >
                        {/* Timeline Dot */}
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: item.delay + 0.3 }}
                          className="relative flex-shrink-0"
                        >
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-800 flex items-center justify-center text-3xl border-4 border-pink-900 shadow-lg">
                            {item.emoji}
                          </div>
                          
                          {/* Sparkle Effect */}
                          {[...Array(4)].map((_, i) => (
                            <motion.div
                              key={`sparkle-${idx}-${i}`}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ 
                                scale: [0, 1, 0],
                                opacity: [0, 1, 0],
                                x: [0, Math.cos(i * Math.PI / 2) * 20],
                                y: [0, Math.sin(i * Math.PI / 2) * 20]
                              }}
                              transition={{ 
                                duration: 1.5, 
                                delay: item.delay + 0.5 + (i * 0.1),
                                repeat: Infinity,
                                repeatDelay: 3
                              }}
                              className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full"
                              style={{ boxShadow: '0 0 8px #fef08a' }}
                            />
                          ))}
                        </motion.div>

                        {/* Content Card */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: item.delay + 0.4 }}
                          whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(244, 114, 182, 0.5)' }}
                          className="flex-1 bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl p-6 rounded-2xl border-2 border-rose-500/30 hover:border-rose-400/60 transition-all shadow-xl"
                        >
                          <motion.h3
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: item.delay + 0.6 }}
                            className="text-2xl font-black text-transparent bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text mb-3"
                          >
                            {item.title}
                          </motion.h3>
                          
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: item.delay + 0.8 }}
                            className="text-gray-300 leading-relaxed"
                          >
                            {item.desc}
                          </motion.p>

                          {/* Floating Hearts */}
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={`heart-${idx}-${i}`}
                              initial={{ y: 0, opacity: 0 }}
                              animate={{ 
                                y: [-20, -40],
                                opacity: [0, 1, 0],
                                x: [0, (i - 1) * 10]
                              }}
                              transition={{ 
                                duration: 2, 
                                delay: item.delay + 1 + (i * 0.3),
                                repeat: Infinity,
                                repeatDelay: 4
                              }}
                              className="absolute bottom-2 right-4 text-2xl"
                            >
                              💖
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.div>
                    ))}

                    {/* Final Message */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, delay: 2.8 }}
                      className="text-center mt-16 p-8 bg-gradient-to-br from-rose-900/50 to-pink-900/50 backdrop-blur-xl rounded-2xl border-2 border-rose-500/50"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="text-6xl mb-4 inline-block"
                      >
                        ✨
                      </motion.div>
                      <p className="text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-rose-300 via-pink-300 to-red-300 bg-clip-text mb-4">
                        Ini Baru Awal dari Cerita Kita
                      </p>
                      <p className="text-lg text-gray-300 italic">
                        Masih banyak momen indah yang menunggu kita ciptakan bersama 💕
                      </p>
                    </motion.div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="fixed bottom-8 left-8 right-8 flex justify-between pointer-events-none z-50">
                    {currentPortalIndex > 0 && (
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={goToPrevPortal}
                        className="px-6 py-3 bg-gray-800/90 backdrop-blur-sm text-white rounded-lg font-bold flex items-center gap-2 shadow-xl border border-gray-700 hover:border-pink-500/50 transition-all pointer-events-auto"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                        </svg>
                        Previous
                      </motion.button>
                    )}
                    <div className="flex-1"></div>
                    {currentPortalIndex < portals.length - 1 && (
                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={goToNextPortal}
                        className="px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-lg font-bold flex items-center gap-2 shadow-xl pointer-events-auto"
                      >
                        Next
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PORTAL 4: Message in the Stars */}
            {selectedPortal === 'stars' && (
              <div className="absolute inset-0 bg-black overflow-hidden">
                {/* Space Background with Parallax Layers */}
                <div className="absolute inset-0">
                  {/* Far stars layer */}
                  <motion.div
                    animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0"
                  >
                    {[...Array(100)].map((_, i) => (
                      <div
                        key={`far-${i}`}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          boxShadow: '0 0 2px #fff'
                        }}
                      />
                    ))}
                  </motion.div>
                  
                  {/* Near stars layer */}
                  <motion.div
                    animate={{ x: [0, -100, 0], y: [0, -60, 0] }}
                    transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0"
                  >
                    {[...Array(50)].map((_, i) => (
                      <motion.div
                        key={`near-${i}`}
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2 + Math.random() * 2, repeat: Infinity }}
                        className="absolute w-1.5 h-1.5 bg-white rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          boxShadow: '0 0 4px #fff'
                        }}
                      />
                    ))}
                  </motion.div>
                  
                  {/* Nebula effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-cyan-900/10 opacity-50" />
                </div>
                  
                {/* Main Content */}
                <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
                  {starsPhase === 'constellation' ? (
                    /* Phase 1: Constellation Drawing */
                    <div className="text-center">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative w-full max-w-4xl h-96 mx-auto"
                      >
                        {/* Drawing "HAPPY BIRTHDAY JEJELL" with stars */}
                        <svg className="w-full h-full" viewBox="0 0 800 200">
                          {/* Letter H */}
                          <motion.circle cx="50" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 2 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="50" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 4 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="50" cy="100" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 6 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="80" cy="100" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 8 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="80" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 10 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="80" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 12 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          
                          {/* Letter A */}
                          <motion.circle cx="110" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 14 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="125" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 16 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="140" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 18 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="120" cy="100" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 20 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="130" cy="100" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 22 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          
                          {/* Letter P1 */}
                          <motion.circle cx="170" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 24 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="170" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 26 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="170" cy="100" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 28 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="195" cy="75" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 30 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="195" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 32 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          
                          {/* Letter P2 */}
                          <motion.circle cx="225" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 34 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="225" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 36 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="225" cy="100" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 38 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="250" cy="75" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 40 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="250" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 42 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />

                          {/* Letter Y */}
                          <motion.circle cx="280" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 44 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="295" cy="90" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 46 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="295" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 48 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="310" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 50 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />

                          {/* Letter B */}
                          <motion.circle cx="340" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 52 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="340" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 54 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="340" cy="100" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 56 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="365" cy="75" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 58 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="365" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 60 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="365" cy="125" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 62 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="365" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 64 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />

                          {/* Letter I */}
                          <motion.circle cx="385" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 66 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="385" cy="100" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 68 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="385" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 70 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />

                          {/* Letter R */}
                          <motion.circle cx="405" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 72 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="405" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 74 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="405" cy="100" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 76 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="430" cy="75" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 78 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="430" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 80 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="430" cy="125" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 82 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />

                          {/* Letter T */}
                          <motion.circle cx="450" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 84 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="465" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 86 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="480" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 88 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="465" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 90 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="465" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 92 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />

                          {/* Letter H */}
                          <motion.circle cx="500" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 94 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="500" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 96 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="500" cy="100" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 98 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="530" cy="100" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 100 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="530" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 102 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="530" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 104 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />

                          {/* Letter D */}
                          <motion.circle cx="550" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 106 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="550" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 108 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="550" cy="100" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 110 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="575" cy="75" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 112 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="575" cy="125" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 114 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />

                          {/* Letter A */}
                          <motion.circle cx="595" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 116 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="610" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 118 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="625" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 120 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="605" cy="100" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 122 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="615" cy="100" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 124 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />

                          {/* Letter Y */}
                          <motion.circle cx="645" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 126 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="660" cy="90" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 128 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="660" cy="150" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 130 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />
                          <motion.circle cx="675" cy="50" r="4" fill="#fff" initial={{ opacity: 0 }} animate={{ opacity: constellationProgress > 132 ? 1 : 0 }} style={{ filter: 'drop-shadow(0 0 6px #fff)' }} />

                          {/* Connecting lines with animation */}
                          {constellationProgress > 5 && (
                            <>
                              {/* Letter H lines */}
                              <motion.line x1="50" y1="50" x2="50" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="50" y1="100" x2="80" y2="100" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.1 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="80" y1="50" x2="80" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              
                              {/* Letter A lines */}
                              <motion.line x1="110" y1="150" x2="125" y2="50" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.3 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="125" y1="50" x2="140" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.4 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="120" y1="100" x2="130" y2="100" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.5 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              
                              {/* Letter P1 lines */}
                              <motion.line x1="170" y1="50" x2="170" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="170" y1="50" x2="195" y2="50" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.7 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="195" y1="50" x2="195" y2="75" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.8 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="195" y1="75" x2="170" y2="100" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.9 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              
                              {/* Letter P2 lines */}
                              <motion.line x1="225" y1="50" x2="225" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.0 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="225" y1="50" x2="250" y2="50" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.1 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="250" y1="50" x2="250" y2="75" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.2 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="250" y1="75" x2="225" y2="100" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.3 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              
                              {/* Letter Y lines */}
                              <motion.line x1="280" y1="50" x2="295" y2="90" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.4 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="310" y1="50" x2="295" y2="90" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.5 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="295" y1="90" x2="295" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.6 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              
                              {/* Letter B lines */}
                              <motion.line x1="340" y1="50" x2="340" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.7 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="340" y1="50" x2="365" y2="50" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.8 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="365" y1="50" x2="365" y2="75" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 1.9 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="365" y1="75" x2="340" y2="100" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 2.0 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="340" y1="100" x2="365" y2="125" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 2.1 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="365" y1="125" x2="365" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 2.2 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="365" y1="150" x2="340" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 2.3 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />

                              {/* Letter I lines */}
                              <motion.line x1="385" y1="50" x2="385" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 2.4 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />

                              {/* Letter R lines */}
                              <motion.line x1="405" y1="50" x2="405" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 2.5 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="405" y1="50" x2="430" y2="50" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 2.6 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="430" y1="50" x2="430" y2="75" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 2.7 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="430" y1="75" x2="405" y2="100" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 2.8 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="405" y1="100" x2="430" y2="125" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 2.9 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />

                              {/* Letter T lines */}
                              <motion.line x1="450" y1="50" x2="480" y2="50" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 3.0 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="465" y1="50" x2="465" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 3.1 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />

                              {/* Letter H lines */}
                              <motion.line x1="500" y1="50" x2="500" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 3.2 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="500" y1="100" x2="530" y2="100" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 3.3 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="530" y1="50" x2="530" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 3.4 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />

                              {/* Letter D lines */}
                              <motion.line x1="550" y1="50" x2="550" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 3.5 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="550" y1="50" x2="575" y2="75" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 3.6 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="575" y1="75" x2="575" y2="125" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 3.7 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="575" y1="125" x2="550" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 3.8 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />

                              {/* Letter A lines */}
                              <motion.line x1="595" y1="150" x2="610" y2="50" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 3.9 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="610" y1="50" x2="625" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 4.0 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="605" y1="100" x2="615" y2="100" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 4.1 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />

                              {/* Letter Y lines */}
                              <motion.line x1="645" y1="50" x2="660" y2="90" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 4.2 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="675" y1="50" x2="660" y2="90" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 4.3 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />
                              <motion.line x1="660" y1="90" x2="660" y2="150" stroke="#22d3ee" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 4.4 }} style={{ filter: 'drop-shadow(0 0 3px #22d3ee)' }} />

                            </>
                          )}
                        </svg>

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: constellationProgress >= 135 ? 1 : 0 }}  // ✅ UBAH dari >= 100
                          className="text-center mt-8"
                        >
                          <p className="text-2xl text-cyan-400 font-bold">Constellation Complete!</p>
                          <div className="w-64 h-2 bg-gray-800 rounded-full mx-auto mt-4">
                            <motion.div
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                              style={{ width: `${Math.min((constellationProgress / 135) * 100, 100)}%` }}  // ✅ UBAH formula
                            />
                          </div>
                          <p className="text-sm text-gray-500 mt-2">Loading interactive stars...</p>
                        </motion.div>
                      </motion.div>
                    </div>
                  ) : (
                    /* Phase 2: Interactive Stars */
                    <div className="w-full h-full">
                      {/* Title */}
                      <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                      >
                        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text mb-4">
                          ✨ MESSAGE IN THE STARS ✨
                        </h1>
                        <p className="text-lg text-gray-400 italic">
                          Coba deh klik bintang, bulan, planet, telurnyaa bubbb......
                        </p>
                      </motion.div>

                      {/* Interactive Stars */}
                      <div className="relative w-full h-96 z-10">
                        {[
                          { x: 15, y: 20, msg: 'Setiap detik bareng kamu tuh rasanya berkah banget, sayang 💖', color: 'cyan' },
                          { x: 35, y: 45, msg: 'Kamu tuh bener-bener bintang paling terang di langit hidup aku ⭐', color: 'yellow' },
                          { x: 55, y: 25, msg: 'Happy birthday my universe, cintanya apisss buat bububb 🌟', color: 'pink' },
                          { x: 75, y: 50, msg: 'Cintaku ke kamu tuh lebih banyak dari bintang di langit, serius 💫', color: 'purple' },
                          { x: 25, y: 70, msg: 'Kamu bikin hidup apiss bersinar kayak galaksi, sayangg ✨', color: 'blue' },
                          { x: 65, y: 75, msg: 'Selamanya bareng kamu yaa, kayak bintang yang nggak pernah padam 🌠', color: 'cyan' },
                          { x: 85, y: 30, msg: 'Kamu tuh cahaya di setiap malam gelap aku, bububb 💝', color: 'yellow' },
                          { x: 45, y: 85, msg: 'Cinta apiss ke bububb nggak ada ujungnya, seluas semesta 🌌', color: 'pink' },
                        ].map((star, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.2, duration: 0.5 }}
                            className="absolute cursor-pointer z-20"
                            style={{ left: `${star.x}%`, top: `${star.y}%` }}
                            onClick={() => {
                              // ✅ SOUND EFFECT untuk bintang
                              const audio = new Audio('/audio/soundeffectstars.mp3');
                              audio.volume = 0.3;
                              audio.play().catch(() => {});
                              
                              setSelectedStar(star);
                            }}
                          >
                            <motion.div
                              animate={{ 
                                scale: [1, 1.3, 1],
                                opacity: [0.6, 1, 0.6]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={`w-6 h-6 rounded-full ${
                                star.color === 'cyan' ? 'bg-cyan-400' :
                                star.color === 'yellow' ? 'bg-yellow-400' :
                                star.color === 'pink' ? 'bg-pink-400' :
                                star.color === 'purple' ? 'bg-purple-400' :
                                'bg-blue-400'
                              }`}
                              style={{ 
                                filter: `drop-shadow(0 0 12px ${
                                  star.color === 'cyan' ? '#22d3ee' :
                                  star.color === 'yellow' ? '#fbbf24' :
                                  star.color === 'pink' ? '#f472b6' :
                                  star.color === 'purple' ? '#a855f7' :
                                  '#3b82f6'
                                })`,
                                clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                              }}
                            />
                          </motion.div>
                        ))}

                        {/* Easter Egg: Hidden Egg Icon */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: foundEasterEgg ? 1 : 0.3 }}
                          className="absolute bottom-14 right-10 z-5"
                        >
                          <motion.button
                            onClick={() => {
                              if (!foundEasterEgg) {
                                setFoundEasterEgg(true);
                                
                                // ✅ SOUND EFFECT untuk telur (sukses unlock)
                                const audio = new Audio('/audio/soundnotifegg.mp3');
                                audio.volume = 0.5;
                                audio.play().catch(() => {});
                              }
                            }}
                            whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
                            whileTap={{ scale: 0.9 }}
                            className="relative group"
                          >
                            {/* Egg Shape */}
                            <motion.div
                              animate={{ 
                                y: [0, -10, 0],
                                rotate: foundEasterEgg ? 0 : [0, -5, 5, -5, 0]
                              }}
                              transition={{ 
                                y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                                rotate: { duration: 3, repeat: Infinity }
                              }}
                              className="relative w-16 h-20 bg-gradient-to-br from-pink-300 via-red-400 to-rose-500 rounded-[50%] border-4 border-red-300/50"
                              style={{ 
                                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                                filter: 'drop-shadow(0 0 15px #ef4444)',
                                boxShadow: '0 0 30px rgba(239, 68, 68, 0.6), inset -5px -5px 10px rgba(220, 38, 38, 0.3)'
                              }}
                            >
                              {/* Sparkle effect */}
                              {!foundEasterEgg && (
                                <>
                                  <motion.div
                                    animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                                    className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-300 rounded-full"
                                    style={{ filter: 'drop-shadow(0 0 6px #fef08a)' }}
                                  />
                                  <motion.div
                                    animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                    className="absolute -bottom-2 -left-2 w-2 h-2 bg-yellow-300 rounded-full"
                                    style={{ filter: 'drop-shadow(0 0 6px #fef08a)' }}
                                  />
                                  <motion.div
                                    animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                                    transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                                    className="absolute top-1/2 -right-3 w-2 h-2 bg-yellow-300 rounded-full"
                                    style={{ filter: 'drop-shadow(0 0 6px #fef08a)' }}
                                  />
                                </>
                              )}
                              
                              {/* Heart pattern on egg */}
                              {foundEasterEgg && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="absolute inset-0 flex items-center justify-center text-2xl"
                                >
                                  💖
                                </motion.div>
                              )}
                            </motion.div>
                            
                            {/* Glow effect */}
                            <motion.div
                              animate={{ 
                                scale: [1, 1.3, 1], 
                                opacity: [0.3, 0.6, 0.3] 
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="absolute inset-0 rounded-[50%] bg-red-400/40 blur-xl"
                              style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}
                            />
                          </motion.button>
                        </motion.div>

                        {foundEasterEgg && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute bottom-24 right-32 bg-red-500/90 text-white px-4 py-2 rounded-lg font-bold z-5"
                          >
                            🎉 Easter Egg Found! I LOVE YOU BABY!
                          </motion.div>
                        )}
                      </div>

                      {/* Meteor Shower */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {meteors.map(meteor => {
                          // ✅ Deteksi apakah text bakal keluar viewport
                          const isNearEdge = meteor.x > 65 || meteor.x < 25 || meteor.y < 20;
                          const meteorRotation = isNearEdge ? 0 : meteor.rotation;
                          
                          return (
                            <motion.div
                              key={meteor.id}
                              className="absolute"
                              style={{ 
                                left: `${meteor.x}%`, 
                                top: `${meteor.y}%`,
                                transform: `rotate(${meteorRotation}deg)`
                              }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <div className="relative">
                                {/* Meteor head */}
                                <motion.div 
                                  className="w-3 h-3 bg-yellow-300 rounded-full" 
                                  style={{ 
                                    filter: 'drop-shadow(0 0 10px #fef08a)',
                                    boxShadow: '0 0 20px #fbbf24'
                                  }}
                                  animate={{ opacity: [1, 1, 0] }}
                                  transition={{ duration: 4, times: [0, 0.75, 1] }}
                                />

                                {/* Meteor trail */}
                                <motion.div
                                  className="absolute top-1 left-1 h-1.5 bg-gradient-to-l from-yellow-300 via-orange-300 to-transparent rounded-full"
                                  style={{ width: '60px', filter: 'blur(1px)' }}
                                  animate={{ opacity: [1, 1, 0] }}
                                  transition={{ duration: 4, times: [0, 0.75, 1] }}
                                />

                                {/* Wish text - SINKRON dengan meteor ✅ */}
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ 
                                    opacity: [0, 1, 1, 0], 
                                    x: 0 
                                  }}
                                  transition={{ 
                                    duration: 4, 
                                    times: [0, 0.1, 0.75, 1]  // ✅ Fade in cepat, hold, fade out bareng
                                  }}
                                  className="absolute left-16 -top-2 bg-gradient-to-r from-yellow-900/90 to-orange-900/80 backdrop-blur-sm text-yellow-200 text-xs px-3 py-1 rounded-lg whitespace-nowrap border border-yellow-600/30 font-medium"
                                >
                                  {meteor.wish}
                                </motion.div>
                                
                                {/* Sparkles */}
                                {[...Array(3)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute w-1 h-1 bg-yellow-200 rounded-full"
                                    style={{ 
                                      left: `${-10 - i * 8}px`,
                                      top: `${Math.random() * 8 - 4}px`
                                    }}
                                    animate={{
                                      opacity: [0, 1, 0],
                                      scale: [0, 1, 0]
                                    }}
                                    transition={{
                                      duration: 0.6,
                                      delay: i * 0.1,
                                      repeat: Infinity,
                                      repeatDelay: 0.3
                                    }}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* UFO Easter Egg */}
                      <AnimatePresence mode="wait">
                        {showUFO && (
                          <motion.div
                            initial={{ x: -300, y: 400 }}
                            animate={{ 
                              x: [-300, 200, 200, -300]
                            }}
                            exit={{ x: -300 }}
                            transition={{ 
                              duration: 15,
                              times: [0, 0.33, 0.67, 1],
                              ease: 'linear'
                            }}
                            onAnimationComplete={() => setShowUFO(false)}
                            className="absolute top-20 pointer-events-none z-50"
                          >
                            <div className="relative">
                              <div className="text-6xl">🛸</div>
                              <div className="absolute -bottom-8 left-0 bg-purple-500/90 text-white px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap">
                                "JEJELL'S BIRTHDAY BROADCAST! 📡"
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Planets */}
                      <div className="absolute top-10 bottom-32 left-20">
                        <motion.button
                          animate={{ rotate: 360 }}
                          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                          onClick={() => {
                            setSelectedStar({ msg: 'Bububb adalah planet paling indah di tata surya hatiku ✨', color: 'blue' });
                            const audio = new Audio('/audio/soundplanetmoon.mp3');
                            audio.volume = 0.3;
                            audio.play().catch(() => {});
                          }}
                          whileHover={{ scale: 1.15 }}
                          className="relative group"
                        >
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 border-4 border-blue-300/50 relative overflow-hidden"
                            style={{ 
                              filter: 'drop-shadow(0 0 25px #3b82f6)',
                            }}>
                            {/* Planet rings */}
                            <div className="absolute inset-0 border-2 border-blue-200/30 rounded-full" style={{ transform: 'rotateX(70deg) scale(1.3, 0.4)' }} />
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-blue-400/30 blur-xl"
                          />
                        </motion.button>
                      </div>

                      {/* Moon */}
                      <div className="absolute top-10 bottom-32 left-32">
                        <motion.button
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          onClick={() => {
                            setSelectedStar({ msg: 'Seperti bulan yang selalu setia menyinari langit gelap, bububb juga selalu jadi cahaya yang menenangkan di hati apis 💛', color: 'yellow' });
                            const audio = new Audio('/audio/soundplanetmoon.mp3');
                            audio.volume = 0.3;
                            audio.play().catch(() => {});
                          }}
                          whileHover={{ scale: 1.15 }}
                          className="relative group"
                        >
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 border-4 border-yellow-200/50 relative"
                            style={{ 
                              filter: 'drop-shadow(0 0 35px #fbbf24)',
                            }}>
                            {/* Moon craters */}
                            <div className="absolute top-4 right-6 w-3 h-3 rounded-full bg-yellow-500/40" />
                            <div className="absolute bottom-6 left-5 w-4 h-4 rounded-full bg-yellow-500/30" />
                            <div className="absolute top-10 left-8 w-2 h-2 rounded-full bg-yellow-500/50" />
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-yellow-300/40 blur-2xl"
                          />
                        </motion.button>
                      </div>

                    </div>
                  )}
                </div>

                {/* Star Message Modal */}
                <AnimatePresence>
                  {selectedStar && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                      onClick={() => setSelectedStar(null)}
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: 'spring', damping: 15 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl p-8 rounded-2xl border-2 border-cyan-500/50 shadow-2xl max-w-lg mx-4"
                      >
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0],
                              x: [0, Math.cos(i * Math.PI / 3) * 40],
                              y: [0, Math.sin(i * Math.PI / 3) * 40]
                            }}
                            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
                            className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-300 rounded-full"
                            style={{ filter: 'drop-shadow(0 0 6px #fef08a)' }}
                          />
                        ))}

                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                          className="text-6xl mb-4 text-center"
                        >
                          ⭐
                        </motion.div>
                        
                        <p className="text-2xl text-center text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text font-bold mb-4">
                          {selectedStar.msg}
                        </p>

                        <button
                          onClick={() => setSelectedStar(null)}
                          className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                        >
                          Close
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="fixed bottom-8 left-8 right-8 flex justify-between pointer-events-none z-50">
                  {currentPortalIndex > 0 && (
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={goToPrevPortal}
                      className="px-6 py-3 bg-gray-800/90 backdrop-blur-sm text-white rounded-lg font-bold flex items-center gap-2 shadow-xl border border-gray-700 hover:border-cyan-500/50 transition-all pointer-events-auto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                      </svg>
                      Previous
                    </motion.button>
                  )}
                  <div className="flex-1"></div>
                  {currentPortalIndex < portals.length - 1 && (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={goToNextPortal}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold flex items-center gap-2 shadow-x pointer-events-auto"
                    >
                      Next
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </div>
            )}

          {/* PORTAL 5: Digital Love Letter */}
          {selectedPortal === 'letter' && (
            <div className="absolute inset-0 bg-gradient-to-br from-rose-950 via-red-950 to-black overflow-hidden">
              {/* Floating Rose Petals Background */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={`petal-${i}`}
                    initial={{ 
                      y: -50, 
                      x: Math.random() * window.innerWidth,
                      opacity: 0,
                      rotate: Math.random() * 360
                    }}
                    animate={{ 
                      y: window.innerHeight + 50,
                      opacity: [0, 1, 1, 0],
                      rotate: Math.random() * 720
                    }}
                    transition={{ 
                      duration: 10 + Math.random() * 5,
                      delay: Math.random() * 8,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                    className="absolute text-3xl"
                  >
                    🌹
                  </motion.div>
                ))}
              </div>
              
              {/* Hearts Background */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={`heart-bg-${i}`}
                    animate={{ 
                      opacity: [0.1, 0.3, 0.1],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      duration: 3 + Math.random() * 2,
                      delay: Math.random() * 2,
                      repeat: Infinity
                    }}
                    className="absolute text-6xl opacity-10"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                  >
                    💖
                  </motion.div>
                ))}
              </div>
              
              <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8 -mt-3">
                {/* Title */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-12"
                >
                  <motion.h1
                    className="text-5xl md:text-6xl font-black mb-4 flex items-center justify-center gap-3"
                  >
                    <span className="text-6xl">💌</span>
                    <span className="text-transparent bg-gradient-to-r from-red-400 via-pink-400 to-rose-400 bg-clip-text">
                      DIGITAL LOVE LETTER
                    </span>
                    <span className="text-6xl">💌</span>
                  </motion.h1>
                  <p className="text-lg md:text-xl text-gray-400 italic">
                    Surat Cinta dari Apis, Ditulis Sepenuh Hati 💝
                  </p>
                </motion.div>
              
                {/* Letter Container */}
                <motion.div
                  initial={{ scale: 0, rotateY: -180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ duration: 1, delay: 0.5, type: 'spring', damping: 15 }}
                  className="relative max-w-3xl w-full"
                >
                  {/* Paper Effect */}
                  <div className="relative bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg shadow-2xl overflow-hidden border-4 border-red-300">
                    {/* Decorative Corners */}
                    <div className="absolute top-0 left-0 w-24 h-24 opacity-20">
                      <svg viewBox="0 0 100 100" className="text-red-500 fill-current">
                        <path d="M0,0 L100,0 L0,100 Z" />
                      </svg>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 opacity-20">
                      <svg viewBox="0 0 100 100" className="text-red-500 fill-current transform rotate-90">
                        <path d="M0,0 L100,0 L0,100 Z" />
                      </svg>
                    </div>
              
                    {/* Letter Content */}
                    <div className="relative p-8 md:p-12 max-h-[70vh] overflow-y-auto">
                      {/* Header */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-right mb-8"
                      >
                        <p className="text-red-800 font-serif text-sm italic">Bandung, 4 November 2025</p>
                      </motion.div>
              
                      {/* Salutation */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 }}
                        className="mb-6"
                      >
                        <h2 className="text-3xl font-bold text-red-900 font-serif mb-2">
                          Untuk Jejell Tersayang 💖
                        </h2>
                        <div className="h-1 w-32 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
                      </motion.div>
              
                      {/* Letter Body - Animated Typing Effect */}
                      <div className="space-y-6 text-gray-800 font-serif text-lg leading-relaxed">
                        {[
                          "Halo Jejell sayang, bubub yang selalu bikin hari-hari apis penuh warna 🌈",
                          
                          "Setiap hari bareng bububb, walaupun LDR, rasanya kayak dapet hadiah baru. Dari chat pagi yang bikin semangat, sampai cerita-cerita kecil yang kita share, semuanya berarti banget buat apiss. Bububb selalu tahu caranya bikin apis tersenyum, bahkan di hari-hari yang berat sekalipun 💫",
                          
                          "Apis bersyukur banget bisa kenal bububb. Dari awal kenal sampai sekarang, bububb udah ngajarin apiss banyak hal tentang arti sayang, tentang sabar, dan tentang gimana caranya mencintai dengan tulus. Bububb bikin apis jadi versi yang lebih baik dari diri sendiri 🌟",
                          
                          "Apis cuma gak tahu… nanti pas ketemu bakal gugup, senang, atau malah gak bisa ngomong apa-apa 😅 Tapi yang jelas, apis pengen momen itu jadi salah satu hal paling spesial yang pernah terjadi 💫",
                          
                          "Mungkin kita belum sempurna, masih ada banyak hal yang harus kita pelajari bareng. Tapi apiss yakin, selama kita masih saling percaya dan saling support, kita pasti bisa hadapin semuanya. Karena bububb bukan cuma orang yang bikin hati ini deg-degan tiap hari, tapi juga seseorang yang pengen banget apiss perjuangin buat jadi masa depan 💞",
                          
                          "Di hari ulang tahunmu ini, apis pengen bububb tau kalau bububb tuh special banget ihh. Bububb deserve semua kebahagiaan di dunia. Dan apis akan selalu ada, selalu support, dan selalu sayang sama bububb, apapun yang terjadi 🎂✨",
                          
                          "Semoga dengan bertambahnya usia bububb, ke depannya semua impian bububb tercapai yaaa. Semoga bububb selalu sehat, selalu bahagia, dan selalu surrounded by people who love you (terutama apis yang nggak akan pernah berhenti sayang sama bububbb hehe 💕)",
                          
                          "Thank you so much bububb yang paling cantik di seluruh dunia udah jadi bagian paling indah dalam hidup apiss yaa. Thank you udah mau terima apiss apa adanya, dengan semua kekurangan dan kelebihan apiss. Bububb bener-bener hadiah terbaik yang pernah apis terima 🎁. Makasihh banyak Ya Allah 😇"
                        ].map((paragraph, idx) => (
                          <motion.p
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.5 + (idx * 0.3) }}
                            className="text-justify"
                          >
                            {paragraph}
                          </motion.p>
                        ))}
                      </div>
                      
                      {/* Closing */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 4 }}
                        className="mt-12 space-y-4"
                      >
                        <p className="text-xl font-bold text-red-900 font-serif">
                          Forever yours,
                        </p>
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{ rotate: [0, -5, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            className="text-4xl"
                          >
                            💖
                          </motion.div>
                          <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text font-serif">
                            Apiss
                          </p>
                        </div>
                      </motion.div>
                      
                      {/* PS Section */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 4.5 }}
                        className="mt-8 p-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg"
                      >
                        <p className="text-sm font-serif text-gray-700 italic">
                          <span className="font-bold not-italic">P.S.</span> Aku bikin website ini khusus buat kamu, bubub. Semoga kamu suka ya! Dan ingat, ini baru awal dari banyak surprise yang apis siapin buat kamu 😘🎉
                        </p>
                      </motion.div>
                    </div>
                      
                    {/* Stamp Effect */}
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: -15 }}
                      transition={{ delay: 5, type: 'spring', damping: 10 }}
                      className="absolute bottom-8 right-8"
                    >
                      <div className="w-32 h-32 border-4 border-red-600 rounded-full flex items-center justify-center bg-red-100/50 transform rotate-12">
                        <div className="text-center">
                          <p className="text-red-600 font-black text-xs">SEALED WITH</p>
                          <p className="text-4xl">💋</p>
                          <p className="text-red-600 font-black text-xs">LOVE</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                      
                  {/* Envelope Bottom (decorative) */}
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.8 }}
                    className="relative h-24 bg-gradient-to-b from-red-400 to-red-600 -mt-4 rounded-b-lg shadow-xl"
                    style={{ clipPath: 'polygon(0 0, 50% 100%, 100% 0)' }}
                  />
                </motion.div>
              </div>
                      
              {/* Navigation Buttons */}
              <div className="fixed bottom-8 left-8 right-8 flex justify-between pointer-events-none z-50">
                {currentPortalIndex > 0 && (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToPrevPortal}
                    className="px-6 py-3 bg-gray-800/90 backdrop-blur-sm text-white rounded-lg font-bold flex items-center gap-2 shadow-xl border border-gray-700 hover:border-red-500/50 transition-all pointer-events-auto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Previous
                  </motion.button>
                )}
                <div className="flex-1"></div>
                {currentPortalIndex < portals.length - 1 && (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToNextPortal}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-bold flex items-center gap-2 shadow-xl pointer-events-auto"
                  >
                    Next
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                )}
              </div>
            </div>
          )}
          
          {/* PORTAL 6: Birthday Cake 3D Interactive */}
          {selectedPortal === 'cake' && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-pink-950 to-indigo-950 overflow-hidden">
              {/* Confetti Background */}
              <AnimatePresence>
                {foundEasterEgg && (
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(100)].map((_, i) => (
                      <motion.div
                        key={`confetti-${i}`}
                        initial={{ 
                          y: -50, 
                          x: Math.random() * window.innerWidth,
                          rotate: 0,
                          opacity: 1
                        }}
                        animate={{ 
                          y: window.innerHeight + 50,
                          rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                          opacity: 0
                        }}
                        transition={{ 
                          duration: 3 + Math.random() * 2,
                          delay: Math.random() * 2,
                          ease: 'linear'
                        }}
                        className="absolute w-3 h-3"
                        style={{
                          backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'][Math.floor(Math.random() * 6)]
                        }}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
              
              {/* Floating Hearts */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={`heart-float-${i}`}
                    animate={{ 
                      y: [0, -30, 0],
                      x: [0, Math.sin(i) * 20, 0],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                      duration: 3 + Math.random() * 2,
                      delay: Math.random() * 2,
                      repeat: Infinity
                    }}
                    className="absolute text-4xl"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`
                    }}
                  >
                    💖
                  </motion.div>
                ))}
              </div>
              
              <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
                {/* Title */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-12"
                >
                  <motion.h1
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-5xl md:text-6xl font-black mb-4 flex items-center justify-center gap-3"
                  >
                    <span className="text-6xl">🎂</span>
                    <span className="text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text">
                      HAPPY 22ND BIRTHDAY
                    </span>
                    <span className="text-6xl">🎉</span>
                  </motion.h1>
                  <p className="text-lg md:text-xl text-gray-400 italic">
                    Ayo tiup lilinnya Bubbb..🕯️✨
                  </p>
                </motion.div>

                {/* 3D Cake Container */}
                <motion.div
                  initial={{ scale: 0, rotateY: -180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ duration: 1, type: 'spring', damping: 15 }}
                  className="relative w-full max-w-lg mb-8 -mt-12"
                  style={{ perspective: '2000px' }}
                >
                  <div className="relative" style={{ height: '400px' }}>
                    {/* Rotating Container */}
                    <motion.div
                      animate={{ 
                        rotateY: selectedStar ? [0, 360] : 0 
                      }}
                      transition={{ 
                        duration: 20, 
                        repeat: Infinity, 
                        ease: 'linear' 
                      }}
                      style={{ 
                        transformStyle: 'preserve-3d',
                        position: 'absolute',
                        left: '50%',
                        bottom: '40px',
                        transform: 'translateX(-50%)'
                      }}
                    >
                      {/* LAYER 1 - BOTTOM (BIGGEST) */}
                      <div 
                        className="relative"
                        style={{ 
                          width: '240px',
                          height: '80px',
                          transformStyle: 'preserve-3d',
                          position: 'absolute',
                          bottom: '0',
                          left: '50%',
                          transform: 'translateX(-50%)'
                        }}
                      >
                        {/* Top surface */}
                        <div 
                          className="absolute inset-0 rounded-lg overflow-hidden"
                          style={{
                            background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                            transform: 'rotateX(-90deg) translateZ(40px)',
                            boxShadow: '0 10px 30px rgba(236, 72, 153, 0.5)'
                          }}
                        >
                          {/* Sprinkles on top */}
                          {[...Array(25)].map((_, i) => (
                            <div
                              key={`s1-${i}`}
                              className="absolute rounded-full"
                              style={{
                                width: '4px',
                                height: '4px',
                                backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][i % 5],
                                left: `${10 + Math.random() * 80}%`,
                                top: `${10 + Math.random() * 80}%`,
                                boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
                              }}
                            />
                          ))}
                        </div>
                        
                        {/* Front face */}
                        <div 
                          className="absolute inset-0 rounded-lg"
                          style={{
                            background: 'linear-gradient(180deg, #ec4899 0%, #be185d 100%)',
                            transform: 'rotateY(0deg) translateZ(120px)',
                            boxShadow: 'inset -5px 0 10px rgba(0,0,0,0.2)'
                          }}
                        >
                          {/* Frosting waves */}
                          <div className="absolute top-0 left-0 right-0 h-8 flex justify-around items-end">
                            {[...Array(8)].map((_, i) => (
                              <div
                                key={`f1-${i}`}
                                className="w-7 h-6 bg-white/80 rounded-b-full"
                                style={{ marginTop: '-4px' }}
                              />
                            ))}
                          </div>
                        </div>
                          
                        {/* Back face */}
                        <div 
                          className="absolute inset-0 rounded-lg"
                          style={{
                            background: 'linear-gradient(180deg, #be185d 0%, #9f1239 100%)',
                            transform: 'rotateY(180deg) translateZ(120px)'
                          }}
                        />

                        {/* Left face */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(180deg, #db2777 0%, #be185d 100%)',
                            transform: 'rotateY(-90deg) translateZ(120px)',
                            width: '240px',
                            transformOrigin: 'left'
                          }}
                        />

                        {/* Right face */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(180deg, #be185d 0%, #9f1239 100%)',
                            transform: 'rotateY(90deg) translateZ(120px)',
                            width: '240px',
                            transformOrigin: 'right'
                          }}
                        />
                      </div>
                        
                      {/* LAYER 2 - MIDDLE */}
                      <div 
                        className="relative"
                        style={{ 
                          width: '200px',
                          height: '70px',
                          transformStyle: 'preserve-3d',
                          position: 'absolute',
                          bottom: '80px',
                          left: '50%',
                          transform: 'translateX(-50%)'
                        }}
                      >
                        {/* Top surface */}
                        <div 
                          className="absolute inset-0 rounded-lg overflow-hidden"
                          style={{
                            background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
                            transform: 'rotateX(-90deg) translateZ(35px)',
                            boxShadow: '0 8px 25px rgba(168, 85, 247, 0.5)'
                          }}
                        >
                          {[...Array(20)].map((_, i) => (
                            <div
                              key={`s2-${i}`}
                              className="absolute rounded-full"
                              style={{
                                width: '3px',
                                height: '3px',
                                backgroundColor: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'][i % 4],
                                left: `${10 + Math.random() * 80}%`,
                                top: `${10 + Math.random() * 80}%`
                              }}
                            />
                          ))}
                        </div>
                        
                        {/* Front face */}
                        <div 
                          className="absolute inset-0 rounded-lg"
                          style={{
                            background: 'linear-gradient(180deg, #a855f7 0%, #7e22ce 100%)',
                            transform: 'rotateY(0deg) translateZ(100px)',
                            boxShadow: 'inset -5px 0 10px rgba(0,0,0,0.2)'
                          }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-6 flex justify-around items-end">
                            {[...Array(6)].map((_, i) => (
                              <div
                                key={`f2-${i}`}
                                className="w-7 h-5 bg-yellow-200/90 rounded-b-full"
                                style={{ marginTop: '-3px' }}
                              />
                            ))}
                          </div>
                        </div>
                          
                        {/* Back face */}
                        <div 
                          className="absolute inset-0 rounded-lg"
                          style={{
                            background: 'linear-gradient(180deg, #7e22ce 0%, #6b21a8 100%)',
                            transform: 'rotateY(180deg) translateZ(100px)'
                          }}
                        />

                        {/* Left face */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(180deg, #9333ea 0%, #7e22ce 100%)',
                            transform: 'rotateY(-90deg) translateZ(100px)',
                            width: '200px',
                            transformOrigin: 'left'
                          }}
                        />

                        {/* Right face */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(180deg, #7e22ce 0%, #6b21a8 100%)',
                            transform: 'rotateY(90deg) translateZ(100px)',
                            width: '200px',
                            transformOrigin: 'right'
                          }}
                        />
                      </div>
                        
                      {/* LAYER 3 - TOP (SMALLEST) */}
                      <div 
                        className="relative"
                        style={{ 
                          width: '160px',
                          height: '60px',
                          transformStyle: 'preserve-3d',
                          position: 'absolute',
                          bottom: '150px',
                          left: '50%',
                          transform: 'translateX(-50%)'
                        }}
                      >
                        {/* Top surface */}
                        <div 
                          className="absolute inset-0 rounded-lg overflow-hidden"
                          style={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            transform: 'rotateX(-90deg) translateZ(30px)',
                            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)'
                          }}
                        >
                          {[...Array(8)].map((_, i) => (
                            <motion.div
                              key={`h3-${i}`}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, delay: i * 0.15, repeat: Infinity }}
                              className="absolute text-base"
                              style={{
                                left: `${15 + (i * 12)}%`,
                                top: `${30 + (i % 2) * 25}%`
                              }}
                            >
                              💖
                            </motion.div>
                          ))}
                        </div>
                        
                        {/* Front face */}
                        <div 
                          className="absolute inset-0 rounded-lg"
                          style={{
                            background: 'linear-gradient(180deg, #6366f1 0%, #4f46e5 100%)',
                            transform: 'rotateY(0deg) translateZ(80px)',
                            boxShadow: 'inset -5px 0 10px rgba(0,0,0,0.2)'
                          }}
                        >
                          <div className="absolute top-0 left-0 right-0 h-5 flex justify-around items-end">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={`f3-${i}`}
                                className="w-6 h-4 bg-orange-200/90 rounded-b-full"
                                style={{ marginTop: '-2px' }}
                              />
                            ))}
                          </div>
                        </div>
                          
                        {/* Back face */}
                        <div 
                          className="absolute inset-0 rounded-lg"
                          style={{
                            background: 'linear-gradient(180deg, #4f46e5 0%, #4338ca 100%)',
                            transform: 'rotateY(180deg) translateZ(80px)'
                          }}
                        />

                        {/* Left face */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(180deg, #5b21b6 0%, #4f46e5 100%)',
                            transform: 'rotateY(-90deg) translateZ(80px)',
                            width: '160px',
                            transformOrigin: 'left'
                          }}
                        />

                        {/* Right face */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(180deg, #4f46e5 0%, #4338ca 100%)',
                            transform: 'rotateY(90deg) translateZ(80px)',
                            width: '160px',
                            transformOrigin: 'right'
                          }}
                        />
                      </div>

                      {/* CANDLES */}
                      <div 
                        className="absolute flex gap-4"
                        style={{
                          bottom: '210px',
                          left: '50%',
                          transform: 'translateX(-50%) translateZ(100px)'
                        }}
                      >
                        {/* Candle 1 */}
                        <div className="relative">
                          <motion.div
                            animate={{ scaleY: [1, 0.98, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                            className="w-9 h-20 rounded-t-full relative"
                            style={{
                              background: 'linear-gradient(180deg, #fef08a 0%, #fbbf24 100%)',
                              boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4), inset -2px 0 6px rgba(202, 138, 4, 0.3)',
                              border: '2px solid #fbbf24'
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent rounded-t-full" />
                            <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-yellow-900">
                              2
                            </div>
                          </motion.div>
                          
                          {/* ✅ PERBAIKAN 1: Api di atas lilin (centered) */}
                          {!foundEasterEgg && (
                            <motion.div
                              animate={{ 
                                scale: [1, 1.2, 1],
                                y: [0, -3, 0]
                              }}
                              transition={{ duration: 0.3, repeat: Infinity }}
                              className="absolute left-1/2 -translate-x-1/2 text-3xl"
                              style={{ 
                                top: '-40px',  // Posisi di atas lilin
                                left: 'calc(50% - 20px)', // Geser 20px ke kiri dari tengah
                                transform: 'translateX(-50%)',
                                filter: 'drop-shadow(0 0 10px rgba(251, 146, 60, 0.8))'
                              }}
                            >
                              🔥
                            </motion.div>
                          )}
                        </div>
                        
                        {/* Candle 2 */}
                        <div className="relative">
                          <motion.div
                            animate={{ scaleY: [1, 0.98, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                            className="w-9 h-20 rounded-t-full relative"
                            style={{
                              background: 'linear-gradient(180deg, #fbcfe8 0%, #ec4899 100%)',
                              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4), inset -2px 0 6px rgba(219, 39, 119, 0.3)',
                              border: '2px solid #f472b6'
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-transparent rounded-t-full" />
                            <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-pink-900">
                              2
                            </div>
                          </motion.div>
                          
                          {/* ✅ PERBAIKAN 1: Api di atas lilin (centered) */}
                          {!foundEasterEgg && (
                            <motion.div
                              animate={{ 
                                scale: [1, 1.2, 1],
                                y: [0, -3, 0]
                              }}
                              transition={{ duration: 0.3, repeat: Infinity, delay: 0.15 }}
                              className="absolute left-1/2 -translate-x-1/2 text-3xl"
                              style={{ 
                                top: '-40px',  // Posisi di atas lilin
                                left: 'calc(50% - 20px)', // Geser 20px ke kiri dari tengah
                                transform: 'translateX(-50%)',
                                filter: 'drop-shadow(0 0 10px rgba(251, 146, 60, 0.8))'
                              }}
                            >
                              🔥
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>


                    {/* PLATE */}
                    <div 
                    className="absolute bottom-0 left-[19%] -translate-x-1/2"

                      style={{
                        width: '320px',
                        height: '20px',
                        background: 'linear-gradient(135deg, #e5e7eb 0%, #9ca3af 50%, #e5e7eb 100%)',
                        borderRadius: '50%',
                        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.4), inset 0 -3px 10px rgba(0, 0, 0, 0.15)',
                        transform: 'rotateX(75deg)',
                        border: '3px solid #d1d5db'
                      }}
                    >
                    </div>
                    
                  </div>
                    

                </motion.div>
                  
                {/* ✅ PERBAIKAN 3: Tombol lebih kecil & lebih atas */}
                {/* Instructions */}
                {!foundEasterEgg ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="text-center"
                    style={{ marginTop: '-20px' }}  // Geser ke atas
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setFoundEasterEgg(true);

                        // Play confetti sound
                        setTimeout(() => {
                          const confettiAudio = new Audio('/audio/soundbirthday.mp3');
                          confettiAudio.volume = 0.3;
                          confettiAudio.play().catch(() => {});
                        }, 500);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-lg font-bold rounded-full shadow-lg shadow-pink-500/50 hover:shadow-pink-500/80 transition-all flex items-center gap-2 mx-auto"
                    >
                      <span className="text-2xl">💨</span>
                      Tiup Lilinya...
                    </motion.button>
                    <p className="text-xs text-gray-400 mt-3">Klik tombol untuk meniup lilin 🎂</p>
                  </motion.div>
                ) : (

                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-5xl mx-auto px-4"
                  >
                    <div className="grid md:grid-cols-2 gap-6 items-center">

                      {/* Right: Button */}
                      <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col items-center justify-center gap-6"
                      > 
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              {/* Navigation Buttons */}
              <div className="fixed bottom-8 left-8 right-8 flex justify-between pointer-events-none z-50">
                {currentPortalIndex > 0 && (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToPrevPortal}
                    className="px-6 py-3 bg-gray-800/90 backdrop-blur-sm text-white rounded-lg font-bold flex items-center gap-2 shadow-xl border border-gray-700 hover:border-pink-500/50 transition-all pointer-events-auto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Previous
                  </motion.button>
                )}
                <div className="flex-1"></div>
                {currentPortalIndex < portals.length - 1 && (
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToNextPortal}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold flex items-center gap-2 shadow-xl pointer-events-auto"
                  >
                    Next
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                )}
              </div>
            </div>
          )}
          
          {/* PORTAL 7: Finale - Journey Continues */}
          {selectedPortal === 'finale' && (
            <div className="absolute inset-0 bg-black overflow-y-auto overflow-x-hidden">
              {/* Animated Stars Background - Fixed */}
              <div className="fixed inset-0 pointer-events-none">
                {[...Array(200)].map((_, i) => (
                  <motion.div
                    key={`star-bg-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      delay: Math.random() * 5,
                      repeat: Infinity,
                      repeatDelay: Math.random() * 3
                    }}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      boxShadow: '0 0 2px #fff'
                    }}
                  />
                ))}
              </div>
              
              {/* Gradient Overlay - Fixed */}
              <div className="fixed inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-black pointer-events-none" />
              
              {/* Rising Light Beams - Fixed */}
              <div className="fixed inset-0 pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`beam-${i}`}
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ 
                      opacity: [0, 0.3, 0],
                      scaleY: [0, 1, 0]
                    }}
                    transition={{
                      duration: 4,
                      delay: 2 + (i * 0.3),
                      repeat: Infinity,
                      repeatDelay: 5
                    }}
                    className="absolute bottom-0 w-1 h-full bg-gradient-to-t from-cyan-400 via-blue-500 to-transparent blur-sm"
                    style={{ left: `${(i + 1) * 12}%` }}
                  />
                ))}
              </div>
              
              <div className="relative z-10 min-h-screen flex flex-col items-center justify-start p-8 pt-20 pb-32">
                {/* Main Title Animation */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-center mb-12"
                >
                  <motion.div
                    animate={{ 
                      rotateY: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotateY: { duration: 3, repeat: Infinity, ease: 'linear' },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                    className="text-8xl mb-6"
                  >
                    🌟
                  </motion.div>
                  
                  <motion.h1
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-5xl md:text-7xl font-black mb-6"
                  >
                    <span className="text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text">
                      THIS IS JUST
                    </span>
                    <br />
                    <span className="text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text">
                      THE BEGINNING
                    </span>
                  </motion.h1>
                  
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ 
                      delay: 1.5, 
                      duration: 1,
                      opacity: { duration: 0.8 }
                    }}
                    className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mb-8"
                    style={{ width: '300px' }}
                  />
                </motion.div>
                  
                {/* Motivational Cards */}
                <div className="max-w-4xl w-full space-y-6 mb-12">
                  {[
                    {
                      icon: '🎓',
                      title: 'TERUS BELAJAR & BERKEMBANG',
                      desc: 'Bubub punya potensi luar biasa, dan setiap langkah kecil yang bubub ambil hari ini akan membawa bubub makin dekat ke impian besar itu. Apis selalu percaya, bubub bisa jadi yang terbaik di bidangnya 🌷',
                      color: 'from-blue-600 to-cyan-600',
                      delay: 2
                    },
                    {
                      icon: '💪',
                      title: 'KUAT & BERANI',
                      desc: 'Seperti yang bubub tulis tadi yaitu bubub akan jadi kuat dan berani seperti superhero!! yeayyy... Apis akan selalu ada di sisi bubub, always support dalam setiap langkah dan keputusan bubub. Together we are unstoppable!',
                      color: 'from-purple-600 to-pink-600',
                      delay: 2.5
                    },
                    {
                      icon: '🚀',
                      title: 'KEJAR SEMUA MIMPI',
                      desc: 'Semua cita-cita bubub, sekecil atau sebesar apapun ituu, pasti bisa tercapai! Haruss optimmis yaa, sayangkuuu. Jangan pernah ragu untuk bermimpi besar. Apis akan selalu cheering for you, celebrating every milestone kamu.',
                      color: 'from-pink-600 to-red-600',
                      delay: 3
                    },
                    {
                      icon: '💖',
                      title: 'KITA BERSAMA',
                      desc: 'Perjalanan ini gak akan mudah, tapi kita hadapi bareng. Setiap struggle, setiap achievement, setiap momen ayoo kita saling share together. Ini bukan cuma journey bubub, tapi journey kita berdua menuju masa depan yang kita impikan bersamaa.',
                      color: 'from-red-600 to-orange-600',
                      delay: 3.5
                    }
                  ].map((card, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: card.delay, type: 'spring', damping: 15 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="relative group"
                    >
                      <div className={`relative bg-gradient-to-r ${card.color} p-1 rounded-2xl`}>
                        <div className="bg-gray-900/95 backdrop-blur-xl p-6 rounded-2xl">
                          <div className="flex items-start gap-4">
                            <motion.div
                              animate={{ 
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                              }}
                              className="text-5xl"
                            >
                              {card.icon}
                            </motion.div>
                            
                            <div className="flex-1">
                              <h3 className="text-2xl font-black text-white mb-2">
                                {card.title}
                              </h3>
                              <p className="text-gray-300 leading-relaxed">
                                {card.desc}
                              </p>
                            </div>
                          </div>
                            
                          {/* Sparkle Effect */}
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ 
                                scale: [0, 1, 0],
                                opacity: [0, 1, 0],
                                x: [0, Math.random() * 40 - 20],
                                y: [0, Math.random() * 40 - 20]
                              }}
                              transition={{
                                duration: 2,
                                delay: card.delay + 0.5 + (i * 0.2),
                                repeat: Infinity,
                                repeatDelay: 4
                              }}
                              className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                              style={{
                                top: '50%',
                                left: '10%',
                                boxShadow: '0 0 10px #fef08a'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Final Message */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 4.5, type: 'spring', damping: 15 }}
                  className="text-center max-w-3xl mb-12"
                >
                  <div className="relative bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-xl p-10 rounded-3xl border-2 border-purple-500/50">
                    {/* Floating hearts around message */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={`final-heart-${i}`}
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0.5, 1, 0.5],
                          scale: [1, 1.2, 1]
                        }}
                        transition={{
                          duration: 2,
                          delay: 5 + (i * 0.2),
                          repeat: Infinity
                        }}
                        className="absolute text-3xl"
                        style={{
                          left: `${(i / 8) * 100}%`,
                          top: i % 2 === 0 ? '-20px' : 'auto',
                          bottom: i % 2 === 0 ? 'auto' : '-20px'
                        }}
                      >
                        💖
                      </motion.div>
                    ))}

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 5 }}
                      className="text-3xl md:text-4xl font-black text-transparent bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text mb-6"
                    >
                      Bububbb, You Are Extraordinary! ✨
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 5.5 }}
                      className="text-xl text-gray-300 leading-relaxed mb-6"
                    >
                      Ini bukan cuma birthday gift, tapi reminder bahwa bubub itu <span className="text-pink-400 font-bold">amazing</span>, 
                      <span className="text-purple-400 font-bold"> talented</span>, dan 
                      <span className="text-cyan-400 font-bold"> capable</span> of achieving anything!
                    </motion.p>
                  
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 6 }}
                      className="text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text"
                    >
                      Keep shining, keep growing, keep being YOU! 🌟
                    </motion.p>
                  </div>
                </motion.div>
                  
                {/* Thank You Section */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 6.5 }}
                  className="text-center space-y-6"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 360, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity
                    }}
                    className="text-7xl mb-4"
                  >
                    🎁
                  </motion.div>
                  
                  <h2 className="text-4xl font-black text-white mb-4">
                    Thank You for Being Born! 🎂
                  </h2>
                  
                  <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-6">
                    Thank you for coming into this world, thank you for being in my life, 
                    and thank you for making every day brighter just by existing.
                  </p>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 7 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <p className="text-3xl font-black text-transparent bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text">
                      I Love You So Much, Bububbb 💕
                    </p>
                    <p className="text-lg text-gray-500 italic">
                      Forever & Always, Apis
                    </p>
                  
                    {/* Signature with heart */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity
                      }}
                      className="flex items-center gap-3 mt-4"
                    >
                      <div className="text-4xl">💖</div>
                      <div className="text-2xl font-bold text-pink-400">∞</div>
                      <div className="text-4xl">💖</div>
                    </motion.div>
                  </motion.div>
                    
                  {/* Restart Journey Button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 8 }}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 40px rgba(236, 72, 153, 0.6)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setCurrentPortalIndex(0);
                      setSelectedPortal('gallery');
                      playPortalAudio(0);
                    }}
                    className="mt-8 px-10 py-4 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white text-xl font-bold rounded-full shadow-lg shadow-pink-500/50 hover:shadow-pink-500/80 transition-all flex items-center gap-3 mx-auto"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Relive The Journey
                    <span className="text-2xl">✨</span>
                  </motion.button>
                </motion.div>
              </div>
                  
              {/* Bottom Shooting Stars - Fixed */}
              <div className="fixed bottom-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={`shooting-${i}`}
                    initial={{ x: '-100%', y: Math.random() * 100 }}
                    animate={{ 
                      x: '200%',
                      y: Math.random() * 100 + 50
                    }}
                    transition={{
                      duration: 2,
                      delay: 8 + (i * 1.5),
                      repeat: Infinity,
                      repeatDelay: 5
                    }}
                    className="absolute"
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-yellow-300 rounded-full" style={{ boxShadow: '0 0 10px #fef08a' }} />
                      <div className="w-20 h-0.5 bg-gradient-to-r from-yellow-300 to-transparent ml-1" />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Navigation */}
              <div className="fixed bottom-8 left-8 right-8 flex justify-between pointer-events-none z-50">
                {currentPortalIndex > 0 && (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToPrevPortal}
                    className="px-6 py-3 bg-gray-800/90 backdrop-blur-sm text-white rounded-lg font-bold flex items-center gap-2 shadow-xl border border-gray-700 hover:border-purple-500/50 transition-all pointer-events-auto"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    Previous
                  </motion.button>
                )}
              </div>
            </div>
          )}

          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Modal */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-12 right-0 text-white hover:text-pink-400 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
        
              <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border-2 border-pink-500/50 shadow-2xl">
                <div className="aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <img
                    src={`/image/${selectedCategory}/${selectedCategory}${selectedPhoto + 1}.jpg`}
                    alt={`${selectedCategory} ${selectedPhoto + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="text-center hidden flex-col items-center justify-center">
                    <div className="text-9xl mb-4">📷</div>
                    <p className="text-2xl text-gray-400">Photo {selectedPhoto + 1}</p>
                    <p className="text-sm text-gray-600 mt-2 capitalize">{selectedCategory} Collection</p>
                  </div>
                </div>
                  
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const maxPhotos = selectedCategory === 'selfie' ? 19 : 
                                     selectedCategory === 'model' ? 4 : 
                                     selectedCategory === 'formal' ? 2 : 
                                     selectedCategory === 'grid' ? 4 : 5;
                    setSelectedPhoto(selectedPhoto > 0 ? selectedPhoto - 1 : maxPhotos - 1);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-pink-600 rounded-full flex items-center justify-center text-white transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const maxPhotos = selectedCategory === 'selfie' ? 19 : 
                                     selectedCategory === 'model' ? 4 : 
                                     selectedCategory === 'formal' ? 2 : 
                                     selectedCategory === 'grid' ? 4 : 5;
                    setSelectedPhoto(selectedPhoto < maxPhotos - 1 ? selectedPhoto + 1 : 0);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-pink-600 rounded-full flex items-center justify-center text-white transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Special Mode Modal */}
      <AnimatePresence>
        {showSpecialModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => {
              setShowSpecialModal(false);
              setSpecialInput('');
              setSpecialError('');
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-gray-900/98 to-gray-800/98 backdrop-blur-xl p-8 rounded-2xl border-2 border-yellow-500/50 shadow-2xl max-w-lg w-full mx-4"
            >
              <button
                onClick={() => {
                  setShowSpecialModal(false);
                  setSpecialInput('');
                  setSpecialError('');
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🔐
                </motion.div>
                <h3 className="text-3xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text mb-3">
                  UNLOCK SPECIAL PHOTO
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Ayo ketik bubbb, biar portal menuju foto spesial terbuka ✨
                </p>
                
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-500/30 rounded-lg p-4 mb-6">
                  <p className="text-yellow-300 font-bold text-lg italic">
                    "Jejell akan menjadi kuat dan berani seperti superhero"
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <textarea
                    value={specialInput}
                    onChange={(e) => setSpecialInput(e.target.value)}
                    placeholder="Ketik kalimat di sini..."
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-900/70 border border-yellow-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all resize-none"
                  />
                  
                  {specialError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm mt-2 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                      </svg>
                      {specialError}
                    </motion.p>
                  )}
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowSpecialModal(false);
                      setSpecialInput('');
                      setSpecialError('');
                    }}
                    className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all"
                  >
                    Batal
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(234, 179, 8, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSpecialSubmit}
                    className="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-lg shadow-lg shadow-yellow-500/30 hover:shadow-yellow-500/60 transition-all"
                  >
                    Submit
                  </motion.button>
                </div>
              </div>

              <p className="text-center text-gray-600 text-xs mt-6">
                Tip: Perhatikan huruf besar/kecil dan tanda bacanya Sayangkuu...🔍
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Special Photo Modal */}
      <AnimatePresence>
        {showSpecialPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
            onClick={() => setShowSpecialPhoto(false)}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 3, opacity: 0.3 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 blur-3xl"
            />

            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`ray-${i}`}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: [0, 2, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2, delay: i * 0.1, ease: 'easeOut' }}
                className="absolute w-[800px] h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent blur-sm"
                style={{ transform: `rotate(${i * 30}deg)`, transformOrigin: 'center' }}
              />
            ))}

            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: -180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotateY: 180 }}
              transition={{ type: 'spring', damping: 20, delay: 0.5 }}
              className="relative max-w-3xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(234, 179, 8, 0.5)',
                    '0 0 60px rgba(234, 179, 8, 0.8)',
                    '0 0 30px rgba(234, 179, 8, 0.5)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Tombol Close */}
                <button
                  onClick={() => setShowSpecialPhoto(false)}
                  className="
                    absolute 
                    right-14
                    top-8
                    text-white 
                    hover:text-yellow-400 
                    transition-colors 
                    z-20 
                    text-5xl    /* Memperbesar ukuran font/tombol */
                    font-bold
                    select-none /* agar tidak terselect teks */
                    cursor-pointer
                  "
                  aria-label="Close Special Photo"
                >
                  ×
                </button>

              
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border-4 border-yellow-500 shadow-2xl p-4 sm:p-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-transparent to-orange-500/20 animate-pulse" />

                  <div className="relative aspect-[4/3] flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 p-3 sm:p-4">
                    <motion.img
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      src="/image/special/special.png"
                      alt="Special Photo"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  </div>
                    
                  {/* Judul dan Caption */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="relative bg-gradient-to-r from-yellow-900/80 to-orange-900/80 backdrop-blur-sm p-4 rounded-b-2xl max-w-full flex flex-col items-center justify-center text-center"
                  >
                    <p className="text-lg sm:text-xl font-black text-yellow-300 mb-1 whitespace-normal break-words px-2 sm:px-4">
                      ⚡ JEJELL THE SUPERHERO ⚡
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300 italic max-w-xl mx-auto px-2 sm:px-4 leading-relaxed">
                      Kadang pahlawan itu nggak datang dengan kekuatan besar, tapi dengan hati yang tahu cara mencintai dengan tulus 💖
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;