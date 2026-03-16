import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Journal from './pages/Journal';
import Science from './pages/Science';
import History from './pages/History';
import Settings from './components/Settings';
import BottomNav from './components/BottomNav';

export default function App() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#faf7f2] flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-[#faf7f2]/90 backdrop-blur-lg border-b border-[#e8e4de]">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-12">
            <NavLink
              to="/history"
              className="text-xs md:text-sm font-bold text-[#8a8680] hover:text-[#2d2a26]"
            >
              📅 History
            </NavLink>
            <span className="text-sm md:text-base font-extrabold text-[#2d2a26]">
              Brain Check — Dopamine Detox Coach
            </span>
            <button
              onClick={() => setShowSettings(true)}
              className="text-xs md:text-sm font-bold text-[#8a8680] hover:text-[#2d2a26]"
            >
              ⚙️
            </button>
          </div>
        </header>

        {/* Pages */}
        <main className="flex-1 flex justify-center">
          <div className="w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/science" element={<Science />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </div>
        </main>

        {/* Bottom Navigation (mobile-first) */}
        <div className="md:hidden">
          <BottomNav />
        </div>

        {/* Settings Modal */}
        {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      </div>
    </BrowserRouter>
  );
}
