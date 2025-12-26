
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Heart, Lock, Sparkles, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import FloatingHearts from './components/FloatingHearts';
import MusicToggle, { MusicToggleHandle } from './components/MusicToggle';
import { MEMORIES, SPECIAL_REASONS, BIRTHDAY_MESSAGE } from './constants';

const LoveNote: React.FC<{ emoji: string; line: string; index: number }> = ({ emoji, line, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? -2 : 2 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.05, duration: 0.8 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="relative group cursor-pointer"
    >
      <div 
        style={{ transform: "translateZ(30px)" }}
        className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-[0_8px_25px_-12px_rgba(251,207,232,0.4)] border border-pink-50 flex flex-col items-center text-center space-y-4 md:space-y-6 transition-all duration-300 group-hover:shadow-[0_20px_40px_-10px_rgba(251,207,232,0.6)] group-hover:bg-pink-50/20"
      >
        <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-50 rounded-full flex items-center justify-center text-3xl md:text-4xl transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
          {emoji}
        </div>
        <p className="text-pink-800 text-lg md:text-xl cursive leading-relaxed px-1">
          {line}
        </p>
        <div className="absolute top-4 right-5 text-pink-100 group-hover:text-pink-200 transition-colors">
          <Heart size={16} fill="currentColor" className="md:w-5 md:h-5" />
        </div>
      </div>
    </motion.div>
  );
};

const App: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [isWishing, setIsWishing] = useState(false);
  const musicRef = useRef<MusicToggleHandle>(null);

  const handleOpenLetter = () => {
    setIsStarted(true);
    
    // 1. Play a sweet Birthday Chime (Music Box Style)
    // Using a reliable public URL for a "Happy Birthday" music box segment
    const birthdayChime = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_51c6e149c4.mp3');
    birthdayChime.volume = 0.6;
    birthdayChime.play().catch(e => console.log("Audio interaction required", e));

    // 2. Play 'Dooron Dooron' style background music after the chime finishes
    // We start it after 3.5 seconds to ensure the chime is heard clearly first
    setTimeout(() => {
      musicRef.current?.playMusic();
    }, 3500);

    // 3. Initial Visual Celebration
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#fbcfe8', '#fce7f3', '#fda4af']
    });
  };

  const triggerWish = () => {
    setIsWishing(true);
    confetti({
      particleCount: window.innerWidth < 768 ? 100 : 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbcfe8', '#fce7f3', '#fdf2f8', '#fda4af']
    });
    setTimeout(() => setIsWishing(false), 4000);
  };

  return (
    <div className="relative min-h-screen selection:bg-pink-100 selection:text-pink-600 bg-[#fffcfd]">
      <FloatingHearts />
      <MusicToggle ref={musicRef} />

      <AnimatePresence mode="wait">
        {!isStarted ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fffafa] text-center px-6"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="space-y-6"
            >
              <h1 className="poetic text-4xl md:text-6xl text-pink-800 font-medium">
                For Puspita <span className="text-pink-400">💗</span>
              </h1>
              <p className="cursive text-xl md:text-2xl text-pink-400 italic">Something special awaits you...</p>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#fdf2f8" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenLetter}
              className="mt-16 px-12 py-4 bg-white text-pink-500 rounded-full shadow-[0_12px_24px_rgba(251,207,232,0.4)] border border-pink-100 font-bold hover:shadow-xl transition-all duration-300 tracking-wider text-sm uppercase"
            >
              Open Letter
            </motion.button>
          </motion.div>
        ) : (
          <motion.main
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex flex-col items-center w-full"
          >
            {/* Hero Section */}
            <section className="min-h-[100dvh] flex flex-col items-center justify-center text-center px-6 relative py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="max-w-3xl"
              >
                <span className="text-pink-300 tracking-[0.3em] uppercase text-xs mb-8 block font-bold">Janamdin Mubarak</span>
                <h2 className="poetic text-4xl md:text-8xl text-pink-900 mb-8 leading-[1.15] font-medium">
                  Happy Birthday, <br/>Puspita 🎂
                </h2>
                <p className="text-pink-600 text-lg md:text-2xl cursive mt-6 opacity-80 max-w-md mx-auto">
                  May your day be as beautiful as the light in your heart.
                </p>
                <motion.div 
                  animate={{ y: [0, 12, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="mt-20 md:mt-24 text-pink-200 flex flex-col items-center cursor-default select-none"
                >
                  <span className="text-[10px] uppercase tracking-[0.4em] mb-4 font-bold text-pink-300">Scroll to see more</span>
                  <ChevronDown size={24} strokeWidth={1.5} className="md:w-7 md:h-7" />
                </motion.div>
              </motion.div>
            </section>

            {/* Memory Timeline */}
            <section className="w-full max-w-4xl px-6 py-20 md:py-32 overflow-hidden">
              <h3 className="poetic text-3xl md:text-5xl text-pink-800 mb-16 md:mb-24 text-center italic">A Journey of Us...</h3>
              <div className="relative border-l-2 border-pink-100/50 ml-4 md:ml-0 md:left-1/2 md:border-l">
                {MEMORIES.map((memory, index) => (
                  <motion.div
                    key={memory.id}
                    initial={{ 
                      opacity: 0, 
                      x: index % 2 === 0 ? -40 : 40, 
                      y: 30
                    }}
                    whileInView={{ 
                      opacity: 1, 
                      x: 0, 
                      y: 0
                    }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ 
                      duration: 1, 
                      ease: [0.22, 1, 0.36, 1], 
                      delay: 0.05 
                    }}
                    className={`relative mb-16 md:mb-32 md:w-1/2 ${index % 2 === 0 ? 'md:pr-16 md:text-right md:ml-[-50%]' : 'md:pl-16 md:text-left'}`}
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className={`absolute top-0 w-3 h-3 md:w-4 md:h-4 bg-pink-400 rounded-full border-2 md:border-4 border-white shadow-[0_0_12px_rgba(244,114,182,0.4)] -left-[10px] md:left-auto md:right-[-9px] transform translate-y-4`} 
                      style={index % 2 !== 0 ? {left: '-11px', right: 'auto'} : {}} 
                    />
                    
                    <motion.div 
                      className="bg-white/70 backdrop-blur-md p-6 md:p-10 rounded-[2rem] border border-pink-50 shadow-[0_10px_30px_-10px_rgba(251,207,232,0.3)] hover:shadow-[0_20px_45px_-12px_rgba(251,207,232,0.4)] transition-all duration-500"
                    >
                      <span className="text-pink-300 font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase">{memory.date}</span>
                      <h4 className="poetic text-xl md:text-2xl text-pink-800 my-3 md:my-4">{memory.title}</h4>
                      <p className="text-pink-700/70 leading-relaxed text-base md:text-lg italic">"{memory.description}"</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Why You're Special Section */}
            <section className="w-full bg-gradient-to-b from-transparent via-pink-50/20 to-transparent py-24 md:py-40 px-6 overflow-hidden">
              <div className="max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16 md:mb-24"
                >
                  <h3 className="poetic text-4xl md:text-5xl text-pink-900 mb-6 font-medium">Why You're Extra Special</h3>
                  <div className="w-16 md:w-24 h-[2px] bg-gradient-to-r from-transparent via-pink-200 to-transparent mx-auto rounded-full" />
                  <p className="mt-6 md:mt-8 text-pink-400 cursive text-xl md:text-2xl italic">Just a few reasons why you're my favorite human...</p>
                </motion.div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 perspective-1000">
                  {SPECIAL_REASONS.map((reason, idx) => (
                    <LoveNote 
                      key={reason.id} 
                      emoji={reason.emoji} 
                      line={reason.line} 
                      index={idx} 
                    />
                  ))}
                </div>
              </div>
              <style>{`
                .perspective-1000 {
                  perspective: 1000px;
                }
              `}</style>
            </section>

            {/* Secret Message Feature */}
            <section className="w-full py-24 md:py-32 px-6 flex flex-col items-center">
              <h3 className="poetic text-3xl md:text-4xl text-pink-800 mb-10 md:mb-12 text-center italic">A Secret From My Heart</h3>
              <div className="relative max-w-2xl w-full">
                <motion.div
                  animate={{ 
                    filter: showSecret ? 'blur(0px)' : 'blur(16px)', 
                    opacity: showSecret ? 1 : 0.25,
                    scale: showSecret ? 1 : 0.97
                  }}
                  className="bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[3rem] shadow-[inset_0_2px_10px_rgba(251,207,232,0.1)] border border-pink-50 text-center transition-all duration-1000 ease-in-out"
                >
                  <p className="poetic text-lg md:text-2xl text-pink-950 leading-[2] md:leading-[2.2] whitespace-pre-wrap italic font-light">
                    {BIRTHDAY_MESSAGE}
                  </p>
                </motion.div>
                
                {!showSecret && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(236,72,153,0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowSecret(true)}
                      className="flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-pink-500 text-white rounded-full shadow-lg md:shadow-xl font-bold tracking-widest uppercase text-xs md:text-sm"
                    >
                      <Lock size={16} className="md:w-[18px]" />
                      Unlock Message
                    </motion.button>
                  </div>
                )}
              </div>
            </section>

            {/* Birthday Wish Celebration */}
            <section className="w-full py-24 md:py-40 px-6 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="max-w-xl mx-auto p-10 md:p-16 bg-white rounded-[2.5rem] md:rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(251,207,232,0.4)] border border-pink-50 relative overflow-hidden"
              >
                <div className="absolute -top-10 -left-10 w-32 md:w-40 h-32 md:h-40 bg-pink-50/40 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-10 -right-10 w-32 md:w-40 h-32 md:h-40 bg-pink-50/40 rounded-full blur-3xl"></div>
                
                <h3 className="poetic text-2xl md:text-3xl text-pink-800 mb-8 italic relative z-10">Make a Birthday Wish</h3>
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 20px 30px -5px rgb(251 207 232 / 0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={triggerWish}
                  className="group relative inline-flex items-center gap-3 md:gap-4 px-10 md:px-12 py-5 md:py-6 bg-pink-500 text-white rounded-full text-lg md:text-xl font-bold shadow-pink-200 shadow-2xl transition-all duration-300 overflow-hidden z-10"
                >
                  <span className="z-10 flex items-center gap-3 md:gap-4">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" />
                    Tap to Celebrate
                  </span>
                  {isWishing && (
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </motion.button>
                <AnimatePresence>
                  {isWishing && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-10 text-pink-600 cursive text-2xl md:text-3xl font-medium px-4"
                    >
                      May all your beautiful dreams come true! ✨
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </section>

            {/* Ending Screen */}
            <section className="min-h-[60vh] md:h-screen flex flex-col items-center justify-center text-center px-6 relative py-20">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 2 }}
                className="space-y-10 md:space-y-12"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 3, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  <Heart className="w-16 h-16 md:w-20 md:h-20 text-pink-400 mx-auto" fill="currentColor" />
                </motion.div>
                <div className="space-y-4 md:space-y-6">
                  <h2 className="poetic text-3xl md:text-5xl text-pink-900 italic font-light leading-relaxed">
                    Made with love,<br/>for Puspita.
                  </h2>
                  <div className="pt-4 flex flex-col items-center gap-2">
                    <p className="text-pink-300 tracking-[0.4em] uppercase text-[9px] md:text-[10px] font-black">
                      Yours Forever & Always
                    </p>
                    <div className="w-12 h-px bg-pink-100 mt-2" />
                  </div>
                </div>
              </motion.div>
            </section>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
