// Animated SVG Icons — petroleum theme
// Each icon has a looping CSS animation

export function OilPumpIcon({ size = 32, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <style>{`
        @keyframes pump {
          0%, 100% { transform: rotate(0deg); transform-origin: 32px 28px; }
          40% { transform: rotate(-18deg); transform-origin: 32px 28px; }
          60% { transform: rotate(18deg); transform-origin: 32px 28px; }
        }
        @keyframes pumpArm {
          0%, 100% { transform: rotate(0deg); transform-origin: 20px 26px; }
          40% { transform: rotate(12deg); transform-origin: 20px 26px; }
          60% { transform: rotate(-12deg); transform-origin: 20px 26px; }
        }
        .pump-beam { animation: pump 2s ease-in-out infinite; }
        .pump-arm  { animation: pumpArm 2s ease-in-out infinite; }
      `}</style>
            {/* Base */}
            <rect x="8" y="54" width="12" height="6" rx="1" fill="#444" stroke="#111" strokeWidth="1.5"/>
            <rect x="44" y="54" width="12" height="6" rx="1" fill="#444" stroke="#111" strokeWidth="1.5"/>
            {/* Legs */}
            <line x1="14" y1="54" x2="28" y2="36" stroke="#555" strokeWidth="3" strokeLinecap="round"/>
            <line x1="50" y1="54" x2="36" y2="36" stroke="#555" strokeWidth="3" strokeLinecap="round"/>
            <line x1="14" y1="54" x2="36" y2="36" stroke="#555" strokeWidth="2" strokeLinecap="round"/>
            <line x1="50" y1="54" x2="28" y2="36" stroke="#555" strokeWidth="2" strokeLinecap="round"/>
            {/* Pivot */}
            <circle cx="32" cy="34" r="3" fill="#333" stroke="#111" strokeWidth="1.5"/>
            {/* Beam */}
            <g className="pump-beam">
                <rect x="10" y="26" width="44" height="8" rx="3" fill="#F59E0B" stroke="#111" strokeWidth="2"/>
                {/* Counterweight */}
                <rect x="42" y="22" width="14" height="12" rx="2" fill="#666" stroke="#111" strokeWidth="1.5"/>
                {/* Head */}
                <rect x="8" y="24" width="10" height="12" rx="2" fill="#888" stroke="#111" strokeWidth="1.5"/>
            </g>
            {/* Rod */}
            <g className="pump-arm">
                <line x1="12" y1="36" x2="12" y2="54" stroke="#444" strokeWidth="3" strokeLinecap="round"/>
            </g>
        </svg>
    )
}

export function OilDropIcon({ size = 32, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <style>{`
        @keyframes drip {
          0%, 100% { transform: scaleY(1); transform-origin: center bottom; }
          50% { transform: scaleY(1.08); transform-origin: center bottom; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }
        .drop-body { animation: drip 2.5s ease-in-out infinite; }
        .drop-shine { animation: shimmer 2.5s ease-in-out infinite; }
      `}</style>
            <g className="drop-body">
                <path d="M32 6 C32 6 14 26 14 38 C14 48.5 22.5 57 32 57 C41.5 57 50 48.5 50 38 C50 26 32 6 32 6Z"
                      fill="#F59E0B" stroke="#111" strokeWidth="2.5" strokeLinejoin="round"/>
                <path className="drop-shine" d="M24 28 C24 28 20 34 20 40 C20 43 21.5 46 24 48"
                      stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
            </g>
        </svg>
    )
}

export function FlameIcon({ size = 32, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <style>{`
        @keyframes flicker {
          0%, 100% { transform: scaleX(1) scaleY(1); transform-origin: center bottom; }
          25% { transform: scaleX(0.93) scaleY(1.06); transform-origin: center bottom; }
          75% { transform: scaleX(1.07) scaleY(0.95); transform-origin: center bottom; }
        }
        @keyframes innerFlicker {
          0%, 100% { transform: scaleX(1) scaleY(1); transform-origin: center bottom; }
          33% { transform: scaleX(0.88) scaleY(1.1); transform-origin: center bottom; }
          66% { transform: scaleX(1.1) scaleY(0.92); transform-origin: center bottom; }
        }
        .flame-outer { animation: flicker 1.5s ease-in-out infinite; }
        .flame-inner { animation: innerFlicker 1.2s ease-in-out infinite; }
      `}</style>
            <g className="flame-outer">
                <path d="M32 58 C20 58 12 48 12 38 C12 28 20 22 24 14 C26 24 22 28 28 32 C28 24 34 16 32 6 C42 14 52 26 52 38 C52 48 44 58 32 58Z"
                      fill="#F59E0B" stroke="#111" strokeWidth="2.5"/>
            </g>
            <g className="flame-inner">
                <path d="M32 52 C25 52 20 46 20 40 C20 34 26 30 28 26 C28 32 26 36 30 38 C30 34 34 28 32 22 C38 28 44 34 44 40 C44 46 39 52 32 52Z"
                      fill="#FDE68A" stroke="none"/>
            </g>
        </svg>
    )
}

export function SolarIcon({ size = 32, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); transform-origin: 32px 32px; }
          to   { transform: rotate(360deg); transform-origin: 32px 32px; }
        }
        @keyframes pulse-sun {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .sun-rays { animation: spin-slow 8s linear infinite; }
        .sun-core { animation: pulse-sun 2s ease-in-out infinite; }
      `}</style>
            <g className="sun-rays">
                {[0,45,90,135,180,225,270,315].map((deg, i) => (
                    <line key={i}
                          x1={32 + 18 * Math.cos((deg - 90) * Math.PI / 180)}
                          y1={32 + 18 * Math.sin((deg - 90) * Math.PI / 180)}
                          x2={32 + 26 * Math.cos((deg - 90) * Math.PI / 180)}
                          y2={32 + 26 * Math.sin((deg - 90) * Math.PI / 180)}
                          stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"
                    />
                ))}
            </g>
            <circle className="sun-core" cx="32" cy="32" r="14" fill="#F59E0B" stroke="#111" strokeWidth="2.5"/>
            <circle cx="32" cy="32" r="8" fill="#FDE68A"/>
        </svg>
    )
}

export function ChartIcon({ size = 32, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <style>{`
        @keyframes bar1 {
          0%, 100% { transform: scaleY(1); transform-origin: center bottom; }
          50% { transform: scaleY(1.15); transform-origin: center bottom; }
        }
        @keyframes bar2 {
          0%, 100% { transform: scaleY(1); transform-origin: center bottom; }
          50% { transform: scaleY(0.88); transform-origin: center bottom; }
        }
        @keyframes bar3 {
          0%, 100% { transform: scaleY(1); transform-origin: center bottom; }
          50% { transform: scaleY(1.2); transform-origin: center bottom; }
        }
        .bar1 { animation: bar1 2s ease-in-out infinite; }
        .bar2 { animation: bar2 2s ease-in-out infinite 0.3s; }
        .bar3 { animation: bar3 2s ease-in-out infinite 0.6s; }
      `}</style>
            {/* Axes */}
            <line x1="12" y1="52" x2="52" y2="52" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="12" y1="10" x2="12" y2="52" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Bars */}
            <g className="bar1">
                <rect x="16" y="28" width="10" height="24" rx="1.5" fill="#F59E0B" stroke="#111" strokeWidth="1.5"/>
            </g>
            <g className="bar2">
                <rect x="29" y="18" width="10" height="34" rx="1.5" fill="#555" stroke="#111" strokeWidth="1.5"/>
            </g>
            <g className="bar3">
                <rect x="42" y="22" width="10" height="30" rx="1.5" fill="#F59E0B" stroke="#111" strokeWidth="1.5"/>
            </g>
        </svg>
    )
}

export function DocumentIcon({ size = 32, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <style>{`
        @keyframes page-flip {
          0%, 80%, 100% { transform: rotateY(0deg); }
          40% { transform: rotateY(-20deg); }
        }
        @keyframes line-slide {
          0%, 100% { transform: scaleX(1); transform-origin: left; }
          50% { transform: scaleX(0.6); transform-origin: left; }
        }
        .doc-body { animation: page-flip 3s ease-in-out infinite; transform-style: preserve-3d; }
        .doc-line { animation: line-slide 2s ease-in-out infinite; }
        .doc-line2 { animation: line-slide 2s ease-in-out infinite 0.3s; }
        .doc-line3 { animation: line-slide 2s ease-in-out infinite 0.6s; }
      `}</style>
            <g className="doc-body">
                <path d="M14 8 H40 L50 18 V56 H14 Z" fill="white" stroke="#111" strokeWidth="2.5" strokeLinejoin="round"/>
                <path d="M40 8 V18 H50" fill="#F59E0B" stroke="#111" strokeWidth="2" strokeLinejoin="round"/>
            </g>
            <g className="doc-line">
                <line x1="20" y1="28" x2="44" y2="28" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
            </g>
            <g className="doc-line2">
                <line x1="20" y1="36" x2="44" y2="36" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
            </g>
            <g className="doc-line3">
                <line x1="20" y1="44" x2="36" y2="44" stroke="#888" strokeWidth="2" strokeLinecap="round"/>
            </g>
        </svg>
    )
}

export function GasIcon({ size = 32, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <style>{`
        @keyframes bubble1 {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        @keyframes bubble2 {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-18px); opacity: 0; }
        }
        @keyframes bubble3 {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-22px); opacity: 0; }
        }
        .b1 { animation: bubble1 2s ease-in infinite; }
        .b2 { animation: bubble2 2s ease-in infinite 0.5s; }
        .b3 { animation: bubble3 2s ease-in infinite 1s; }
      `}</style>
            {/* Tank */}
            <rect x="14" y="28" width="36" height="28" rx="4" fill="#555" stroke="#111" strokeWidth="2.5"/>
            <rect x="14" y="28" width="36" height="12" rx="4" fill="#F59E0B" stroke="#111" strokeWidth="2.5"/>
            {/* Pipe top */}
            <rect x="28" y="12" width="8" height="18" rx="2" fill="#444" stroke="#111" strokeWidth="2"/>
            {/* Bubbles */}
            <circle className="b1" cx="26" cy="20" r="3" fill="none" stroke="#F59E0B" strokeWidth="1.5"/>
            <circle className="b2" cx="32" cy="16" r="2" fill="none" stroke="#F59E0B" strokeWidth="1.5"/>
            <circle className="b3" cx="38" cy="20" r="2.5" fill="none" stroke="#F59E0B" strokeWidth="1.5"/>
        </svg>
    )
}

export function OpecIcon({ size = 32, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <style>{`
        @keyframes globe-spin {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: -100; }
        }
        @keyframes globe-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .globe-line { animation: globe-spin 4s linear infinite; stroke-dasharray: 8 4; }
        .globe-body { animation: globe-pulse 3s ease-in-out infinite; }
      `}</style>
            <circle className="globe-body" cx="32" cy="32" r="22" fill="#F59E0B" stroke="#111" strokeWidth="2.5"/>
            <ellipse cx="32" cy="32" rx="10" ry="22" fill="none" stroke="#111" strokeWidth="2" opacity="0.4"/>
            <line className="globe-line" x1="10" y1="32" x2="54" y2="32" stroke="#111" strokeWidth="2" opacity="0.4"/>
            <line x1="10" y1="22" x2="54" y2="22" stroke="#111" strokeWidth="1.5" opacity="0.25"/>
            <line x1="10" y1="42" x2="54" y2="42" stroke="#111" strokeWidth="1.5" opacity="0.25"/>
        </svg>
    )
}

// Map category name → icon component
export const categoryIcons = {
    "نفط خام": OilDropIcon,
    "البترول": OilPumpIcon,
    "غاز طبيعي": GasIcon,
    "الغاز الطبيعي": GasIcon,
    "طاقة متجددة": SolarIcon,
    "الطاقة المتجددة": SolarIcon,
    "أسواق": ChartIcon,
    "الأسواق": ChartIcon,
    "تقارير": DocumentIcon,
    "أوبك+": OpecIcon,
}