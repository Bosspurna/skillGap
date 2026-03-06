import React, { useState } from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { analyzeCareer, recommendCourses, type CourseRecommendation } from './services/aiService';
import { Brain, Target, Star, AlertCircle, CheckCircle2, ChevronRight, Loader2, LogOut, LayoutDashboard, FileText, User, ArrowLeft, Clock, Trophy, BookOpen, ExternalLink, Github, Mail, Award, Zap, ShieldCheck, Sparkles, X, PartyPopper, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, YAxis } from 'recharts';
import { cn } from './utils/cn';
import { SKILLS_OPTIONS, INTERESTS_OPTIONS, CAREER_OPTIONS } from './constants';

// --- Components ---

const CongratulationModal = ({ 
  isOpen, 
  onClose, 
  stepTitle, 
  progressPercent,
  badgeName,
  badgeIcon: BadgeIcon
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  stepTitle: string,
  progressPercent: number,
  badgeName: string,
  badgeIcon: any
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative glass-card p-10 max-w-md w-full text-center space-y-8 overflow-hidden"
          >
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent-blue/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-purple/20 rounded-full blur-3xl animate-pulse" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/20 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="relative flex justify-center">
              <motion.div
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", damping: 12, delay: 0.2 }}
                className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.4)]"
              >
                <BadgeIcon size={48} className="text-white" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles size={64} className="text-yellow-400/50" />
              </motion.div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-white">Outstanding!</h2>
              <p className="text-white/60">You've successfully mastered:</p>
              <p className="text-xl font-bold text-accent-blue">{stepTitle}</p>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40 font-medium uppercase tracking-widest">New Achievement</span>
                <span className="text-yellow-400 font-bold">{badgeName}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${isNaN(progressPercent) ? 0 : progressPercent}%` }}
                  className="h-full bg-gradient-to-r from-accent-blue to-accent-purple"
                />
              </div>
              <p className="text-sm text-white/60">
                You are now <span className="text-white font-bold">ahead of {Math.floor(progressPercent * 0.8 + 15)}%</span> of other candidates on this path.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full gradient-button py-4 font-bold active:scale-[0.98] transition-transform"
            >
              Continue Journey
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const RoadmapCompletionModal = ({ 
  isOpen, 
  onClose, 
  userName 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  userName: string 
}) => {
  const [extraInterests, setExtraInterests] = useState('');
  const [courses, setCourses] = useState<CourseRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!extraInterests.trim()) return;
    setLoading(true);
    try {
      const results = await recommendCourses(extraInterests);
      setCourses(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative glass-card p-10 max-w-2xl w-full space-y-8 my-auto"
          >
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-accent-blue/20 rounded-full flex items-center justify-center text-accent-blue animate-bounce">
                  <PartyPopper size={40} />
                </div>
              </div>
              <h2 className="text-4xl font-black tracking-tight">Congratulations, {userName}!</h2>
              <p className="text-white/60 text-lg">
                You've completed every step of your career roadmap. You are now fully prepared for your dream journey!
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/40 uppercase tracking-widest">Want to learn more?</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="text" 
                      placeholder="Enter any extra interests (e.g., AI Ethics, Web3, Public Speaking)..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:border-accent-blue transition-all"
                      value={extraInterests}
                      onChange={(e) => setExtraInterests(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <button 
                    onClick={handleSearch}
                    disabled={loading || !extraInterests.trim()}
                    className="gradient-button px-8 font-bold disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : 'Explore'}
                  </button>
                </div>
              </div>

              {courses.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Recommended Courses</h3>
                  <div className="grid gap-4">
                    {courses.map((course, i) => (
                      <a 
                        key={i}
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass-card p-4 hover:bg-white/5 transition-all group flex justify-between items-center"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-accent-blue uppercase tracking-tighter">{course.provider}</span>
                            <h4 className="font-bold group-hover:text-accent-blue transition-colors">{course.title}</h4>
                          </div>
                          <p className="text-xs text-white/40 line-clamp-1">{course.description}</p>
                        </div>
                        <ExternalLink size={16} className="text-white/20 group-hover:text-white transition-colors" />
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full py-4 text-white/40 hover:text-white transition-colors font-medium"
            >
              Close Dashboard
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const TagSelector = ({ 
  options, 
  selected, 
  onToggle, 
  customValue, 
  onCustomChange, 
  label 
}: { 
  options: string[], 
  selected: string[], 
  onToggle: (val: string) => void,
  customValue?: string,
  onCustomChange?: (val: string) => void,
  label: string
}) => (
  <div className="space-y-3">
    <label className="text-sm font-medium text-white/60">{label}</label>
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onToggle(opt)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
            selected.includes(opt) 
              ? "bg-accent-blue/20 border-accent-blue text-accent-blue" 
              : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
    {onCustomChange && (
      <input
        type="text"
        placeholder={`Other ${label.toLowerCase()} (comma separated)...`}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-accent-blue transition-all"
        value={customValue}
        onChange={e => onCustomChange(e.target.value)}
      />
    )}
  </div>
);

const Navbar = () => {
  const { user, logout } = useAuthStore();
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-background/50 backdrop-blur-md border-bottom border-white/5">
      <Link to="/" className="text-2xl font-bold gradient-text">CareerDNA</Link>
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link to="/dashboard" className="text-sm font-medium hover:text-accent-blue transition-colors flex items-center gap-2">
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <button onClick={logout} className="text-sm font-medium hover:text-red-400 transition-colors flex items-center gap-2">
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium hover:text-accent-blue transition-colors">Sign In</Link>
            <Link to="/signup" className="gradient-button px-5 py-2 text-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="py-12 px-6 border-t border-white/5 text-center text-white/40 text-sm">
    <p>© 2026 SkillGap (CareerDNA). AI-Powered Career Intelligence.</p>
  </footer>
);

// --- Pages ---

export const LandingPage = () => (
  <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-8"
    >
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
        Decode Your <span className="gradient-text">Career DNA</span>
      </h1>
      <p className="text-xl text-white/60 max-w-2xl mx-auto">
        Identify skill gaps, analyze compatibility, and get a personalized AI roadmap to your dream job.
      </p>
      <div className="flex justify-center gap-4">
        <Link to="/signup" className="gradient-button px-8 py-4 text-lg font-bold">Sign Up</Link>
        <Link to="/login" className="px-8 py-4 text-lg font-bold border border-white/10 rounded-xl hover:bg-white/5 transition-all">Sign In</Link>
      </div>
    </motion.div>

    <div className="grid md:grid-cols-3 gap-8 mt-32">
      {[
        { icon: Brain, title: "AI Analysis", desc: "Deep learning algorithms analyze your profile against industry standards." },
        { icon: Target, title: "Skill Mapping", desc: "Visualize exactly where you stand and what you need to learn." },
        { icon: CheckCircle2, title: "Smart Roadmap", desc: "Step-by-step actionable tasks to bridge your career gaps." }
      ].map((f, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-8 space-y-4"
        >
          <f.icon className="text-accent-blue" size={32} />
          <h3 className="text-xl font-bold">{f.title}</h3>
          <p className="text-white/50">{f.desc}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

export const AuthPage = ({ mode: initialMode }: { mode: 'login' | 'signup' }) => {
  const [view, setView] = useState<'selection' | 'form'>('selection');
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  React.useEffect(() => {
    setMode(initialMode);
    setView('selection');
  }, [initialMode]);

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const { token, user } = event.data.data;
        setAuth(user, token);
        navigate('/dashboard');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setAuth, navigate]);

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const res = await fetch(`/api/auth/url?provider=${provider}`);
      const { url } = await res.json();
      window.open(url, 'oauth_popup', 'width=600,height=700');
    } catch (err) {
      console.error(err);
      setError('Failed to initiate social login');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      
      if (mode === 'login') {
        setAuth(data.user, data.token);
        navigate('/dashboard');
      } else {
        setMode('login');
        setView('form');
        setError('Account created! Please log in.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#020617]">
      <AnimatePresence mode="wait">
        {view === 'selection' ? (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-sm space-y-12 text-center"
          >
            <div className="space-y-2 flex flex-col items-center">
              <h1 className="text-6xl font-black text-white tracking-tighter flex items-baseline gap-1">
                Let's<span className="w-4 h-4 bg-yellow-400 rounded-full inline-block mb-1" />
              </h1>
            </div>

            <div className="space-y-3 w-full">
              <button 
                onClick={() => handleSocialLogin('google')}
                className="w-full bg-white text-black font-bold py-4 rounded-full flex items-center justify-center hover:bg-white/90 transition-all active:scale-[0.98]"
              >
                <GoogleIcon /> Continue with Google
              </button>

              <button 
                onClick={() => handleSocialLogin('github')}
                className="w-full bg-[#24292F] text-white font-bold py-4 rounded-full flex items-center justify-center hover:bg-[#24292F]/90 transition-all active:scale-[0.98]"
              >
                <Github className="w-5 h-5 mr-2" /> Continue with GitHub
              </button>

              <div className="pt-4 space-y-3">
                <button 
                  onClick={() => {
                    setMode('signup');
                    setView('form');
                  }}
                  className="w-full bg-[#D1D5DB] text-black font-bold py-4 rounded-full hover:bg-[#E5E7EB] transition-all active:scale-[0.98]"
                >
                  Sign up
                </button>

                <button 
                  onClick={() => {
                    setMode('login');
                    setView('form');
                  }}
                  className="w-full border-2 border-white/20 text-white font-bold py-4 rounded-full hover:bg-white/5 transition-all active:scale-[0.98]"
                >
                  Sign In
                </button>
              </div>
            </div>

            <p className="text-white/30 text-xs">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-10 w-full max-w-md space-y-8"
          >
            <button 
              onClick={() => setView('selection')}
              className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <div className="text-center">
              <h2 className="text-3xl font-bold">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="text-white/50 mt-2">{mode === 'login' ? 'Enter your credentials to continue' : 'Join CareerDNA today'}</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-white/40 ml-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue transition-all"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/40 ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue transition-all"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/40 ml-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue transition-all"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <button 
                disabled={loading}
                className="w-full gradient-button py-4 font-bold flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (mode === 'login' ? 'Sign In' : 'Sign Up')}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0f172a] px-2 text-white/30">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => handleSocialLogin('google')} 
                  className="flex items-center justify-center py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <GoogleIcon />
                </button>
                <button 
                  type="button"
                  onClick={() => handleSocialLogin('github')} 
                  className="flex items-center justify-center py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <Github size={20} />
                </button>
              </div>
            </form>

            <p className="text-center text-sm text-white/40">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-accent-blue hover:underline font-bold"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AssessmentPage = () => {
  const [assessmentMode, setAssessmentMode] = useState<'manual' | 'resume' | null>(null);
  const [manualStep, setManualStep] = useState(1);
  const [data, setData] = useState({
    skills: [] as string[],
    interests: [] as string[],
    personality: 'Analytical',
    cgpa: 3.5,
    targetCareer: ''
  });
  const [customSkills, setCustomSkills] = useState('');
  const [customInterests, setCustomInterests] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const totalManualSteps = 4;

  const toggleItem = (field: 'skills' | 'interests', val: string) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].includes(val)
        ? prev[field].filter(i => i !== val)
        : [...prev[field], val]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const clearFile = () => {
    setFileName('');
    setResumeText('');
  };

  const nextStep = () => {
    if (manualStep < totalManualSteps) setManualStep(manualStep + 1);
  };

  const prevStep = () => {
    if (manualStep > 1) setManualStep(manualStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const skillsArr = [...data.skills, ...customSkills.split(',').map(s => s.trim()).filter(Boolean)];
      const interestsArr = [...data.interests, ...customInterests.split(',').map(i => i.trim()).filter(Boolean)];
      
      const analysis = await analyzeCareer({
        ...data,
        skills: skillsArr,
        interests: interestsArr,
        resumeText
      });

      await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...data,
          skills: skillsArr,
          interests: interestsArr,
          ...analysis
        })
      });

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!assessmentMode ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid md:grid-cols-2 gap-8"
          >
            <button
              onClick={() => {
                setAssessmentMode('manual');
                setManualStep(1);
              }}
              className="glass-card p-12 flex flex-col items-center text-center space-y-6 hover:border-accent-blue/50 transition-all group"
            >
              <div className="p-6 bg-accent-blue/10 rounded-2xl text-accent-blue group-hover:scale-110 transition-transform">
                <User size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Manual Assessment</h3>
                <p className="text-white/40 text-sm">Enter your skills, interests, and academic details manually for a precise profile.</p>
              </div>
              <div className="flex items-center gap-2 text-accent-blue font-semibold">
                Start Manual <ChevronRight size={20} />
              </div>
            </button>

            <button
              onClick={() => setAssessmentMode('resume')}
              className="glass-card p-12 flex flex-col items-center text-center space-y-6 hover:border-accent-purple/50 transition-all group"
            >
              <div className="p-6 bg-accent-purple/10 rounded-2xl text-accent-purple group-hover:scale-110 transition-transform">
                <FileText size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">By Resume</h3>
                <p className="text-white/40 text-sm">Upload your resume and let our AI extract your professional DNA automatically.</p>
              </div>
              <div className="flex items-center gap-2 text-accent-purple font-semibold">
                Upload Resume <ChevronRight size={20} />
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-10 space-y-8"
          >
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setAssessmentMode(null)}
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm"
              >
                <ArrowLeft size={16} /> Back to selection
              </button>
              
              {assessmentMode === 'manual' && (
                <div className="flex items-center gap-4">
                  <div className="text-xs font-medium text-white/40 uppercase tracking-widest">
                    Step {manualStep} of {totalManualSteps}
                  </div>
                  <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-accent-blue"
                      initial={{ width: 0 }}
                      animate={{ width: `${(manualStep / totalManualSteps) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl",
                assessmentMode === 'resume' ? "bg-accent-purple/20 text-accent-purple" : "bg-accent-blue/20 text-accent-blue"
              )}>
                {assessmentMode === 'resume' ? <FileText size={32} /> : <Brain size={32} />}
              </div>
              <div>
                <h2 className="text-3xl font-bold">
                  {assessmentMode === 'resume' ? 'Resume Analysis' : 'Manual Assessment'}
                </h2>
                <p className="text-white/50">
                  {assessmentMode === 'resume' ? 'Upload your resume for AI-powered career matching' : 'Tell us about your skills and interests'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {assessmentMode === 'resume' ? (
                  <motion.div
                    key="resume-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-white/60 block">Resume Content</label>
                      
                      {fileName ? (
                        <div className="flex items-center justify-between p-4 bg-accent-blue/5 border border-accent-blue/20 rounded-xl">
                          <div className="flex items-center gap-3">
                            <FileText className="text-accent-blue" />
                            <div>
                              <p className="text-sm font-medium text-white">{fileName}</p>
                              <p className="text-xs text-white/40">File uploaded successfully</p>
                            </div>
                          </div>
                          <button 
                            type="button"
                            onClick={clearFile}
                            className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
                          >
                            Remove File
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-all">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Brain className="w-8 h-8 mb-3 text-accent-blue" />
                                <p className="mb-2 text-sm text-white/60">
                                  <span className="font-semibold">Click to upload resume</span> or drag and drop
                                </p>
                                <p className="text-xs text-white/40">Text files (.txt) supported</p>
                              </div>
                              <input type="file" className="hidden" accept=".txt" onChange={handleFileChange} />
                            </label>
                          </div>
                          
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="w-full border-t border-white/5"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                              <span className="px-2 bg-card text-white/40 uppercase tracking-widest text-[10px]">OR PASTE TEXT</span>
                            </div>
                          </div>

                          <textarea
                            placeholder="Paste your resume content here in English..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue transition-all h-32 text-sm"
                            value={resumeText}
                            onChange={e => setResumeText(e.target.value)}
                            required={!fileName}
                          />
                        </>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/60">Target Career Path</label>
                      <select
                        className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue transition-all text-white"
                        value={data.targetCareer}
                        onChange={e => setData({ ...data, targetCareer: e.target.value })}
                        required
                      >
                        <option value="" disabled className="bg-slate-900">Select a target career...</option>
                        {CAREER_OPTIONS.map(opt => (
                          <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                        ))}
                        <option value="Other" className="bg-slate-900">Other (Type below)</option>
                      </select>
                      {data.targetCareer === 'Other' && (
                        <input
                          type="text"
                          placeholder="Enter your custom target career..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:border-accent-blue transition-all"
                          onChange={e => setData({ ...data, targetCareer: e.target.value })}
                          required
                        />
                      )}
                    </div>

                    <button 
                      disabled={loading}
                      className="w-full gradient-button py-4 flex justify-center items-center gap-2 text-lg"
                    >
                      {loading ? <Loader2 className="animate-spin" size={24} /> : 'Generate My Career DNA'}
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`manual-step-${manualStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    {manualStep === 1 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/60">Target Career Path</label>
                          <select
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue transition-all text-white"
                            value={data.targetCareer}
                            onChange={e => setData({ ...data, targetCareer: e.target.value })}
                            required
                          >
                            <option value="" disabled className="bg-slate-900">Select a target career...</option>
                            {CAREER_OPTIONS.map(opt => (
                              <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                            ))}
                            <option value="Other" className="bg-slate-900">Other (Type below)</option>
                          </select>
                          {data.targetCareer === 'Other' && (
                            <input
                              type="text"
                              placeholder="Enter your custom target career..."
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mt-2 focus:outline-none focus:border-accent-blue transition-all"
                              onChange={e => setData({ ...data, targetCareer: e.target.value })}
                              required
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {manualStep === 2 && (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/60">Academic Performance (CGPA out of 10)</label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue transition-all"
                            value={data.cgpa}
                            onChange={e => setData({ ...data, cgpa: parseFloat(e.target.value) })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/60">Personality Profile</label>
                          <select
                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-blue transition-all text-white"
                            value={data.personality}
                            onChange={e => setData({ ...data, personality: e.target.value })}
                          >
                            <option value="Analytical" className="bg-slate-900">Analytical</option>
                            <option value="Creative" className="bg-slate-900">Creative</option>
                            <option value="Leader" className="bg-slate-900">Leader</option>
                            <option value="Empathetic" className="bg-slate-900">Empathetic</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {manualStep === 3 && (
                      <TagSelector
                        label="Core Skills"
                        options={SKILLS_OPTIONS}
                        selected={data.skills}
                        onToggle={(val) => toggleItem('skills', val)}
                        customValue={customSkills}
                        onCustomChange={setCustomSkills}
                      />
                    )}

                    {manualStep === 4 && (
                      <TagSelector
                        label="Career Interests"
                        options={INTERESTS_OPTIONS}
                        selected={data.interests}
                        onToggle={(val) => toggleItem('interests', val)}
                        customValue={customInterests}
                        onCustomChange={setCustomInterests}
                      />
                    )}

                    <div className="flex gap-4 pt-4">
                      {manualStep > 1 && (
                        <button
                          type="button"
                          onClick={prevStep}
                          className="flex-1 px-6 py-4 border border-white/10 rounded-xl hover:bg-white/5 transition-all font-semibold"
                        >
                          Previous
                        </button>
                      )}
                      {manualStep < totalManualSteps ? (
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={manualStep === 1 && !data.targetCareer}
                          className="flex-1 gradient-button py-4 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next Step
                        </button>
                      ) : (
                        <button 
                          disabled={loading}
                          className="flex-1 gradient-button py-4 flex justify-center items-center gap-2 text-lg"
                        >
                          {loading ? <Loader2 className="animate-spin" size={24} /> : 'Generate My Career DNA'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Dashboard = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showRoadmapComplete, setShowRoadmapComplete] = useState(false);
  const [lastCompletedStep, setLastCompletedStep] = useState<any>(null);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/career/result?userId=${user.id}`);
      const data = await res.json();
      if (res.ok) setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const toggleStep = async (index: number) => {
    if (!user || !result) return;
    const isCompleting = !result.roadmap[index].completed;
    
    try {
      const res = await fetch('/api/assessment/roadmap/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, stepIndex: index })
      });
      if (res.ok) {
        const data = await res.json();
        setResult({ ...result, roadmap: data.roadmap });
        
        if (isCompleting) {
          setLastCompletedStep(result.roadmap[index]);
          
          // Check if all steps are now completed
          const updatedRoadmap = data.roadmap;
          const allCompleted = updatedRoadmap.every((s: any) => s.completed);
          
          if (allCompleted) {
            setShowRoadmapComplete(true);
          } else {
            setShowCelebration(true);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-accent-blue" size={48} />
    </div>
  );

  if (!result) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <h2 className="text-3xl font-bold">No Assessment Found</h2>
      <p className="text-white/50">Start your first assessment to see results.</p>
      <Link to="/assessment" className="gradient-button px-8 py-3">Start Assessment</Link>
    </div>
  );

  const completedCount = result.roadmap?.filter((s: any) => s.completed).length || 0;
  const totalSteps = result.roadmap?.length || 1;
  const progressPercent = (completedCount / totalSteps) * 100;

  const score = typeof result.score === 'number' ? result.score : 0;
  const compatibilityData = [
    { name: 'Match', value: score },
    { name: 'Gap', value: Math.max(0, 100 - score) }
  ];

  const COLORS = ['#3B82F6', '#1E293B'];

  const getBadgeInfo = (step: any) => {
    if (!step) return { name: 'Novice', icon: Zap };
    if (step.level === 'Beginner') return { name: 'Foundation Builder', icon: ShieldCheck };
    if (step.level === 'Intermediate') return { name: 'Skill Master', icon: Award };
    return { name: 'Elite Expert', icon: Trophy };
  };

  const badgeInfo = getBadgeInfo(lastCompletedStep);

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12">
      <CongratulationModal 
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        stepTitle={lastCompletedStep?.title || ''}
        progressPercent={progressPercent}
        badgeName={badgeInfo.name}
        badgeIcon={badgeInfo.icon}
      />
      <RoadmapCompletionModal
        isOpen={showRoadmapComplete}
        onClose={() => setShowRoadmapComplete(false)}
        userName={user?.name || 'Explorer'}
      />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
          <p className="text-white/50 mt-2">Personalized career insights for <span className="text-accent-blue font-semibold">{result.career}</span></p>
        </div>
        <div className="flex gap-4">
          <Link to="/assessment" className="px-6 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-sm font-medium">Retake Assessment</Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Compatibility Score */}
        <div className="glass-card p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-blue to-accent-purple" />
          <h3 className="text-lg font-bold mb-8 text-white/70 uppercase tracking-widest">Compatibility Score</h3>
          <div className="relative w-56 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={compatibilityData}
                  innerRadius={75}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  startAngle={90}
                  endAngle={450}
                >
                  {compatibilityData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-black text-white"
              >
                {result.score}%
              </motion.span>
              <span className="text-xs text-white/40 uppercase tracking-widest mt-1">Match Rate</span>
            </div>
          </div>
          <p className="mt-8 text-sm text-white/40 leading-relaxed">
            Your profile shows a strong alignment with the core requirements of this role.
          </p>
        </div>

        {/* Skill Gaps Bar Chart */}
        <div className="lg:col-span-2 glass-card p-8 flex flex-col">
          <h3 className="text-lg font-bold mb-8 text-white/70 uppercase tracking-widest">Skill Gap Analysis</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.gaps} layout="vertical" margin={{ left: 40, right: 40 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0F172A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar 
                  dataKey="gapLevel" 
                  fill="#3B82F6" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-white/30 mt-4 italic">* Higher bar indicates a larger gap to bridge.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Achievements & Badges */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white/70 uppercase tracking-widest">Achievements</h3>
          <div className="glass-card p-6 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {result.roadmap.filter((s: any) => s.completed).map((step: any, i: number) => {
                const info = getBadgeInfo(step);
                return (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center gap-2"
                    title={info.name}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400/20 to-amber-600/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
                      <info.icon size={20} />
                    </div>
                    <span className="text-[8px] uppercase tracking-tighter text-white/40 text-center font-bold">{info.name}</span>
                  </motion.div>
                );
              })}
              {result.roadmap.filter((s: any) => s.completed).length === 0 && (
                <div className="col-span-3 py-8 text-center space-y-2">
                  <Award className="mx-auto text-white/10" size={32} />
                  <p className="text-xs text-white/20">Complete steps to earn badges</p>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-white/40">Overall Progress</span>
                <span className="text-accent-blue font-bold">{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${isNaN(progressPercent) ? 0 : progressPercent}%` }}
                  className="h-full bg-accent-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                />
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white/70 uppercase tracking-widest pt-4">Key Strengths</h3>
          <div className="grid gap-4">
            {result.strengths.map((strength: string, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5 flex items-start gap-4 border-l-4 border-emerald-500/50"
              >
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                  <Trophy size={20} />
                </div>
                <p className="text-sm font-medium text-white/80 leading-snug">{strength}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Roadmap Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-white/70 uppercase tracking-widest">Personalized Learning Path</h3>
            <div className="text-xs font-mono text-accent-blue bg-accent-blue/10 px-3 py-1 rounded-full">
              {completedCount} / {result.roadmap.length} COMPLETED
            </div>
          </div>

          <div className="space-y-0 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
            {result.roadmap.map((step: any, i: number) => (
              <div key={i} className="flex gap-6 relative group pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => toggleStep(i)}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-500 border-2",
                      step.completed 
                        ? "bg-accent-blue border-accent-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                        : "bg-slate-900 border-white/10 text-white/40 hover:border-accent-blue/50"
                    )}
                  >
                    {step.completed ? <CheckCircle2 size={20} /> : <span className="text-sm font-bold">{i + 1}</span>}
                  </button>
                </div>
                
                <div className={cn(
                  "flex-1 glass-card p-6 transition-all duration-300",
                  step.completed ? "opacity-60 grayscale-[0.5]" : "hover:border-white/20"
                )}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h4 className="font-bold text-lg flex items-center gap-2">
                        {step.title}
                        {step.completed && <span className="text-[10px] bg-accent-blue/20 text-accent-blue px-2 py-0.5 rounded uppercase tracking-tighter">Done</span>}
                      </h4>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-xs text-white/40">
                          <Clock size={14} /> {step.duration}
                        </span>
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider",
                          step.level === 'Beginner' ? "bg-emerald-500/10 text-emerald-500" :
                          step.level === 'Intermediate' ? "bg-amber-500/10 text-amber-500" :
                          "bg-rose-500/10 text-rose-500"
                        )}>
                          {step.level}
                        </span>
                      </div>
                    </div>
                    {step.link && (
                      <a 
                        href={step.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-bold text-accent-blue hover:text-white transition-colors bg-accent-blue/10 px-4 py-2 rounded-lg group/link"
                      >
                        Start Learning <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={step.completed}
                      onChange={() => toggleStep(i)}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-accent-blue focus:ring-accent-blue focus:ring-offset-slate-900"
                    />
                    <span className="text-xs text-white/40">Mark as completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen bg-background selection:bg-accent-blue/30">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
