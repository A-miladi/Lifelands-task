"use client";

import { useCallback, useRef, useState } from "react";
import {
  analyzeClicks,
  analyzeIntervals,
  type ClickPoint,
  type IntervalStats,
  type SpatialStats,
} from "@/lib/bot-detection";
import Link from "next/link";

const COINS_TARGET = 10;
const MAX_HISTORY = 12;

type ClickRecord = { x: number; y: number; t: number };

type Snapshot = {
  intervals: number[];
  timing: IntervalStats;
  spatial: SpatialStats;
};

const INITIAL: Snapshot = {
  intervals: [],
  timing: {
    mean: 0,
    stdDev: 0,
    sampleCount: 0,
    isSuspicious: false,
    reason: null,
  },
  spatial: {
    centerX: 0,
    centerY: 0,
    stdDevX: 0,
    stdDevY: 0,
    avgDistanceFromCenter: 0,
    sampleCount: 0,
    isSuspicious: false,
    reason: null,
  },
};
function ArrowRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 5 5 12 12 19" />
    </svg>
  );
}

type Award = "coin" | "blocked" | null;

export function HamsterChallenge() {
  const [coins, setCoins] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [snapshot, setSnapshot] = useState<Snapshot>(INITIAL);
  const [award, setAward] = useState<Award>(null);

  const clicksRef = useRef(0);
  const recordsRef = useRef<ClickRecord[]>([]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const rec: ClickRecord = {
      x: e.clientX - cx,
      y: e.clientY - cy,
      t: performance.now(),
    };

    const next = [...recordsRef.current, rec].slice(-MAX_HISTORY);
    recordsRef.current = next;

    const intervals: number[] = [];
    for (let i = 1; i < next.length; i++) {
      intervals.push(next[i]!.t - next[i - 1]!.t);
    }

    const points: ClickPoint[] = next.map((r) => ({ x: r.x, y: r.y }));
    const timing = analyzeIntervals(intervals);
    const spatial = analyzeClicks(points);
    const suspicious = timing.isSuspicious || spatial.isSuspicious;

    setSnapshot({ intervals, timing, spatial });

    const nextClicks = clicksRef.current + 1;
    clicksRef.current = nextClicks;
    setClicks(nextClicks);

    if (nextClicks % COINS_TARGET === 0) {
      if (suspicious) {
        setAward("blocked");
      } else {
        setCoins((c) => c + 1);
        setAward("coin");
      }
    } else {
      setAward(null);
    }
  }, []);

  const reset = () => {
    clicksRef.current = 0;
    recordsRef.current = [];
    setCoins(0);
    setClicks(0);
    setSnapshot(INITIAL);
    setAward(null);
  };

  const progress = clicks % COINS_TARGET;
  const remaining = progress === 0 ? COINS_TARGET : COINS_TARGET - progress;

  return (
    <div className="min-h-screen bg-app py-10">
      <div className="mx-auto w-full max-w-3xl px-4">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
              چالش همستر
            </h1>
            <p className="text-xs font-medium text-gray-500">
              Tab Tab To End — تشخیص کاربر ربات
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 h-10 shadow-sm">
              <CoinIcon className="h-6 w-6" />
              <span className="text-xl font-bold tabular-nums text-amber-700">
                {coins}
              </span>
            </div>
            <Link
              href="/"
              aria-label="بازگشت به صفحه اصلی"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
            >
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </header>

        <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-[var(--shadow-card)]">
          <button
            type="button"
            onClick={handleClick}
            aria-label="به همستر ضربه بزن"
            className={
              "group relative flex h-56 w-56 select-none items-center justify-center rounded-full " +
              "bg-gradient-to-br from-amber-50 via-orange-100 to-amber-100 " +
              "shadow-[inset_0_-12px_24px_rgba(180,83,9,0.10),0_12px_32px_rgba(251,146,60,0.28)] " +
              "transition-transform duration-100 ease-[var(--ease-spring)] " +
              "hover:scale-105 active:scale-95 " +
              "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/40"
            }
          >
            <HamsterIcon className="h-40 w-40 transition-transform duration-200 group-active:scale-90" />
            <span className="pointer-events-none absolute inset-3 rounded-full border-2 border-white/70" />
            <span className="pointer-events-none absolute inset-6 rounded-full border border-white/50" />
          </button>

          <div className="flex w-full max-w-md flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                {progress} از {COINS_TARGET} کلیک
              </span>
              <span className="font-medium tabular-nums text-gray-700">
                {remaining} کلیک تا سکه
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="absolute inset-y-0 right-0 rounded-full bg-gradient-to-l from-amber-400 to-amber-600 transition-all duration-300"
                style={{ width: `${(progress / COINS_TARGET) * 100}%` }}
              />
            </div>
          </div>

          <div className="h-8">
            {award === "coin" ? (
              <span
                role="status"
                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700"
              >
                <CoinIcon className="h-4 w-4" />
                یک سکه گرفتی!
              </span>
            ) : award === "blocked" ? (
              <span
                role="alert"
                className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-700"
              >
                <ShieldIcon className="h-4 w-4" />
                الگوی رباتیک — سکه‌ای داده نشد
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <DetectorCard
            title="ردیاب زمانی"
            icon={<ClockIcon className="h-4 w-4" />}
            suspicious={snapshot.timing.isSuspicious}
            reason={snapshot.timing.reason}
            rows={[
              {
                label: "میانگین فاصله",
                value: `${snapshot.timing.mean.toFixed(0)} میلی‌ثانیه`,
              },
              {
                label: "انحراف معیار",
                value: `${snapshot.timing.stdDev.toFixed(0)} میلی‌ثانیه`,
              },
              {
                label: "نمونه",
                value: String(snapshot.timing.sampleCount),
              },
            ]}
          />

          <DetectorCard
            title="ردیاب مکانی"
            icon={<TargetIcon className="h-4 w-4" />}
            suspicious={snapshot.spatial.isSuspicious}
            reason={snapshot.spatial.reason}
            rows={[
              {
                label: "انحراف افقی",
                value: `${snapshot.spatial.stdDevX.toFixed(1)} پیکسل`,
              },
              {
                label: "انحراف عمودی",
                value: `${snapshot.spatial.stdDevY.toFixed(1)} پیکسل`,
              },
              {
                label: "فاصله از مرکز",
                value: `${snapshot.spatial.avgDistanceFromCenter.toFixed(1)} پیکسل`,
              },
            ]}
          />
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
          >
            <RefreshIcon className="h-4 w-4" />
            شروع مجدد
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          هر ۱۰ کلیک یک سکه — اگر الگوی کلیک رباتیک تشخیص داده شود، سکه‌ای داده
          نمی‌شود
        </p>
      </div>
    </div>
  );
}

function HamsterIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="65" cy="55" rx="18" ry="20" fill="#fbbf24" />
      <ellipse cx="135" cy="55" rx="18" ry="20" fill="#fbbf24" />
      <ellipse cx="65" cy="58" rx="10" ry="12" fill="#fcd34d" />
      <ellipse cx="135" cy="58" rx="10" ry="12" fill="#fcd34d" />
      <ellipse cx="100" cy="120" rx="72" ry="66" fill="#fcd34d" />
      <ellipse cx="100" cy="130" rx="45" ry="42" fill="#fef3c7" />
      <ellipse cx="100" cy="88" rx="58" ry="52" fill="#fbbf24" />
      <ellipse cx="68" cy="105" rx="14" ry="11" fill="#fde68a" />
      <ellipse cx="132" cy="105" rx="14" ry="11" fill="#fde68a" />
      <ellipse cx="82" cy="82" rx="6" ry="7" fill="#1f2937" />
      <ellipse cx="118" cy="82" rx="6" ry="7" fill="#1f2937" />
      <circle cx="84" cy="80" r="2" fill="#ffffff" />
      <circle cx="120" cy="80" r="2" fill="#ffffff" />
      <ellipse cx="100" cy="98" rx="4" ry="3" fill="#7c2d12" />
      <path
        d="M100 101 Q96 108 92 106 M100 101 Q104 108 108 106"
        fill="none"
        stroke="#7c2d12"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <g stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6">
        <line x1="60" y1="98" x2="42" y2="94" />
        <line x1="60" y1="102" x2="42" y2="104" />
        <line x1="140" y1="98" x2="158" y2="94" />
        <line x1="140" y1="102" x2="158" y2="104" />
      </g>
      <ellipse cx="72" cy="150" rx="12" ry="9" fill="#fbbf24" />
      <ellipse cx="128" cy="150" rx="12" ry="9" fill="#fbbf24" />
      <ellipse cx="72" cy="176" rx="14" ry="8" fill="#f59e0b" />
      <ellipse cx="128" cy="176" rx="14" ry="8" fill="#f59e0b" />
      <circle
        cx="145"
        cy="155"
        r="7"
        fill="#facc15"
        stroke="#ca8a04"
        strokeWidth="1.5"
      />
      <text
        x="145"
        y="159"
        textAnchor="middle"
        fontSize="8"
        fontWeight="700"
        fill="#a16207"
      >
        $
      </text>
    </svg>
  );
}

function CoinIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        fill="#facc15"
        stroke="#ca8a04"
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="12"
        r="7"
        fill="none"
        stroke="#eab308"
        strokeWidth="1"
      />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontSize="10"
        fontWeight="800"
        fill="#a16207"
      >
        $
      </text>
    </svg>
  );
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </svg>
  );
}

function TargetIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  );
}

function RefreshIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function DetectorCard({
  title,
  icon,
  suspicious,
  reason,
  rows,
}: {
  title: string;
  icon: React.ReactNode;
  suspicious: boolean;
  reason: string | null;
  rows: { label: string; value: string }[];
}) {
  return (
    <div
      className={
        "flex flex-col gap-3 rounded-2xl border p-4 transition-colors " +
        (suspicious
          ? "border-red-200 bg-red-50/60"
          : "border-gray-200 bg-white")
      }
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={
              "flex h-7 w-7 items-center justify-center rounded-lg " +
              (suspicious
                ? "bg-red-100 text-red-600"
                : "bg-gray-100 text-gray-600")
            }
          >
            {icon}
          </span>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        </div>
        <span
          className={
            "rounded-full px-2 py-0.5 text-[10px] font-bold " +
            (suspicious
              ? "bg-red-500 text-white"
              : "bg-emerald-100 text-emerald-700")
          }
        >
          {suspicious ? "مشکوک" : "سالم"}
        </span>
      </header>

      <dl className="flex flex-col gap-1.5 text-xs">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between">
            <dt className="text-gray-500">{r.label}</dt>
            <dd className="font-medium tabular-nums text-gray-800">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      {reason ? (
        <p className="text-xs font-medium text-red-600">⚠️ {reason}</p>
      ) : null}
    </div>
  );
}
