export function ASFDiagram() {
  return (
    <div className="w-full flex justify-center">
      <div className="relative w-full max-w-4xl h-96">
        {/* Flowing line - SVG */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ pointerEvents: 'none' }}
        >
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          {/* Curved flowing line */}
          <path
            d="M 80 160 Q 250 80, 420 160 Q 590 240, 760 160"
            stroke="url(#flowGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>

        {/* Content grid */}
        <div className="relative z-10 grid grid-cols-3 gap-8 h-full px-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center justify-center">
            {/* Icon */}
            <div className="text-5xl mb-6 drop-shadow-lg">⚙️</div>
            
            {/* 3D Card */}
            <div className="w-full relative group">
              <div
                className="absolute inset-0 bg-gradient-to-br from-amber-800 to-amber-900 rounded-lg"
                style={{
                  transform: 'translate(8px, 8px)',
                }}
              ></div>
              <div className="relative bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg p-6 text-center transform group-hover:scale-105 transition-transform duration-300">
                <h3 className="text-base font-serif font-bold text-white mb-1">
                  Scaling Diagnostic Matrix
                </h3>
                <p className="text-xs text-amber-100 font-light">
                  Identify Your Zone
                </p>
              </div>
            </div>
            
            <p className="text-xs font-mono text-amber-500 font-semibold mt-6 tracking-wider">
              STEP 01
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center justify-center">
            {/* Icon */}
            <div className="text-5xl mb-6 drop-shadow-lg">📖</div>
            
            {/* 3D Card */}
            <div className="w-full relative group">
              <div
                className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg"
                style={{
                  transform: 'translate(8px, 8px)',
                }}
              ></div>
              <div className="relative bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-6 text-center transform group-hover:scale-105 transition-transform duration-300">
                <h3 className="text-base font-serif font-bold text-white mb-1">
                  Case File Codex
                </h3>
                <p className="text-xs text-slate-300 font-light">
                  80% of Solutions
                </p>
              </div>
            </div>
            
            <p className="text-xs font-mono text-slate-400 font-semibold mt-6 tracking-wider">
              STEP 02
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center justify-center">
            {/* Icon */}
            <div className="text-5xl mb-6 drop-shadow-lg">💬</div>
            
            {/* 3D Card */}
            <div className="w-full relative group">
              <div
                className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-lg"
                style={{
                  transform: 'translate(8px, 8px)',
                }}
              ></div>
              <div className="relative bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg p-6 text-center transform group-hover:scale-105 transition-transform duration-300">
                <h3 className="text-base font-serif font-bold text-white mb-1">
                  Idea Clinic
                </h3>
                <p className="text-xs text-emerald-100 font-light">
                  The Other 20%
                </p>
              </div>
            </div>
            
            <p className="text-xs font-mono text-emerald-400 font-semibold mt-6 tracking-wider">
              STEP 03
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
