
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Signature, HeartPulse, BrainCircuit, ChartLine, ChevronDown, Trash2, Bookmark, X, Star, Copy, Loader2, Compass } from 'lucide-react';
import { ScenarioType, ToneType, PolishingResult, HistoryItem } from './types';
import { SCENARIOS, TONES, MBTI_TYPES, LOCATIONS } from './constants';
import { polishLanguage } from './services/geminiService';

const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 aura-gradient opacity-5 blur-[120px] rounded-full scale-150"></div>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-16 h-16 aura-gradient rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl mb-6">
          <i className="fa-solid fa-signature"></i>
        </div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight mb-1">SocialSense</h1>
          <p className="text-indigo-500 font-bold uppercase tracking-[0.3em] text-[10px]">灵犀社交</p>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 1.5, ease: "easeInOut" }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-100 rounded-full overflow-hidden"
      >
        <motion.div 
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-full h-full aura-gradient"
        />
      </motion.div>
    </motion.div>
  );
};

const LogoPage: React.FC<{ onEnter: () => void }> = ({ onEnter }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[90] bg-white flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] aura-gradient opacity-10 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl w-full flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
          className="w-20 h-20 aura-gradient rounded-3xl flex items-center justify-center text-white text-3xl shadow-xl mb-10"
        >
          <i className="fa-solid fa-signature"></i>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-6 tracking-tight leading-tight">
            懂人心，会说话<br/>
            <span className="aura-text-gradient">让回应自带灵光</span>
          </h2>
          <p className="text-base text-slate-400 max-w-md mx-auto leading-relaxed mb-12">
            融合心理学洞察与跨文化沟通艺术，<br/>为您打造极具质感的高情商社交策略。
          </p>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          onClick={onEnter}
          className="aura-gradient px-10 py-4 rounded-2xl text-white font-black text-lg tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-3 group"
        >
          <span>开启灵犀之旅</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
};

const App: React.FC = () => {
  // View States
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isLogoPageVisible, setIsLogoPageVisible] = useState(true);

  // Input States
  const [context, setContext] = useState('');
  const [goal, setGoal] = useState('');
  const [scenario, setScenario] = useState<ScenarioType>(ScenarioType.WORK);
  const [customScenario, setCustomScenario] = useState('');
  const [tone, setTone] = useState<any>(ToneType.PROFESSIONAL);
  const [customTone, setCustomTone] = useState('');
  const [mbti, setMbti] = useState('');
  const [location, setLocation] = useState('');

  // App States
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PolishingResult | null>(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('social_sense_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('social_sense_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (!context.trim()) {
      setError('请输入对话背景或原话');
      return;
    }
    setError('');
    setLoading(true);
    setSelectedOptionId(null);

    const finalScenario = scenario === ScenarioType.CUSTOM ? customScenario : scenario;
    const selectedToneObj = TONES.find(t => t.id === tone);
    const finalTone = tone === ToneType.CUSTOM ? customTone : (selectedToneObj?.customValue || selectedToneObj?.label || tone);

    try {
      const data = await polishLanguage(context, finalScenario, finalTone, goal, mbti, location);
      setResult(data);
      
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        context,
        scenario: finalScenario,
        tone: finalTone,
        mbti,
        location,
        result: data,
        isStarred: false
      };
      setHistory(prev => [newItem, ...prev].slice(0, 50));
      
      setTimeout(() => {
        const element = document.getElementById('results-anchor');
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || '生成中遇到错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    if (history.length > 0) {
      setHistory(prev => {
        const updated = [...prev];
        updated[0] = { ...updated[0], selectedOptionId: optionId };
        return updated;
      });
    }
  };

  const handleReset = () => {
    if (window.confirm('确定要清空当前输入吗？')) {
      setContext('');
      setGoal('');
      setScenario(ScenarioType.WORK);
      setCustomScenario('');
      setTone(ToneType.PROFESSIONAL);
      setCustomTone('');
      setResult(null);
      setError('');
      setSelectedOptionId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    const btn = document.activeElement as HTMLElement;
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check text-green-500"></i>';
    setTimeout(() => btn.innerHTML = originalContent, 1500);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setContext(item.context);
    setResult(item.result);
    setMbti(item.mbti || '');
    setLocation(item.location || '');
    setSelectedOptionId(item.selectedOptionId || null);
    setShowHistory(false);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-32 selection:bg-indigo-100">
      <AnimatePresence>
        {isSplashVisible && (
          <SplashScreen key="splash" onComplete={() => setIsSplashVisible(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isSplashVisible && isLogoPageVisible && (
          <LogoPage key="logo-page" onEnter={() => setIsLogoPageVisible(false)} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: !isLogoPageVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
        className={isLogoPageVisible ? "hidden" : "block"}
      >
        {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-slate-200/40 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 aura-gradient rounded-xl flex items-center justify-center text-white text-lg shadow-sm">
            <i className="fa-solid fa-signature"></i>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-slate-800 text-lg leading-none tracking-tight">SocialSense</span>
            <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mt-1">灵犀社交</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="w-11 h-11 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-all relative group"
          >
            <i className="fa-regular fa-bookmark text-slate-400 group-hover:text-indigo-600 text-lg"></i>
            {history.length > 0 && <span className="absolute top-3 right-3 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>}
          </button>
        </div>
      </nav>

      {/* History Panel */}
      {showHistory && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm" onClick={() => setShowHistory(false)}></div>
          <div className="relative w-full max-sm:w-full max-w-sm bg-white h-full shadow-2xl p-8 overflow-y-auto animate-slide-in">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-bold text-slate-800">历史与收藏</h2>
              <button onClick={() => setShowHistory(false)} className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 rounded-full"><i className="fa-solid fa-xmark text-slate-300"></i></button>
            </div>
            <div className="space-y-4">
              {history.map(item => (
                <div key={item.id} onClick={() => loadFromHistory(item)} className="p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 bg-white hover:bg-indigo-50/20 cursor-pointer transition-all">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-2 uppercase">
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    {item.selectedOptionId && <i className="fa-solid fa-star text-amber-400"></i>}
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{item.context}</p>
                </div>
              ))}
              {history.length === 0 && <div className="text-center py-20 text-slate-300 text-sm">暂无记录</div>}
            </div>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <header className="pt-40 pb-16 px-6 text-center overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] aura-gradient opacity-5 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest mb-10 rounded-full">
            <i className="fa-solid fa-compass-drafting text-[8px]"></i>
            <span>Master Your Conversations</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-6 tracking-tight leading-[1.2]">
            懂人心，会说话<br/>
            <span className="aura-text-gradient">让回应自带灵光</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-md mx-auto leading-relaxed">
            融合心理学洞察与跨文化沟通艺术，<br/>为您打造极具质感的高情商社交策略。
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 space-y-12">
        {/* Step 1: Meta Settings */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card-premium p-8 rounded-[32px]">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-5 block">性格底色 / MBTI</label>
            <div className="relative">
              <select 
                value={mbti} 
                onChange={(e) => setMbti(e.target.value)}
                className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all appearance-none font-semibold text-slate-600"
              >
                <option value="">点击选择性格类型</option>
                {MBTI_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-[10px]"></i>
            </div>
          </div>
          <div className="card-premium p-8 rounded-[32px]">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 mb-5 block">文化场域</label>
            <div className="relative">
              <select 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-slate-50 border-none p-4 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 transition-all appearance-none font-semibold text-slate-600"
              >
                <option value="">选择沟通文化氛围</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none text-[10px]"></i>
            </div>
          </div>
        </div>

        {/* Step 2: Main Logic Card */}
        <div className="card-premium p-8 md:p-12 rounded-[48px] space-y-16">
          
          {/* Scenario */}
          <section>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 rounded-xl aura-gradient text-white flex items-center justify-center font-bold text-sm shadow-sm">1</div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">定义场域</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 mb-6">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScenario(s.id)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                    scenario === s.id
                      ? 'border-indigo-600 bg-indigo-50/30'
                      : 'border-slate-50 hover:border-slate-100 bg-slate-50/50'
                  }`}
                >
                  <span className={`text-xl ${s.color}`}>{s.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.id}</span>
                </button>
              ))}
            </div>
            {scenario === ScenarioType.CUSTOM && (
              <input
                type="text"
                value={customScenario}
                onChange={(e) => setCustomScenario(e.target.value)}
                placeholder="如：向导师反馈进度、应对推销..."
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500/10 outline-none font-medium text-slate-600"
              />
            )}
          </section>

          {/* Context Input */}
          <section>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 rounded-xl aura-gradient text-white flex items-center justify-center font-bold text-sm shadow-sm">2</div>
              <h2 className="text-lg font-bold tracking-tight text-slate-800">描绘境况</h2>
            </div>
            <div className="space-y-4">
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="描述发生了什么，或对方发来的原话。SocialSense 将为您精准润色。"
                className="w-full h-44 p-6 rounded-3xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500/10 outline-none resize-none font-medium leading-relaxed text-slate-600"
              />
              <div className="relative">
                 <div className="absolute inset-y-0 left-5 flex items-center text-slate-300">
                   <i className="fa-solid fa-bullseye text-sm"></i>
                 </div>
                 <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="核心预期目标（如：体面拒绝、争取利益等）"
                  className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500/10 outline-none font-medium text-slate-600"
                />
              </div>
            </div>
          </section>

          {/* Tone Styling */}
          <section>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 rounded-xl aura-gradient text-white flex items-center justify-center font-bold text-sm shadow-sm">3</div>
              <h2 className="text-xl font-bold tracking-tight text-slate-800">调色语气</h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`px-4 py-2.5 rounded-xl border-2 transition-all text-[11px] font-black uppercase tracking-wider flex items-center gap-2 ${
                    tone === t.id
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                      : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:text-indigo-600'
                  }`}
                >
                  {t.label}
                  {t.isHot && <i className="fa-solid fa-fire text-orange-400"></i>}
                </button>
              ))}
            </div>
            {tone === ToneType.CUSTOM && (
              <input
                type="text"
                value={customTone}
                onChange={(e) => setCustomTone(e.target.value)}
                placeholder="描述您想要的独特语气風格..."
                className="w-full mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-indigo-500/10 outline-none font-medium text-slate-600"
              />
            )}
          </section>

          {/* Final CTA Group */}
          <div className="pt-4 flex gap-4">
             <button
                onClick={handleReset}
                className="btn-reset w-16 h-16 rounded-2xl flex items-center justify-center group shrink-0"
                title="清空当前输入"
              >
                <i className="fa-solid fa-trash-can text-lg group-hover:rotate-6 transition-transform"></i>
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`flex-1 py-4 rounded-2xl text-white font-black text-lg tracking-widest transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-4 ${
                  loading ? 'bg-slate-300' : 'aura-gradient hover:opacity-90'
                }`}
              >
                {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-signature"></i>}
                {result ? '再次升华策略' : '立即润色回复'}
              </button>
          </div>
          {error && <p className="text-rose-500 text-center font-bold text-sm bg-rose-50 p-3 rounded-xl border border-rose-100 animate-pulse">{error}</p>}
        </div>

        <div id="results-anchor" className="h-1"></div>

        {/* Results Experience */}
        {result && (
          <div className="space-y-20 animate-fade-in pb-40">
            
            {/* Psychological Insight */}
            {result.psychologicalWellnessNote && (
              <div className="bg-rose-50/50 p-10 rounded-[40px] border border-rose-100 flex flex-col md:flex-row gap-8 items-start">
                 <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-100">
                    <i className="fa-solid fa-heart-pulse text-xl"></i>
                 </div>
                 <div className="pt-2">
                    <h4 className="text-rose-800 font-black mb-3 text-sm uppercase tracking-[0.2em]">心灵场域洞察</h4>
                    <p className="text-rose-900/60 leading-relaxed italic text-sm font-medium">{result.psychologicalWellnessNote}</p>
                 </div>
              </div>
            )}

            {/* Tactical Plans */}
            <div className="space-y-12">
              {result.suggestions.map((opt, idx) => (
                <div 
                  key={opt.id || idx} 
                  className={`bg-white p-10 md:p-14 rounded-[56px] border-2 transition-all relative ${
                    selectedOptionId === (opt.id || idx.toString()) 
                    ? 'border-indigo-600 bg-indigo-50/5' 
                    : 'border-transparent card-premium'
                  }`}
                >
                  <div className="flex justify-between items-start mb-14">
                    <div className="px-4 py-1.5 rounded-full bg-indigo-600 text-white text-[9px] font-black tracking-[0.3em] uppercase">
                      Tactical Plan 0{idx + 1}
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleSelectOption(opt.id || idx.toString())}
                        className={`w-11 h-11 flex items-center justify-center rounded-2xl transition-all border ${selectedOptionId === (opt.id || idx.toString()) ? 'bg-amber-50 border-amber-200 text-amber-500' : 'bg-white border-slate-100 text-slate-200 hover:text-amber-400'}`}
                        title="标记为最终偏好方案"
                      >
                        <i className="fa-solid fa-star"></i>
                      </button>
                      <button 
                        onClick={() => copyToClipboard(opt.text)}
                        className="w-11 h-11 flex items-center justify-center bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all"
                      >
                        <i className="fa-solid fa-copy"></i>
                      </button>
                    </div>
                  </div>

                  <p className="text-3xl md:text-4xl text-slate-800 mb-14 font-extrabold leading-[1.25] tracking-tight">
                    {opt.text}
                  </p>

                  <div className="grid md:grid-cols-2 gap-10 mb-12 border-t border-slate-100 pt-12">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-indigo-500 font-black text-[10px] uppercase tracking-[0.25em]">
                        <i className="fa-solid fa-brain-circuit"></i> 心理脉络
                      </div>
                      <p className="text-slate-500 leading-relaxed text-sm font-medium">{opt.explanation}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sky-500 font-black text-[10px] uppercase tracking-[0.25em]">
                        <i className="fa-solid fa-chart-line-up"></i> 局势推演
                      </div>
                      <p className="text-sky-900/60 leading-relaxed text-sm italic font-medium">{opt.futureForecast}</p>
                    </div>
                  </div>

                  <div className="p-8 rounded-[32px] bg-indigo-50/30 border border-indigo-100 border-l-[6px] border-l-indigo-400">
                    <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3">Professional Citation • 经典论证</div>
                    <p className="text-sm font-serif italic leading-relaxed text-indigo-900/70">“{opt.classicCitation}”</p>
                  </div>

                  {selectedOptionId === (opt.id || idx.toString()) && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-5 py-1.5 rounded-full text-[10px] font-black shadow-lg shadow-amber-200 tracking-widest">
                      PREFERRED
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Master Strategy Section */}
            <div className="themed-glass p-12 md:p-16 rounded-[60px] text-center relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-5 blur-3xl group-hover:opacity-10 transition-opacity"></div>
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-10 flex items-center justify-center text-white text-xl shadow-lg border border-white/20">
                    <i className="fa-solid fa-chess-queen"></i>
                  </div>
                  <h3 className="text-white font-black text-xl mb-8 tracking-widest uppercase">大师之境：终极策略</h3>
                  <p className="text-white text-lg md:text-xl font-medium leading-relaxed italic max-w-2xl mx-auto drop-shadow-sm">
                    “{result.proTip}”
                  </p>
               </div>
            </div>

          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-100 py-16 text-center">
         <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-col items-center gap-4 mb-10">
              <div className="w-8 h-8 aura-gradient rounded-lg flex items-center justify-center text-white text-[10px] font-bold">
                <i className="fa-solid fa-signature"></i>
              </div>
              <span className="font-black text-indigo-950 tracking-[0.2em] uppercase text-xs">SocialSense</span>
            </div>
            <p className="text-slate-400 text-[10px] font-bold tracking-widest uppercase">© 2024 SocialSense AI • 让每一次回应都有回响</p>
         </div>
      </footer>

      </motion.div>

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
