import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import heroImage from '@/assets/hero-exam.jpg';
import logoImage from '@/assets/ksu-logo-tall.png';
import {
  Clock, Users, Trophy, BarChart3, CheckCircle,
  ArrowRight, Shield, Zap, Target, GraduationCap, FlaskConical,
  Atom, Calculator, Instagram, MessageCircle
} from 'lucide-react';
import AnimatedBackground from '@/components/layout/AnimatedBackground';

const features = [
  { icon: Clock, title: 'Real Exam Timing', desc: '150 Questions to be completed in 3 hours — exactly like the actual KEAM unified exam.' },
  { icon: Target, title: 'Authentic Pattern', desc: '150 MCQs total, +4 marks for correct, -1 for wrong. Same as CEE Kerala pattern.' },
  { icon: BarChart3, title: 'Detailed Analytics', desc: 'Subject-wise breakdown, question-level review, and performance tracking across attempts.' },
  { icon: Trophy, title: 'Live Leaderboard', desc: 'Compare your rank with other students. See where you stand statewide.' },
  { icon: Shield, title: 'Expert Questions', desc: 'Questions curated by experienced faculty covering the full KEAM syllabus.' },
  { icon: Zap, title: 'Instant Results', desc: 'Get your score, correct answers, and detailed solutions immediately after submission.' },
];

const subjects = [
  { icon: Atom, name: 'Physics', questions: 45, color: 'text-blue-600 bg-blue-50' },
  { icon: FlaskConical, name: 'Chemistry', questions: 30, color: 'text-emerald-600 bg-emerald-50' },
  { icon: Calculator, name: 'Mathematics', questions: 75, color: 'text-violet-600 bg-violet-50' },
];

const steps = [
  { step: '01', title: 'Create Account', desc: 'Sign up with your email and name in seconds.' },
  { step: '02', title: 'Choose Mock Test', desc: 'Pick from full-length KEAM unified mocks.' },
  { step: '03', title: 'Take the Test', desc: 'Experience the real KEAM interface with timer, question palette, and review marking.' },
  { step: '04', title: 'Review Results', desc: 'Analyze your performance with detailed solutions and subject breakdowns.' },
];



export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
      <div className="min-h-screen bg-transparent text-foreground selection:bg-primary/30 relative overflow-x-hidden">
        {/* Mesh Gradient Background Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-cyan-200/20 rounded-full blur-[100px] pointer-events-none animate-bounce" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-pink-200/10 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary/70 via-indigo-600/70 to-cyan-600/70 backdrop-blur-md text-white border-b border-white/10 shadow-lg">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="KSU GECT logo" className="w-9 h-9 object-contain brightness-0 invert" />
              <div>
                <span className="font-heading font-bold text-lg">KEAM 2026 Mock Test</span>
              <span className="text-xs text-white/70 ml-1 hidden sm:inline">by KSU GECT</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => navigate('/dashboard')} className="bg-white text-primary hover:bg-white/90">Go to Dashboard <ArrowRight className="w-4 h-4 ml-1" /></Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')} className="text-white hover:bg-white/10">Sign In</Button>
                <Button onClick={() => navigate('/auth')} className="bg-white text-primary hover:bg-white/90 border-none">Get Started</Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="relative">
          <div className="container py-20 lg:py-28 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-3 py-1">
                    <GraduationCap className="w-3 h-3 mr-1" /> KEAM 2026 Ready
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-heading font-bold text-slate-900 leading-tight">
                    Crack <span className="text-primary">KEAM</span> with
                    <br />Real Mock Tests
                  </h1>
                  <p className="mt-4 text-lg text-slate-600 max-w-lg">
                    Practice with exam-accurate mock tests modelled on the Kerala Engineering Architecture Medical entrance.
                    Unified Exam, full syllabus, real timing.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button variant="hero" size="lg" onClick={() => navigate('/auth')} className="text-base px-8">
                    Start Free Mock Test <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button variant="hero-outline" size="lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-base px-8">
                    Learn More
                  </Button>
                </div>
                <div className="flex flex-col sm:flex-row gap-6 text-slate-500 text-sm">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> 150 MCQs per test</div>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Instant Results</div>
                  </div>
                  <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6 mt-2 sm:mt-0">
                    <a 
                      href="https://chat.whatsapp.com/Genn0PvWpMX98KTRnYiM7y" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-2 hover:text-green-500 transition-all hover:scale-105"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp Group
                    </a>
                    <a 
                      href="https://www.instagram.com/ksu_gec?igsh=MXJ1eTBmZnd2dG1pZw==" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-2 hover:text-pink-500 transition-all hover:scale-105"
                    >
                      <Instagram className="w-4 h-4" /> @ksu_gec
                    </a>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary/20 rounded-2xl blur-2xl" />
                  <img
                    src={heroImage}
                    alt="Student taking KEAM exam"
                    className="relative rounded-2xl shadow-2xl w-full object-cover"
                    width={640}
                    height={480}
                  />
                  {/* Floating stats */}
                  <div className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-bold font-heading">10,000+</p>
                      <p className="text-xs text-muted-foreground">Students Enrolled</p>
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 bg-card rounded-xl shadow-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-bold font-heading">95%</p>
                      <p className="text-xs text-muted-foreground">Satisfaction Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Pattern */}
      <section className="py-16 relative z-10">
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] pointer-events-none" />
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold">KEAM Exam Pattern</h2>
            <p className="text-muted-foreground mt-2">Our mock tests follow the exact CEE Kerala pattern</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {subjects.map(s => (
              <Card key={s.name} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8 space-y-4">
                  <div className={`w-16 h-16 rounded-2xl ${s.color} flex items-center justify-center mx-auto`}>
                    <s.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-heading font-bold">{s.name}</h3>
                  <p className="text-3xl font-heading font-bold text-primary">{s.questions}</p>
                  <p className="text-sm text-muted-foreground">Questions</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 max-w-2xl mx-auto">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-heading font-bold">150</p>
                    <p className="text-xs text-muted-foreground">Total Questions</p>
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">600</p>
                    <p className="text-xs text-muted-foreground">Total Marks</p>
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">+4 / -1</p>
                    <p className="text-xs text-muted-foreground">Marking Scheme</p>
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold">3 hrs</p>
                    <p className="text-xs text-muted-foreground">Total Duration</p>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 relative z-10">
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold">Why Students Choose Us</h2>
            <p className="text-muted-foreground mt-2">Everything you need to ace the KEAM entrance</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Card key={i} className="hover:shadow-lg transition-all hover:-translate-y-1 duration-200">
                <CardContent className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <f.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-heading font-bold text-lg">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative z-10">
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px] pointer-events-none" />
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold">How It Works</h2>
            <p className="text-muted-foreground mt-2">Get started in 4 simple steps</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {steps.map((s, i) => (
              <div key={i} className="text-center space-y-3 relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-border" />
                )}
                <div className="w-16 h-16 rounded-full gradient-primary text-primary-foreground flex items-center justify-center mx-auto text-xl font-heading font-bold relative z-10">
                  {s.step}
                </div>
                <h3 className="font-heading font-bold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative z-10">
        <div className="container relative z-10">
          <Card className="bg-primary border-none shadow-xl overflow-hidden">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white">
                Ready to Crack KEAM?
              </h2>
              <p className="text-white/80 max-w-lg mx-auto">
                Join thousands of Kerala students preparing with our exam-accurate mock tests. Start your journey today.
              </p>
              <Button variant="hero" size="lg" onClick={() => navigate('/auth')} className="text-base px-10">
                Start Practicing Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 relative z-10 bg-gradient-to-r from-blue-900/80 via-blue-800/80 to-indigo-900/80 backdrop-blur-md text-white border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="KSU GECT logo" className="w-10 h-10 object-contain brightness-0 invert" />
            <div>
              <span className="font-heading font-bold text-xl block leading-none">KSU KEAM Mock Test 2026</span>
              <span className="text-xs text-white/60">Official Training Portal by KSU GECT</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right">
            <div className="flex items-center gap-6">
              <a 
                href="https://chat.whatsapp.com/Genn0PvWpMX98KTRnYiM7y" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 text-white/80 hover:text-white transition-all hover:scale-105"
                title="Join WhatsApp Group"
              >
                <MessageCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm font-bold">WhatsApp Community</span>
              </a>
              <a 
                href="https://www.instagram.com/ksu_gec?igsh=MXJ1eTBmZnd2dG1pZw==" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-2 text-white/80 hover:text-white transition-all hover:scale-105"
                title="Follow on Instagram"
              >
                <Instagram className="w-5 h-5 text-pink-400" />
                <span className="text-sm font-bold">@ksu_gec</span>
              </a>
            </div>
            <p className="text-xs text-white/40 max-w-xs">
              © {new Date().getFullYear()} KSU KEAM Mock Test. Organized by KSU GEC Thrissur. Practice platform for future engineers.
            </p>
          </div>
        </div>
      </footer>
      </div>
  );
}
