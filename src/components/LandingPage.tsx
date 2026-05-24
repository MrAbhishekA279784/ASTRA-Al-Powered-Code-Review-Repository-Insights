import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { ArrowRight, Github, Sparkles, FileText, Code2, BarChart3, Shield, ChevronDown } from 'lucide-react';

function useTypewriter(text: string, speed = 50) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

function FadeInSection({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HeroSection({ onGetStarted }: { onGetStarted: () => void }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const { displayed, done } = useTypewriter('AI-Powered Code Intelligence', 45);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 -left-48 w-[500px] h-[500px] rounded-full bg-astra-purple-light/8 blur-[120px]" />
        <div className="absolute bottom-1/3 -right-48 w-[500px] h-[500px] rounded-full bg-astra-purple-light/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-astra-purple-light)_0%,_transparent_70%)] opacity-[0.03]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(var(--color-astra-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-astra-text) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 border border-astra-border bg-astra-elevated/80 backdrop-blur-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-astra-purple-light" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold font-sans text-astra-muted">v4.0 — Now Available</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-5xl md:text-7xl font-black tracking-tighter uppercase font-sans text-astra-text leading-[0.95] mb-4"
        >
          ASTRA.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="h-8 md:h-10 mb-6"
        >
          <span className="text-lg md:text-xl font-light italic font-serif text-astra-tertiary">
            {displayed}
            {!done && <span className="animate-pulse">|</span>}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-sm md:text-base font-sans text-astra-muted max-w-lg leading-relaxed mb-10"
        >
          Intelligent code review, automated documentation, and real-time insights
          powered by Gemini AI. Built for teams that ship quality software.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={onGetStarted}
            className="group relative px-8 py-4 bg-astra-text text-astra-elevated text-[11px] uppercase tracking-[0.2em] font-bold font-sans overflow-hidden transition-all hover:bg-astra-purple-light"
          >
            <span className="relative z-10 flex items-center gap-2">
              Launch ASTRA
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </button>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 border border-astra-border text-astra-text text-[11px] uppercase tracking-[0.2em] font-bold font-sans hover:bg-astra-hover transition-all"
          >
            View on GitHub
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex items-center gap-8 md:gap-12 mt-16"
        >
          {[
            { value: '10K+', label: 'Reviews' },
            { value: '99.9%', label: 'Uptime' },
            { value: '5K+', label: 'Repos' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="text-lg md:text-xl font-bold font-mono text-astra-text">{stat.value}</span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-astra-muted font-sans font-bold mt-1">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2">
            <span className="text-[8px] uppercase tracking-[0.3em] text-astra-tertiary font-sans font-bold">Scroll</span>
            <ChevronDown className="w-4 h-4 text-astra-tertiary" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Code2,
      title: 'AI Code Review',
      desc: 'Deep semantic analysis of pull requests with contextual understanding. Detects bugs, anti-patterns, and security vulnerabilities before they reach production.',
      gradient: 'from-astra-purple-light/20 to-transparent',
    },
    {
      icon: Github,
      title: 'GitHub Integration',
      desc: 'Seamless integration with your existing workflow. Analyze any public GitHub pull request with a single URL paste.',
      gradient: 'from-astra-purple-light/15 to-transparent',
    },
    {
      icon: BarChart3,
      title: 'Quality Metrics',
      desc: 'Comprehensive quality scoring across security, performance, maintainability, and readability with actionable recommendations.',
      gradient: 'from-astra-purple-light/10 to-transparent',
    },
    {
      icon: FileText,
      title: 'Auto Documentation',
      desc: 'Generate comprehensive documentation from code changes. Automatically creates README updates, API docs, and changelogs.',
      gradient: 'from-astra-purple-light/8 to-transparent',
    },
    {
      icon: Sparkles,
      title: 'AI Chat Context',
      desc: 'Conversational interface that understands your pull request context. Ask questions, get explanations, and explore code changes naturally.',
      gradient: 'from-astra-purple-light/12 to-transparent',
    },
    {
      icon: Shield,
      title: 'Security Analysis',
      desc: 'Proactive vulnerability detection with severity classification. Catch security issues early with detailed remediation guidance.',
      gradient: 'from-astra-purple-light/18 to-transparent',
    },
  ];

  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeInSection className="text-center mb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-astra-purple-light font-sans font-bold">Features</span>
          <h2 className="text-3xl md:text-4xl font-bold font-sans text-astra-text mt-4 tracking-tight">
            Everything you need for<br />elite code reviews
          </h2>
          <p className="text-sm text-astra-muted font-sans mt-4 max-w-md mx-auto leading-relaxed">
            From automated analysis to intelligent documentation — ASTRA brings AI-powered
            code intelligence to your development workflow.
          </p>
        </FadeInSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-astra-border">
          {features.map((feature, i) => (
            <div key={feature.title}><FadeInSection delay={i * 0.1} className="bg-astra-bg p-8 md:p-10 group relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className="w-10 h-10 border border-astra-border flex items-center justify-center mb-5 group-hover:border-astra-text transition-colors">
                  <feature.icon className="w-5 h-5 text-astra-text" strokeWidth={1.5} />
                </div>
                <h3 className="text-sm font-bold font-sans text-astra-text mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-[13px] font-sans text-astra-muted leading-relaxed">{feature.desc}</p>
              </div>
            </FadeInSection></div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IntegrationShowcase() {
  return (
    <section className="relative py-32 px-6 bg-astra-elevated border-y border-astra-border">
      <div className="max-w-5xl mx-auto">
        <FadeInSection className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-astra-purple-light font-sans font-bold">Integration</span>
            <h2 className="text-3xl md:text-4xl font-bold font-sans text-astra-text mt-4 tracking-tight">
              Paste a URL.<br />Get insights instantly.
            </h2>
            <p className="text-sm text-astra-muted font-sans mt-4 leading-relaxed">
              No complex setup. No configuration files. Just paste any public GitHub pull request URL
              and ASTRA&apos;s AI analyzes every line of code, providing comprehensive feedback in seconds.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {[
                'Automatic PR metadata extraction',
                'Comprehensive diff analysis',
                'File-level breakdown',
                'Severity-ranked issue detection',
                'Actionable remediation suggestions',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-astra-purple-light flex-shrink-0" />
                  <span className="text-[13px] font-sans text-astra-tertiary">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="border border-astra-border bg-astra-bg p-4 md:p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-8 bg-astra-hover border-b border-astra-border flex items-center px-4 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-astra-critical/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-astra-minor/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-astra-success/60" />
                <span className="ml-3 text-[8px] font-sans text-astra-muted uppercase tracking-wider font-bold">PR Preview</span>
              </div>
              <div className="mt-8 space-y-4">
                <div className="h-4 w-3/4 bg-astra-hover rounded" />
                <div className="h-3 w-1/2 bg-astra-hover rounded" />
                <div className="flex gap-2 mt-4">
                  <span className="px-2 py-0.5 text-[9px] font-bold font-mono bg-astra-diff-add text-astra-success">+124</span>
                  <span className="px-2 py-0.5 text-[9px] font-bold font-mono bg-astra-diff-del text-astra-critical">-37</span>
                  <span className="px-2 py-0.5 text-[9px] font-bold font-mono bg-astra-hover text-astra-muted">8 files</span>
                </div>
                <div className="border-l-2 border-astra-purple-light/30 pl-3 py-1">
                  <div className="h-2 w-full bg-astra-hover rounded mt-2" />
                  <div className="h-2 w-5/6 bg-astra-hover rounded mt-1.5" />
                  <div className="h-2 w-4/6 bg-astra-hover rounded mt-1.5" />
                </div>
                <div className="flex gap-2 pt-2 border-t border-astra-border">
                  {['Security', 'Perf', 'Quality'].map((tag) => (
                    <span key={tag} className="px-2 py-1 text-[8px] uppercase tracking-wider font-bold font-sans bg-astra-hover text-astra-muted">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

function MobileShowcase() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeInSection className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
          <div className="flex-1">
            <span className="text-[10px] uppercase tracking-[0.3em] text-astra-purple-light font-sans font-bold">Mobile</span>
            <h2 className="text-3xl md:text-4xl font-bold font-sans text-astra-text mt-4 tracking-tight">
              Review on the go.
            </h2>
            <p className="text-sm text-astra-muted font-sans mt-4 leading-relaxed">
              Full-featured mobile experience with bottom navigation, pull-to-refresh,
              and touch-optimized diff viewing. Stay on top of reviews wherever you are.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              {[
                'Responsive bottom tab navigation',
                'Touch-optimized code diff viewer',
                'Quick action shortcuts',
                'Real-time analysis status',
                'Activity feed & notifications',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-astra-purple-light flex-shrink-0" />
                  <span className="text-[13px] font-sans text-astra-tertiary">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="w-[260px] border-2 border-astra-border rounded-[32px] bg-astra-elevated overflow-hidden shadow-xl p-3">
              <div className="rounded-[24px] bg-[#FDFCFB] overflow-hidden">
                <div className="px-4 pt-6 pb-2 flex items-center justify-between">
                  <span className="text-[11px] font-bold font-sans text-[#1C1C1E] tracking-[0.15em]">ASTRA.</span>
                  <div className="w-6 h-6 rounded-full bg-[#EADDD7] flex items-center justify-center text-[10px] font-bold text-[#1C1C1E]">A</div>
                </div>
                <div className="px-4 pb-4">
                  <div className="h-5 w-3/4 bg-[#F0EFEB] rounded mt-2" />
                  <div className="h-3 w-1/2 bg-[#F0EFEB] rounded mt-2" />
                  <div className="mt-4 h-10 bg-[#F5F4F1] rounded-xl" />
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="h-16 bg-[#FAF9F6] rounded-xl border border-[#F0EFEB] p-2">
                        <div className="w-5 h-5 rounded-full bg-[#F3EFEA] mb-1" />
                        <div className="h-2 w-3/4 bg-[#F0EFEB] rounded" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-[#F0EFEB] px-8 py-3 flex justify-between items-center bg-white">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-5 h-5 rounded bg-[#1C1C1E]" />
                    <span className="text-[8px] font-sans text-[#1C1C1E] font-medium">Home</span>
                  </div>
                  <div className="w-[44px] h-[44px] rounded-full bg-[#B89C85] -mt-5 border-[3px] border-white" />
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-5 h-5 rounded bg-[#8E8E93]" />
                    <span className="text-[8px] font-sans text-[#8E8E93]">Activity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

function CtaSection({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section className="relative py-32 px-6 border-t border-astra-border bg-astra-elevated overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-astra-text) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-astra-purple-light/5 blur-[150px]" />

      <FadeInSection className="relative z-10 max-w-2xl mx-auto text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-astra-purple-light font-sans font-bold">Get Started</span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase font-sans text-astra-text mt-6 leading-[0.95]">
          Ready to ship<br />better code?
        </h2>
        <p className="text-sm text-astra-muted font-sans mt-6 max-w-sm mx-auto leading-relaxed">
          Join thousands of developers using ASTRA to review smarter, document faster, and ship with confidence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <button
            onClick={onGetStarted}
            className="px-8 py-4 bg-astra-text text-astra-elevated text-[11px] uppercase tracking-[0.2em] font-bold font-sans hover:bg-astra-purple-light transition-all"
          >
            Launch ASTRA
          </button>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 border border-astra-border text-astra-text text-[11px] uppercase tracking-[0.2em] font-bold font-sans hover:bg-astra-hover transition-all"
          >
            Learn More
          </button>
        </div>
      </FadeInSection>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-astra-border py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-black tracking-tighter uppercase font-sans text-astra-text">ASTRA.</h1>
          <span className="text-[9px] text-astra-muted font-sans">v4.0</span>
        </div>
        <div className="flex items-center gap-6">
          {['Docs', 'API', 'Status', 'GitHub'].map((link) => (
            <button key={link} className="text-[10px] uppercase tracking-widest font-sans font-bold text-astra-muted hover:text-astra-text transition-colors">
              {link}
            </button>
          ))}
        </div>
        <span className="text-[9px] text-astra-tertiary/60 font-sans">
          &copy; 2026 ASTRA. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

export function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="min-h-screen bg-astra-bg text-astra-text font-serif selection:bg-astra-purple-bg">
      <HeroSection onGetStarted={onGetStarted} />
      <FeaturesSection />
      <IntegrationShowcase />
      <MobileShowcase />
      <CtaSection onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}
