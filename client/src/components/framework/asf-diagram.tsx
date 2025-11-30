export function ASFDiagram() {
  return (
    <div className="w-full flex justify-center">
      <svg
        viewBox="0 0 1000 400"
        className="w-full max-w-4xl"
        style={{ filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3))' }}
      >
        {/* Define gradients */}
        <defs>
          {/* Amber platform gradients */}
          <linearGradient id="amberMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b45309" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <linearGradient id="amberRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#451a03" />
          </linearGradient>
          <linearGradient id="amberTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Slate platform gradients */}
          <linearGradient id="slateMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="slateRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="slateTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>

          {/* Emerald platform gradients */}
          <linearGradient id="emeraldMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="emeraldRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#065f46" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id="emeraldTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Flow line gradient */}
          <linearGradient id="flowLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>

          {/* Shadows */}
          <filter id="platformShadow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>
        </defs>

        {/* Flowing connection line - cubic bezier curve */}
        <path
          d="M 150 200 Q 300 120, 450 200 Q 600 280, 750 200"
          stroke="url(#flowLine)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Platform 1: Diagnostic Matrix - Isometric 3D */}
        <g>
          {/* Shadow */}
          <ellipse cx="150" cy="340" rx="95" ry="15" fill="rgba(0,0,0,0.15)" />

          {/* Right face (isometric depth) */}
          <polygon
            points="240,180 260,170 260,270 240,280"
            fill="url(#amberRight)"
          />

          {/* Top face (isometric) */}
          <polygon
            points="60,160 240,180 260,170 80,150"
            fill="url(#amberTop)"
          />

          {/* Main front face */}
          <polygon
            points="60,160 240,180 240,280 60,260"
            fill="url(#amberMain)"
          />

          {/* Text on platform */}
          <foreignObject x="60" y="160" width="180" height="120">
            <div className="text-center text-white p-4 text-sm font-serif font-bold">
              <div className="text-2xl mb-1">⚙️</div>
              <div>Scaling Diagnostic Matrix</div>
              <div className="text-xs opacity-80 font-light mt-1">Identify Your Zone</div>
            </div>
          </foreignObject>

          {/* Step label */}
          <text x="150" y="320" textAnchor="middle" className="text-xs font-mono fill-amber-500" fontSize="11" fontWeight="600">
            STEP 01
          </text>
        </g>

        {/* Platform 2: Case File Codex - Center */}
        <g>
          {/* Shadow */}
          <ellipse cx="450" cy="340" rx="95" ry="15" fill="rgba(0,0,0,0.15)" />

          {/* Right face */}
          <polygon
            points="540,140 560,130 560,230 540,240"
            fill="url(#slateRight)"
          />

          {/* Top face */}
          <polygon
            points="360,120 540,140 560,130 380,110"
            fill="url(#slateTop)"
          />

          {/* Main front face */}
          <polygon
            points="360,120 540,140 540,240 360,220"
            fill="url(#slateMain)"
          />

          {/* Text on platform */}
          <foreignObject x="360" y="120" width="180" height="120">
            <div className="text-center text-white p-4 text-sm font-serif font-bold">
              <div className="text-2xl mb-1">📖</div>
              <div>Case File Codex</div>
              <div className="text-xs opacity-80 font-light mt-1">80% of Solutions</div>
            </div>
          </foreignObject>

          {/* Step label */}
          <text x="450" y="280" textAnchor="middle" className="text-xs font-mono fill-slate-400" fontSize="11" fontWeight="600">
            STEP 02
          </text>
        </g>

        {/* Platform 3: Idea Clinic - Right */}
        <g>
          {/* Shadow */}
          <ellipse cx="750" cy="340" rx="95" ry="15" fill="rgba(0,0,0,0.15)" />

          {/* Right face */}
          <polygon
            points="840,180 860,170 860,270 840,280"
            fill="url(#emeraldRight)"
          />

          {/* Top face */}
          <polygon
            points="660,160 840,180 860,170 680,150"
            fill="url(#emeraldTop)"
          />

          {/* Main front face */}
          <polygon
            points="660,160 840,180 840,280 660,260"
            fill="url(#emeraldMain)"
          />

          {/* Text on platform */}
          <foreignObject x="660" y="160" width="180" height="120">
            <div className="text-center text-white p-4 text-sm font-serif font-bold">
              <div className="text-2xl mb-1">💬</div>
              <div>Idea Clinic</div>
              <div className="text-xs opacity-80 font-light mt-1">The Other 20%</div>
            </div>
          </foreignObject>

          {/* Step label */}
          <text x="750" y="320" textAnchor="middle" className="text-xs font-mono fill-emerald-400" fontSize="11" fontWeight="600">
            STEP 03
          </text>
        </g>
      </svg>
    </div>
  );
}
