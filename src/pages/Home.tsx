import { useState, useCallback, useMemo } from 'react';
import BrainCharacter from '../components/BrainCharacter';
import HealthBar from '../components/HealthBar';
import RuleToggle from '../components/RuleToggle';
import BrainIntelCard from '../components/BrainIntelCard';
import AiMessage from '../components/AiMessage';
import StreakCard from '../components/StreakCard';
import { RULES } from '../constants';
import { loadData, getTodayLog, saveTodayLog, calculateHealthScore, getCurrentStreak, getDayNumber } from '../store';
import type { RuleKey } from '../types';

export default function Home() {
  const [data, setData] = useState(loadData);
  const [todayLog, setTodayLog] = useState(() => getTodayLog(data));
  const [showShareCard, setShowShareCard] = useState(false);

  const streak = getCurrentStreak(data);
  const dayNumber = getDayNumber(data);

  const effectiveHealthScore = useMemo(
    () => calculateHealthScore(todayLog.rules, streak),
    [todayLog.rules, streak]
  );

  const handleToggle = useCallback(
    (key: RuleKey) => {
      const updated = {
        ...todayLog,
        rules: { ...todayLog.rules, [key]: !todayLog.rules[key] },
      };
      const healthScore = calculateHealthScore(updated.rules, streak);
      const updatedWithScore = { ...updated, healthScore };
      setTodayLog(updatedWithScore);
      const newData = saveTodayLog(data, updatedWithScore);
      setData(newData);
    },
    [todayLog, data, streak]
  );
  const rulesHeld = Object.values(todayLog.rules).filter(Boolean).length;

  return (
    <div className="px-4 pt-6 pb-24 max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center md:text-left md:flex md:items-baseline md:justify-between md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#2d2a26]">Brain Check</h1>
          <p className="text-sm md:text-base text-[#8a8680] font-semibold">
            Day {dayNumber} · Dopamine Detox
          </p>
        </div>
        <p className="mt-2 md:mt-0 text-xs md:text-sm text-[#8a8680] max-w-sm md:text-right">
          Each check-in is another rep for your prefrontal cortex. Keep stacking days — your brain
          literally rewires.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] md:items-start">
        <div className="space-y-5">
          {/* Brain Character + Health */}
          <div className="flex flex-col items-center md:flex-row md:items-center md:gap-6">
            <div className="flex justify-center md:justify-start">
              <BrainCharacter healthScore={effectiveHealthScore} size={200} />
            </div>
            <div className="w-full md:w-auto md:flex-1 mt-4 md:mt-0">
              <HealthBar score={effectiveHealthScore} />
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-[#e8e4de] shadow-sm">
            <div>
              <div className="text-sm text-[#8a8680] font-semibold">Current Streak</div>
              <div className="text-3xl font-extrabold text-[#2d2a26]">
                {streak} <span className="text-base font-bold text-[#8a8680]">days</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-[#8a8680] font-semibold">Rules Held Today</div>
              <div className="text-3xl font-extrabold text-[#5ecc8b]">
                {rulesHeld}
                <span className="text-base font-bold text-[#8a8680]">/{RULES.length}</span>
              </div>
            </div>
          </div>

          {/* AI Coach */}
          <AiMessage
            data={data}
            todayLog={{ ...todayLog, healthScore: effectiveHealthScore }}
            streak={streak}
            onMessageSaved={(msg) => {
              const updated = { ...todayLog, healthScore: effectiveHealthScore, aiMessage: msg };
              setTodayLog(updated);
              saveTodayLog(data, updated);
            }}
          />
        </div>

        <div className="space-y-5">
          {/* Daily Check-in */}
          <div className="bg-white rounded-2xl p-5 border border-[#e8e4de] shadow-sm">
            <h2 className="text-lg font-bold text-[#2d2a26] mb-3">Today's Check-in</h2>
            <p className="text-xs text-[#8a8680] mb-3">
              Tick off the rules you held today. These small wins compound into a calmer, sharper brain.
            </p>
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1 hide-scrollbar">
              {RULES.map((rule, index) => (
                <RuleToggle
                  key={rule.key}
                  rule={rule}
                  checked={todayLog.rules[rule.key]}
                  onToggle={() => handleToggle(rule.key)}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Brain Intel */}
          <BrainIntelCard dayNumber={dayNumber} />

          {/* Share Card Toggle */}
          <div className="space-y-3">
            <button
              onClick={() => setShowShareCard(!showShareCard)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#5ecc8b] to-[#4ab87a] text-white font-bold text-sm shadow-sm hover:shadow-md transition-shadow"
            >
              {showShareCard ? 'Hide' : '📸 Share'} Streak Card
            </button>

            {showShareCard && (
              <div className="animate-slide-up">
                <StreakCard
                  streak={streak}
                  healthScore={effectiveHealthScore}
                  dayNumber={dayNumber}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
