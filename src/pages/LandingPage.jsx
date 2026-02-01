import React, { useState, useEffect, useRef } from 'react';
import {
    ShieldCheck,
    Wallet,
    CreditCard,
    ArrowUpRight,
    Menu,
    X,
    ChevronRight,
    Sparkles,
    Phone,
    Terminal,
    Download,
    CheckCircle2,
    Instagram,
    Twitter,
    Linkedin,
    Facebook,
    Star,
    TrendingUp,
    Zap,
    Globe,
    Award,
    Users,
    Shield,
    Gift,


} from 'lucide-react';
import freame1 from '../assets/frame1.png';
import freme2 from '../assets/freme2.png';
import logo from '../assets/vsave.png';
import googleplay from "../assets/googlePlay.png"
import reward from "../assets/reward.png"
import { Link } from 'react-router-dom';
// Add custom CSS for animations
const styles = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0) rotate(3deg);
    }
    50% {
        transform: translateY(-20px) rotate(3deg);
    }
}

@keyframes shimmer {
    0% {
        background-position: -200% center;
    }
    100% {
        background-position: 200% center;
    }
}

@keyframes pulse-glow {
    0%, 100% {
        box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
    }
    50% {
        box-shadow: 0 0 40px rgba(16, 185, 129, 0.5);
    }
}

@keyframes slideInLeft {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
}

.animate-float {
    animation: float 6s ease-in-out infinite;
}

.animate-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    background-size: 200% 100%;
    animation: shimmer 3s infinite;
}

.animate-pulse-glow {
    animation: pulse-glow 2s infinite;
}

.animate-slide-in-left {
    animation: slideInLeft 0.8s ease-out forwards;
}

.animate-slide-in-right {
    animation: slideInRight 0.8s ease-out forwards;
}

.gradient-text {
    background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.feature-card-hover {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.feature-card-hover:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25);
}

.testimonial-card-hover {
    transition: all 0.3s ease;
}

.testimonial-card-hover:hover {
    transform: translateY(-5px);
}

.gradient-bg {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.gradient-border {
    border: 2px solid transparent;
    background: linear-gradient(white, white) padding-box,
                linear-gradient(135deg, #10b981 0%, #059669 100%) border-box;
}

.number-gradient {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.stagger-delay-1 { animation-delay: 0.1s; }
.stagger-delay-2 { animation-delay: 0.2s; }
.stagger-delay-3 { animation-delay: 0.3s; }
.stagger-delay-4 { animation-delay: 0.4s; }

.animate-blob {
    animation: blob 7s infinite;
}

@keyframes blob {
    0% {
        transform: translate(0px, 0px) scale(1);
    }
    33% {
        transform: translate(30px, -50px) scale(1.1);
    }
    66% {
        transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
        transform: translate(0px, 0px) scale(1);
    }
}
`;

// Intersection Observer Hook
const useInView = (options = {}) => {
    const [isInView, setIsInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsInView(entry.isIntersecting);
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [options]);

    return [ref, isInView];
};

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000, prefix = '', suffix = '' }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let start = 0;
                    const end = parseInt(value);
                    const increment = end / (duration / 16);

                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= end) {
                            setCount(end);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [value, duration, hasAnimated]);

    return (
        <span ref={ref} className="inline-block">
            {prefix}{count.toLocaleString()}{suffix}
        </span>
    );
};

// --- Sub-components ---

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            // Update active section
            const sections = ['hero', 'features', 'ai', 'how-it-works', 'testimonials', 'download'];
            const currentSection = sections.find(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    return rect.top <= 100 && rect.bottom >= 100;
                }
                return false;
            });
            if (currentSection) setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    return (
        <>
            <style>{styles}</style>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg py-3' : 'bg-transparent py-5'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="w-10 h-10  rounded-xl flex items-center justify-center text-white font-bold text-xl mr-2 shadow-lg animate-pulse-glow">
                                {/* <Shield className="w-6 h-6" /> */}
                                <img src={logo} alt="" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent tracking-tight">
                                Vsave
                            </span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <a
                                href="#features"
                                onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
                                className={`text-slate-600 hover:text-green-600 font-medium transition-all duration-300 relative group ${activeSection === 'features' ? 'text-green-600 font-semibold' : ''}`}
                            >
                                Features
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
                            </a>
                            <a
                                href="#how-it-works"
                                onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}
                                className={`text-slate-600 hover:text-green-600 font-medium transition-all duration-300 relative group ${activeSection === 'how-it-works' ? 'text-green-600 font-semibold' : ''}`}
                            >
                                How it works
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
                            </a>
                            <a
                                href="#testimonials"
                                onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}
                                className={`text-slate-600 hover:text-green-600 font-medium transition-all duration-300 relative group ${activeSection === 'testimonials' ? 'text-green-600 font-semibold' : ''}`}
                            >
                                Reviews
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
                            </a>
                            <button
                                onClick={() => scrollToSection('download')}
                                className="gradient-bg text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl hover:shadow-green-200 transition-all transform hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden group"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <Download size={18} />
                                    Download App
                                </span>
                                <div className="absolute inset-0 animate-shimmer"></div>
                            </button>
                        </div>

                        <div className="md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-slate-600 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                            >
                                {isOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top duration-300 shadow-lg">
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            <a
                                href="#features"
                                onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
                                className="block px-3 py-4 text-base font-medium text-slate-600 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
                            >
                                Features
                            </a>
                            <a
                                href="#how-it-works"
                                onClick={(e) => { e.preventDefault(); scrollToSection('how-it-works'); }}
                                className="block px-3 py-4 text-base font-medium text-slate-600 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
                            >
                                How it works
                            </a>
                            <a
                                href="#testimonials"
                                onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}
                                className="block px-3 py-4 text-base font-medium text-slate-600 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
                            >
                                Reviews
                            </a>
                            <button
                                onClick={() => scrollToSection('download')}
                                className="w-full gradient-bg text-white px-3 py-4 rounded-xl font-bold text-center hover:shadow-lg transition-shadow"
                            >
                                Download Now
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

const SmartAdvisor = () => {
    const [goal, setGoal] = useState('');
    const [amount, setAmount] = useState('');
    const [timeline, setTimeline] = useState('6 months');
    const [advice, setAdvice] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [ref, isInView] = useInView({ threshold: 0.1 });

    const generateMockAdvice = (goal, amount, timeline) => {
        const cleanAmount = amount.replace(/[^0-9.]/g, '');
        const amountNum = parseFloat(cleanAmount) || 0;
        const timelineMonths = parseInt(timeline) || 6;
        const monthlySavings = (amountNum / timelineMonths).toFixed(2);

        let specificAdvice = '';
        if (goal.toLowerCase().includes('vacation') || goal.toLowerCase().includes('holiday')) {
            specificAdvice = `For your ${goal}, consider opening a dedicated travel savings pot. Look for flight deals 3-4 months in advance and consider travel credit cards with reward points.`;
        } else if (goal.toLowerCase().includes('car') || goal.toLowerCase().includes('vehicle')) {
            specificAdvice = `For your ${goal}, research insurance costs and maintenance expenses. Consider setting aside an extra 10% for registration and documentation fees.`;
        } else if (goal.toLowerCase().includes('house') || goal.toLowerCase().includes('home')) {
            specificAdvice = `For your ${goal}, remember to factor in closing costs (2-5% of purchase price) and moving expenses. Consider a high-yield savings account for your down payment.`;
        } else if (goal.toLowerCase().includes('emergency')) {
            specificAdvice = `For your ${goal}, this is a smart financial move. Aim to save at least 3-6 months of living expenses. Keep these funds in a liquid, low-risk account.`;
        } else {
            specificAdvice = `For your ${goal}, consider setting up automatic transfers on payday. This "pay yourself first" approach ensures consistency.`;
        }

        return `Savings Plan for "${goal}"

🎯 Target: $${amountNum.toLocaleString()}
📅 Timeline: ${timeline}
💰 Monthly Savings Required: $${monthlySavings}

📈 **Action Plan:**
1. Set up automatic transfer of $${monthlySavings} to your Vsave savings account each month
2. Enable "Round-Up" feature to save spare change from daily transactions
3. Review your budget to identify $${(monthlySavings * 0.3).toFixed(2)} in monthly savings opportunities

💡 **Tips:**
${specificAdvice}

✅ **Next Steps:**
• Start your first transfer today, even if it's smaller than $${monthlySavings}
• Set a calendar reminder to review progress monthly
• Consider increasing your savings rate by 1% each quarter

You can achieve this goal by saving $${(monthlySavings / 30).toFixed(2)} per day!`;
    };

    const handleGetAdvice = async () => {
        if (!goal.trim() || !amount.trim()) {
            setError('Please fill in all fields');
            return;
        }

        const amountNum = parseFloat(amount.replace(/[^0-9.]/g, ''));
        if (isNaN(amountNum) || amountNum <= 0) {
            setError('Please enter a valid amount');
            return;
        }

        setLoading(true);
        setError('');
        setAdvice('');

        setTimeout(() => {
            try {
                const result = generateMockAdvice(goal, amount, timeline);
                setAdvice(result);
            } catch (err) {
                console.error('Failed to generate advice:', err);
                setError('Sorry, we encountered an error. Please try again.');
                setAdvice('');
            } finally {
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div
            ref={ref}
            className={`bg-white rounded-3xl p-8 lg:p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}
        >
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-sm">
                    <Sparkles className="text-green-600 w-7 h-7" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-900">V-Assistant: AI Savings Planner</h3>
                    <p className="text-sm text-slate-500 mt-1">Get personalized financial strategies</p>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">What are you saving for?</label>
                    <input
                        type="text"
                        placeholder="e.g. New Laptop, Vacation, Emergency Fund"
                        className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-3 focus:ring-green-500/30 focus:border-green-500 outline-none transition-all duration-300"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        disabled={loading}
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Target Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                            <input
                                type="text"
                                placeholder="2,000"
                                className="w-full pl-10 pr-5 py-3.5 rounded-xl border border-slate-200 focus:ring-3 focus:ring-green-500/30 focus:border-green-500 outline-none transition-all duration-300"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Timeline</label>
                        <select
                            className="w-full px-5 py-3.5 rounded-xl border border-slate-200 focus:ring-3 focus:ring-green-500/30 focus:border-green-500 outline-none transition-all duration-300 appearance-none bg-white"
                            value={timeline}
                            onChange={(e) => setTimeline(e.target.value)}
                            disabled={loading}
                        >
                            <option>3 months</option>
                            <option>6 months</option>
                            <option>12 months</option>
                            <option>24 months</option>
                        </select>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm animate-in fade-in">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleGetAdvice}
                    disabled={loading || !goal.trim() || !amount.trim()}
                    className="w-full gradient-bg text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-green-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        {loading ? (
                            <>
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating Plan...
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                Get My Strategy
                            </>
                        )}
                    </span>
                    <div className="absolute inset-0 animate-shimmer"></div>
                </button>
            </div>

            {advice && (
                <div className="mt-10 p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 animate-in fade-in slide-in-from-bottom-2 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="text-green-600 w-5 h-5" />
                        <h4 className="font-bold text-green-800">Your Personalized Plan</h4>
                    </div>
                    <div className="bg-white/80 rounded-xl p-6 border border-green-200/50">
                        <p className="text-slate-800 leading-relaxed whitespace-pre-line font-medium">{advice}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

const FAQAccordion = ({ item, index }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [ref, isInView] = useInView({ threshold: 0.1 });
    const itemId = item.question.replace(/\s+/g, '-').toLowerCase();

    return (
        <div
            ref={ref}
            className={`border border-slate-100 rounded-2xl mb-4 overflow-hidden transition-all duration-300 ${isInView ? `animate-fade-in-up stagger-delay-${(index % 4) + 1}` : 'opacity-0'}`}
        >
            <button
                className="w-full p-6 flex justify-between items-center text-left hover:bg-slate-50 transition-colors duration-300 group"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${itemId}`}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
                        <span className="font-bold text-lg">?</span>
                    </div>
                    <span className="text-lg font-semibold text-slate-800 group-hover:text-green-600 transition-colors">{item.question}</span>
                </div>
                <ChevronRight className={`transition-transform duration-300 ${isOpen ? 'rotate-90 text-green-600' : 'text-slate-400'}`} />
            </button>
            {isOpen && (
                <div
                    id={`faq-answer-${itemId}`}
                    className="px-6 pb-6 text-slate-600 leading-relaxed animate-in fade-in"
                >
                    {item.answer}
                </div>
            )}
        </div>
    );
};

// Stats Counter Component
const StatsCounter = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            {[
                { value: '50,000+', label: 'Active Users', icon: <Users className="w-6 h-6" /> },
                { value: '4.8', label: 'App Rating', icon: <Star className="w-6 h-6" /> },
                { value: '500K+', label: 'Downloads', icon: <Download className="w-6 h-6" /> },
                { value: '24/7', label: 'Support', icon: <Shield className="w-6 h-6" /> }
            ].map((stat, idx) => (
                <div key={idx} className={`animate-fade-in-up stagger-delay-${idx + 1} text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white`}>
                    <div className="flex justify-center mb-3">
                        <div className="p-3 bg-white/20 rounded-xl text-white">
                            {stat.icon}
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                        <AnimatedCounter value={stat.value.replace('+', '').replace('K', '000')} />
                        {stat.value.includes('+') && '+'}
                        {stat.value.includes('K') && 'K+'}
                    </div>
                    <div className="text-green-200 text-sm font-medium">{stat.label}</div>
                </div>
            ))}
        </div>
    );
};

// --- Main App Component ---

export default function LandingPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const features = [
        {
            id: 'save',
            title: 'Smart Savings',
            description: 'Automated savings with competitive interest rates. Watch your wealth grow effortlessly with intelligent round-ups.',
            icon: <Wallet className="w-8 h-8" />,
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            id: 'loan',
            title: 'Instant Loans',
            description: 'Need a boost? Get quick, low-interest credit approved in minutes without collateral or paperwork.',
            icon: <CreditCard className="w-8 h-8" />,
            gradient: 'from-emerald-500 to-teal-500'
        },
        {
            id: 'terminal ',
            title: 'Terminal Funding',
            description: 'Effortlessly fund and manage your lottery terminals through our seamless, secure portal.',
            icon: <Terminal className="w-8 h-8" />,
            gradient: 'from-teal-500 to-cyan-500'
        },
        {
            id: 'utility',
            title: 'Bills & Utilities',
            description: 'Buy airtime, data, and pay bills in seconds with zero hidden charges. Instant transactions guaranteed.',
            icon: <Phone className="w-8 h-8" />,
            gradient: 'from-cyan-500 to-blue-500'
        }
    ];

    const testimonials = [
        {
            id: 1,
            name: 'Johnson Adebayo',
            role: 'Small Business Owner',
            content: 'Vsave has completely changed how I manage my lotto shop. The terminal funding feature saved me hours every week!',
            avatar: 'https://picsum.photos/seed/sarah/100/100',
            rating: 5
        },
        {
            id: 2,
            name: 'Michael Adewale',
            role: 'Tech Professional',
            content: 'The smart savings advisor suggested a strategy that helped me save for my house down payment 4 months early. Incredible!',
            avatar: 'https://picsum.photos/seed/mike/100/100',
            rating: 5
        },
        {
            id: 3,
            name: 'Amara Okafor',
            role: 'Student',
            content: 'Buying data and airtime is so fast. I love the automated savings feature for my tuition - it makes saving effortless.',
            avatar: 'https://picsum.photos/seed/amara/100/100',
            rating: 5
        }
    ];

    const faqs = [
        {
            question: "Is Vsave safe and secure?",
            answer: "Yes. VSave is safe and secure. We use strong security measures to protect your account, funds, and personal information  Your account is protected with:1. Secure login and PIN authentication 2. Encrypted data protection3. Safe transaction monitoring Your funds and data security are our top priorit"

        },
        {
            question: "How long do loan approvals take?",
            answer: "Loan approvals on VSave are fast and efficient.Most loan requests are reviewed within a short time Fully verified users get faster approvals Delays may occur if required details are incomplete Make sure your profile is fully verified for quicker processing."
        },
        {
            question: "Are there any maintenance fees?",
            answer: "No. VSave has no hidden maintenance fees."
        },
        {
            question: "How does terminal funding work?",
            answer: "Terminal funding allows lottery agents to load money into their terminal for daily operations."
        }
    ];

    const socialLinks = [
        { icon: <Twitter size={20} />, label: 'Twitter', href: '#', color: 'hover:bg-blue-500' },
        { icon: <Instagram size={20} />, label: 'Instagram', href: '#', color: 'hover:bg-pink-500' },
        { icon: <Linkedin size={20} />, label: 'LinkedIn', href: '#', color: 'hover:bg-blue-700' },
        { icon: <Facebook size={20} />, label: 'Facebook', href: '#', color: 'hover:bg-blue-600' }
    ];

    if (!mounted) return null;

    return (
        <div className="min-h-screen overflow-hidden">
            <style>{styles}</style>
            <Navbar />

            {/* Hero Section */}
            <section id="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute top-10 right-1/4 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/3 left-10 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm text-green-700 px-6 py-3 rounded-full font-semibold text-sm mb-8 border border-green-100 shadow-sm animate-fade-in-up">
                                <ShieldCheck size={20} />
                                <span>Bank-Grade Security • Instant Transfers • 24/7 Support</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-8 animate-fade-in-up">
                                Your Finances, <br />
                                <span className="gradient-text">Unified & Intelligent</span>
                            </h1>

                            <p className="text-xl text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up stagger-delay-1">
                                Save smarter, borrow instantly, and manage your lottery terminals with Vsave. The only fintech platform that grows with your ambitions.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up stagger-delay-2">
                                <button
                                    onClick={() => document.getElementById('download').scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full sm:w-auto gradient-bg text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-green-300 transition-all flex items-center justify-center gap-3 shadow-xl group"
                                >
                                    <Download size={22} />
                                    <span>Get Started Free</span>
                                    <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                                    className="w-full sm:w-auto bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-3 border border-slate-200 shadow-sm hover:shadow-md"
                                >
                                    <span>Explore Features</span>
                                    <ArrowUpRight size={22} />
                                </button>
                            </div>

                            <div className="mt-16 flex items-center justify-center lg:justify-start space-x-6 animate-fade-in-up stagger-delay-3">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="relative group">
                                            <img
                                                className="w-12 h-12 rounded-full border-3 border-white shadow-lg group-hover:scale-110 transition-transform"
                                                src={`https://picsum.photos/seed/user${i}/100/100`}
                                                alt={`User ${i}`}
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 rounded-full border-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-slate-600">Trusted by</div>
                                    <div className="text-lg font-bold text-slate-900">
                                        <AnimatedCounter value="50000" duration={3000} suffix="+" /> users worldwide
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative animate-fade-in-up stagger-delay-4">
                            <div className="relative">
                                <div className="absolute -top-6 -right-6 w-72 h-72 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-[4rem] blur-xl animate-pulse"></div>

                                <div className="flex items-center justify-center gap-8 relative z-10">
                                    <div className="animate-float ">
                                        <img
                                            src={freame1}
                                            alt="Vsave App Interface 1"
                                            className="rounded-[2.5rem] shadow-2xl border-8 border-white w-[260px] transform rotate-3"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="animate-bounce mt-16" style={{ animationDelay: '1s' }}>
                                        <img
                                            src={freme2}
                                            alt="Vsave App Interface 2"
                                            className="rounded-[2.5rem] shadow-2xl border-8 border-white w-[260px] transform -rotate-3"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>

                                {/* Floating Cards */}
                                {/* <div className=" top-1/4 -right-10 md:-right-6 bg-white p-5 rounded-2xl shadow-2xl border border-slate-100 animate-slide-in-right hover:scale-105 transition-transform">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center text-green-600">
                                            <TrendingUp size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 font-medium">Daily Interest</div>
                                            <div className="text-lg font-bold text-slate-900">1%</div>
                                        </div>
                                    </div>
                                </div> */}

                                <div className="absolute bottom-1/4 -left-4 md:-left-6 bg-white p-5 rounded-2xl shadow-2xl border border-slate-100 animate-slide-in-left hover:scale-105 transition-transform">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center text-green-600">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <div>
                                            <div className="text-xs text-slate-500 font-medium">Loan Approved</div>
                                            <div className="text-lg font-bold text-slate-900">$5,000.00</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <div className="py-12 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 border-y border-green-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '50M+', label: 'Transactions', icon: <Globe className="w-6 h-6" /> },
                            { value: '99.9%', label: 'Uptime', icon: <Shield className="w-6 h-6" /> },
                            { value: '4.8★', label: 'Rating', icon: <Award className="w-6 h-6" /> },
                            { value: '150+', label: 'Countries', icon: <Globe className="w-6 h-6" /> }
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center animate-fade-in-up stagger-delay-${idx + 1}">
                                <div className="flex justify-center mb-3">
                                    <div className="p-3 bg-white rounded-xl shadow-sm text-green-600">
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-slate-900 mb-1 number-gradient">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Sparkles size={16} />
                            <span>POWERFUL FEATURES</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything you need for financial success</h2>
                        <p className="text-xl text-slate-600">Designed for simplicity, built for performance. All your financial tools in one powerful platform.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => (
                            <div
                                key={feature.id}
                                className={`feature-card-hover bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:border-green-200 animate-fade-in-up stagger-delay-${idx + 1}`}
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg text-white`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed mb-6">{feature.description}</p>
                                {/* <button className="text-green-600 font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all duration-300">
                                    Learn more
                                    <ArrowUpRight size={16} />
                                </button> */}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Section */}
            <section id="ai" className="py-24 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                <Gift size={50} />
                                <span>Rewards</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-8">Intelligent finance at your fingertips, with rewards to match.</h2>
                            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                                Refer friends to VSave and earn ₦500 for each successful referral.
                            </p>
                            <ul className="space-y-5 mb-10">
                                {['Fund vsave wallet', 'Create savings plan', 'Complete savings circle', 'Fund vsave wallet'].map((item, idx) => (
                                    <li key={idx} className="flex items-center space-x-4 text-lg font-medium text-slate-800">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            {/* <button className="gradient-bg text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-xl hover:shadow-green-200 transition-all">
                                Try V-Assistant Free
                            </button> */}
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-8 relative z-10">
                                <div className="animate-float">
                                    <img
                                        src={reward}
                                        alt="Vsave App Interface 1"
                                        className="rounded-[2.5rem] shadow-2xl border-8 border-white w-[260px] transform rotate-3"
                                        loading="lazy"
                                    />
                                </div>

                            </div>

                            {/* <SmartAdvisor /> */}
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="how-it-works" className="py-24 bg-green-700 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <ArrowUpRight size={16} />
                            <span>GET STARTED IN MINUTES</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl text-white font-bold mb-6">Start your journey in 3 simple steps</h2>
                        <p className="text-xl text-white">Joining Vsave is easy, secure, and takes less than 2 minutes.</p>
                    </div>

                    <div className="relative">
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1   via-emerald-100 to-teal-100 -z-0"></div>

                        <div className="grid lg:grid-cols-3 gap-12 relative z-10">
                            {[
                                { step: '01', title: 'Download & Sign Up', text: 'Get Vsave on iOS or Android. Create your account with just your phone number and email.', icon: <Download className="w-6 h-6" /> },
                                { step: '02', title: 'Verify & Secure', text: 'Quick BVN verification with bank-grade security. Your data is always protected.', icon: <Shield className="w-6 h-6" /> },
                                { step: '03', title: 'Start Growing', text: 'Fund your wallet, start saving automatically,', icon: <TrendingUp className="w-6 h-6" /> }
                            ].map((item, idx) => (
                                <div key={idx} className="text-center animate-fade-in-up stagger-delay-${idx + 1}">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-green-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-2xl shadow-green-200 border-4 border-white">
                                            {item.step}
                                        </div>
                                        <div className="absolute top-0 right-0 w-10 h-10 bg-white rounded-full border-4 border-slate-50 flex items-center justify-center text-green-600">
                                            {item.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                                    <p className="text-white px-4">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 bg-gradient-to-b from-green-100 to-green-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <Star size={16} />
                            <span>TRUSTED BY THOUSANDS</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">What our users are saying</h2>
                        <p className="text-xl text-slate-600">Join over 50,000 users who have transformed their financial lives with Vsave.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, idx) => (
                            <div
                                key={testimonial.id}
                                className={`testimonial-card-hover bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative animate-fade-in-up stagger-delay-${idx + 1}`}
                            >
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-green-50 to-emerald-50 text-green-600 rounded-2xl flex items-center justify-center font-bold text-2xl italic">"</div>
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-slate-700 mb-8 leading-relaxed italic">"{testimonial.content}"</p>
                                <div className="flex items-center">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-white shadow"
                                        loading="lazy"
                                    />
                                    <div>
                                        <div className="font-bold text-slate-900">{testimonial.name}</div>
                                        <div className="text-sm text-slate-500">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Download Section */}
            <section id="download" className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 gradient-bg -z-10"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="gradient-border backdrop-blur-sm rounded-[3rem] p-12 lg:p-16 text-center text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-black"></div>

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8">Ready to transform your finances?</h2>
                            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
                                Join thousands who are already building wealth with Vsave. Download now and get your first month free.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                                <button
                                    className="bg-white text-green-700 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all flex items-center gap-3 w-full sm:w-auto shadow-xl hover:scale-105 duration-300 group"
                                    aria-label="Download on App Store"
                                >
                                    <div className="p-2  rounded-lg group-hover:bg-white-800 transition-colors">
                                        {/* <img
                                            src={googleplay}
                                            className="w-5 h-5 filter invert"
                                            alt="Apple"
                                            loading="lazy"
                                        /> */}
                                        <div>
                                            Click here
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <div className="text-lg">Download</div>
                                        <div className="text-xs text-slate-500">Download on android device</div>

                                    </div>
                                </button>
                                {/* <button
                                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all flex items-center gap-3 w-full sm:w-auto shadow-xl border border-white/10 hover:scale-105 duration-300 group"
                                    aria-label="Download on Google Play Store"
                                >
                                    <div className="p-2 bg-white rounded-lg">
                                        <img
                                            src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Play_Store_badge_EN.svg"
                                            className="w-5 h-5"
                                            alt="Google Play Store"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-xs text-slate-300">Get it on</div>
                                        <div className="text-lg">Google Play</div>
                                    </div>
                                </button> */}
                            </div>

                            <StatsCounter />
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <ShieldCheck size={16} />
                            <span>GOT QUESTIONS?</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
                        <p className="text-xl text-slate-600">Everything you need to know about Vsave. Can't find an answer? Contact our support team.</p>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <FAQAccordion key={i} item={faq} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-1 justify-center">
                            <div className="flex items-center text-white mb-6 justify-center mr-11">
                                <Link to="/login">
                                    <div className="w-20 h-20 rounded-xl flex items-center justify-center font-bold mr-3 shadow-lg">
                                        <img src={logo} alt="" />
                                    </div>
                                </Link>

                                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Vsave</span>
                            </div>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                The modern way to save, borrow, and grow your wealth. Built for ambitious individuals and businesses.
                            </p>
                            <div className="flex space-x-3">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className={`w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:text-white transition-all duration-300 ${social.color}`}
                                        aria-label={`Follow us on ${social.label}`}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Product</h4>
                            <ul className="space-y-4">
                                {['Smart Savings', 'Instant Loans', 'Terminal Funding', 'Airtime purchase', 'Data purchase', 'Rewards'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-green-400 transition-colors duration-300 flex items-center gap-2">
                                            {/* <ChevronRight className="w-3 h-3" /> */}
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Company</h4>
                            <ul className="space-y-4">
                                {['About Us', 'Careers', 'Blog', 'Press', 'Partners', 'Privacy Policy'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-green-400 transition-colors duration-300 flex items-center gap-2">
                                            <ChevronRight className="w-3 h-3" />
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-widest">Support</h4>
                            <ul className="space-y-4">
                                {['Help Center', 'Security', 'Contact Us', 'System Status', 'Documentation', 'Community'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="hover:text-green-400 transition-colors duration-300 flex items-center gap-2">
                                            <ChevronRight className="w-3 h-3" />
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center">
                        <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} Vsave Technologies Ltd. All rights reserved.</p>
                        <div className="flex space-x-6">
                            <a href="#" className="hover:text-slate-300 transition-colors hover:underline">Terms of Service</a>
                            <a href="#" className="hover:text-slate-300 transition-colors hover:underline">Cookie Policy</a>
                            <a href="#" className="hover:text-slate-300 transition-colors hover:underline">GDPR</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
