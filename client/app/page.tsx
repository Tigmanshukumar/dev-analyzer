'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/dashboard/${username.trim()}`);
    }
  };

  return (
    <>
      {/* TopNavBar */}
      <nav className="bg-[#0a0e14]/80 backdrop-blur-lg dark:bg-[#0a0e14]/80 docked full-width top-0 sticky z-50 bg-[#0e141c] border-b border-[#3c495b]/15 shadow-none">
        <div className="flex justify-between items-center w-full px-6 py-3 mx-auto max-w-7xl">
          <div className="flex items-center gap-8">
            <span className="text-lg font-bold tracking-tighter text-[#58a6ff] uppercase font-headline">
              Dev Personality Analyzer
            </span>
            <div className="hidden md:flex items-center gap-6">
              <a className="text-[#58a6ff] border-b border-[#58a6ff] pb-1 font-headline text-sm tracking-tight active:scale-[0.98] duration-150" href="#">Dashboard</a>
              <a className="text-[#9facc1] hover:text-[#58a6ff] transition-colors font-headline text-sm tracking-tight active:scale-[0.98] duration-150" href="#">Compare</a>
              <a className="text-[#9facc1] hover:text-[#58a6ff] transition-colors font-headline text-sm tracking-tight active:scale-[0.98] duration-150" href="#">Intelligence</a>
              <a className="text-[#9facc1] hover:text-[#58a6ff] transition-colors font-headline text-sm tracking-tight active:scale-[0.98] duration-150" href="#">Docs</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-[#9facc1] hover:bg-[#1e2d41]/40 rounded-md transition-all active:scale-[0.98]">
              <span className="material-symbols-outlined">terminal</span>
            </button>
            <button className="p-2 text-[#9facc1] hover:bg-[#1e2d41]/40 rounded-md transition-all active:scale-[0.98]">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </div>
      </nav>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-48 px-6 overflow-hidden">
          {/* Background Code Texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mono-text text-[10px] leading-relaxed select-none overflow-hidden whitespace-pre">
            {`function analyze(profile) {
                  const traits = ['efficiency', 'collaborative', 'architect', 'explorer'];
                  return traits.map(t => fetchScore(profile, t));
                }
                // git log --graph --oneline --all
                // * 8f3c1a2 Refactor analysis engine
                // * 4d2e5b6 Add personality mapping
                // * a1b2c3d Initial terminal commit`}
          </div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight mb-6 text-on-surface">
              Decode your <span className="text-primary">developer DNA</span>.
            </h1>
            <p className="font-body text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-12">
              Synthesize repository patterns, commit frequencies, and language clusters into a definitive professional biography.
            </p>
            {/* Input Group */}
            <form onSubmit={handleAnalyze} className="max-w-xl mx-auto flex flex-col md:flex-row gap-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-lg">alternate_email</span>
                </div>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface py-4 pl-12 pr-4 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary/50 outline-none mono-text transition-all placeholder:text-on-surface-variant/40"
                  placeholder="GitHub Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <button type="submit" className="bg-primary text-on-primary font-headline font-bold px-8 py-4 rounded-lg hover:bg-primary-fixed-dim active:scale-95 transition-all flex items-center justify-center gap-2">
                Analyze Profile
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              </button>
            </form>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-on-surface-variant/60 mono-text text-sm">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span>API Verified</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant/60 mono-text text-sm">
                <span className="material-symbols-outlined text-sm">lock</span>
                <span>Privacy First</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant/60 mono-text text-sm">
                <span className="material-symbols-outlined text-sm">history</span>
                <span>Historical Data</span>
              </div>
            </div>
          </div>
        </section>
        {/* Bento Analysis Preview */}
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Large Card */}
            <div className="md:col-span-8 bg-surface-container-low rounded-xl p-8 flex flex-col justify-between group hover:bg-surface-bright transition-all">
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="mono-text text-primary text-sm tracking-widest uppercase">System.Insights</span>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">monitoring</span>
                </div>
                <h3 className="font-headline text-3xl font-bold mb-4">Frequency Analysis</h3>
                <p className="text-on-surface-variant max-w-md">Our algorithm detects semantic nuances in your commit messages to categorize your thinking style: Logical, Experimental, or Maintenance-focused.</p>
              </div>
              <div className="mt-12 h-40 bg-surface-container-lowest/50 rounded-lg flex items-end justify-between p-6 gap-2">
                <div className="w-full bg-primary/20 h-1/2 rounded-t-sm"></div>
                <div className="w-full bg-primary/40 h-3/4 rounded-t-sm"></div>
                <div className="w-full bg-primary/30 h-1/3 rounded-t-sm"></div>
                <div className="w-full bg-primary/60 h-2/3 rounded-t-sm"></div>
                <div className="w-full bg-primary/80 h-full rounded-t-sm"></div>
                <div className="w-full bg-primary/50 h-3/5 rounded-t-sm"></div>
                <div className="w-full bg-primary/40 h-4/5 rounded-t-sm"></div>
              </div>
            </div>
            {/* Small Tall Card */}
            <div className="md:col-span-4 bg-surface-container-high rounded-xl p-8 flex flex-col justify-between border border-outline-variant/5">
              <div>
                <span className="material-symbols-outlined text-primary text-3xl mb-6">code_blocks</span>
                <h3 className="font-headline text-2xl font-bold mb-3">Language Graph</h3>
                <p className="text-on-surface-variant text-sm">Beyond raw SLOC, we analyze depth of library usage and structural patterns across 20+ languages.</p>
              </div>
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between mono-text text-[11px]">
                  <span>Rust / Systems</span>
                  <span className="text-primary">82%</span>
                </div>
                <div className="w-full h-1 bg-surface-container-lowest">
                  <div className="h-full bg-primary w-[82%]"></div>
                </div>
                <div className="flex items-center justify-between mono-text text-[11px]">
                  <span>TypeScript</span>
                  <span className="text-on-surface-variant">45%</span>
                </div>
                <div className="w-full h-1 bg-surface-container-lowest">
                  <div className="h-full bg-on-surface-variant w-[45%]"></div>
                </div>
              </div>
            </div>
            {/* Three Small Square Cards */}
            <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 hover:bg-surface-bright transition-all border border-outline-variant/5">
              <span className="material-symbols-outlined text-tertiary mb-4">hub</span>
              <h4 className="font-headline font-bold text-xl mb-2">Network Influence</h4>
              <p className="text-on-surface-variant text-sm">Measure your reach within the open-source ecosystem and contributor graphs.</p>
            </div>
            <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 hover:bg-surface-bright transition-all border border-outline-variant/5">
              <span className="material-symbols-outlined text-tertiary mb-4">history_edu</span>
              <h4 className="font-headline font-bold text-xl mb-2">Technical Persona</h4>
              <p className="text-on-surface-variant text-sm">Generate a customized "Profile Shield" based on your unique development habits.</p>
            </div>
            <div className="md:col-span-4 bg-surface-container-low rounded-xl p-6 hover:bg-surface-bright transition-all border border-outline-variant/5">
              <span className="material-symbols-outlined text-tertiary mb-4">compare_arrows</span>
              <h4 className="font-headline font-bold text-xl mb-2">Benchmarking</h4>
              <p className="text-on-surface-variant text-sm">Compare your metrics against the global average for specific tech stacks.</p>
            </div>
          </div>
        </section>
        {/* Stats Section (Asymmetric) */}
        <section className="max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-16 border-t border-outline-variant/10">
          <div className="w-full md:w-1/2">
            <div className="mono-text text-primary text-sm mb-4">/METRICS/GLOBAL_DATA</div>
            <h2 className="font-headline text-4xl font-bold mb-6">Built for the modern technical architect.</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
              We process millions of repositories to define the standard of excellence. Our dataset is refreshed every 24 hours to ensure your personality profile evolves as fast as your code.
            </p>
            <div className="flex gap-12">
              <div>
                <div className="mono-text text-3xl font-bold text-on-surface">1.2M+</div>
                <div className="text-on-surface-variant text-xs uppercase tracking-widest mt-1">Analyzed Profiles</div>
              </div>
              <div>
                <div className="mono-text text-3xl font-bold text-on-surface">450ms</div>
                <div className="text-on-surface-variant text-xs uppercase tracking-widest mt-1">Avg Latency</div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative">
            <div className="bg-surface-container-highest rounded-xl p-8 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 mb-6 border-b border-outline-variant/10 pb-4">
                <div className="w-3 h-3 rounded-full bg-error/40"></div>
                <div className="w-3 h-3 rounded-full bg-tertiary/40"></div>
                <div className="w-3 h-3 rounded-full bg-primary/40"></div>
                <div className="ml-4 mono-text text-[10px] text-on-surface-variant/50">analyser_core_v1.sh</div>
              </div>
              <div className="mono-text text-xs space-y-2 text-on-surface-variant">
                <p className="text-primary-fixed-dim">&gt; GET /api/v1/user/torvalds</p>
                <p>&gt; Fetching public events...</p>
                <p>&gt; Processing 4,821 commits across 12 repos</p>
                <p className="text-tertiary">&gt; Analyzing semantic intent in commit messages</p>
                <p>&gt; Pattern matched: "Direct / Authoritative"</p>
                <p>&gt; Language mix: C (92%), Shell (8%)</p>
                <p className="text-primary">&gt; Status: PERSO_MAP_COMPLETE</p>
                <div className="mt-6 pt-6 border-t border-outline-variant/10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-bright rounded-md flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">fingerprint</span>
                  </div>
                  <div>
                    <div className="text-on-surface font-bold">"The Architect"</div>
                    <div className="text-[10px] uppercase">Identity Class A-1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-[#0a0e14] dark:bg-[#0a0e14] w-full py-12 border-t border-[#3c495b]/10">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 max-w-7xl mx-auto gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-body text-[11px] uppercase tracking-widest text-[#9facc1]/50">
              © 2024 Synthesized Terminal v1.0.4
            </span>
          </div>
          <div className="flex gap-8">
            <a className="font-body text-[11px] uppercase tracking-widest text-[#9facc1]/50 hover:text-[#58a6ff] transition-opacity transition-all ease-in-out" href="#">System Status</a>
            <a className="font-body text-[11px] uppercase tracking-widest text-[#9facc1]/50 hover:text-[#58a6ff] transition-opacity transition-all ease-in-out" href="#">Security</a>
            <a className="font-body text-[11px] uppercase tracking-widest text-[#9facc1]/50 hover:text-[#58a6ff] transition-opacity transition-all ease-in-out" href="#">Open Source</a>
            <a className="font-body text-[11px] uppercase tracking-widest text-[#9facc1]/50 hover:text-[#58a6ff] transition-opacity transition-all ease-in-out" href="#">API Docs</a>
          </div>
          <div className="flex items-center gap-4 text-[#9facc1]/30">
            <span className="material-symbols-outlined text-sm">cloud</span>
            <span className="material-symbols-outlined text-sm">terminal</span>
          </div>
        </div>
      </footer>
    </>
  );
}
