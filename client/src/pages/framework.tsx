export function ASFDiagram() {
  return (
    <div className="w-full flex justify-center">
      <div className="flex gap-6 items-start justify-center w-full max-w-5xl">
        {/* Step 01 */}
        <div className="flex-1 flex flex-col items-center" style={{ width: '280px' }}>
          {/* Icon Circle - Transparent */}
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6">
            <div className="text-3xl">⚙️</div>
          </div>
          
          {/* 3D Arrow Box */}
          <div className="w-full mt-6 relative" style={{ perspective: '1200px', height: '120px' }}>
            {/* Right side depth */}
            <div className="absolute top-0 right-0 bottom-0 w-6 bg-gradient-to-br from-amber-800 to-amber-900" style={{ clipPath: 'polygon(0% 0%, 100% 15%, 100% 85%, 0% 100%)' }}></div>
            {/* Main arrow face */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-700 py-8 px-6 text-center flex flex-col justify-center" style={{ clipPath: 'polygon(0% 0%, calc(100% - 24px) 0%, 100% 50%, calc(100% - 24px) 100%, 0% 100%)' }}>
              <h3 className="text-sm font-serif font-bold text-white">Scaling Diagnostic Matrix</h3>
              <p className="text-xs text-amber-100">Identify Stage of Growth and Point of Pain</p>
            </div>
          </div>
          
          <p className="text-xs font-mono text-amber-500 font-semibold mt-4">STEP 01</p>
        </div>

        {/* Step 02 */}
        <div className="flex-1 flex flex-col items-center" style={{ width: '280px' }}>
          {/* Icon Circle - Transparent */}
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6">
            <div className="text-3xl">📖</div>
          </div>
          
          {/* 3D Arrow Box */}
          <div className="w-full mt-6 relative" style={{ perspective: '1200px', height: '120px' }}>
            {/* Right side depth */}
            <div className="absolute top-0 right-0 bottom-0 w-6 bg-gradient-to-br from-slate-800 to-slate-900" style={{ clipPath: 'polygon(0% 0%, 100% 15%, 100% 85%, 0% 100%)' }}></div>
            {/* Main arrow face */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 py-8 px-6 text-center flex flex-col justify-center" style={{ clipPath: 'polygon(0% 0%, calc(100% - 24px) 0%, 100% 50%, calc(100% - 24px) 100%, 0% 100%)' }}>
              <h3 className="text-sm font-serif font-bold text-white">Case File Codex</h3>
              <p className="text-xs text-slate-300">Locate solutions to 80% of problems faced by founders</p>
            </div>
          </div>
          
          <p className="text-xs font-mono text-slate-400 font-semibold mt-4">STEP 02</p>
        </div>

        {/* Step 03 */}
        <div className="flex-1 flex flex-col items-center" style={{ width: '280px' }}>
          {/* Icon Circle - Transparent */}
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6">
            <div className="text-3xl">💬</div>
          </div>
          
          {/* 3D Arrow Box */}
          <div className="w-full mt-6 relative" style={{ perspective: '1200px', height: '120px' }}>
            {/* Right side depth */}
            <div className="absolute top-0 right-0 bottom-0 w-6 bg-gradient-to-br from-emerald-800 to-emerald-900" style={{ clipPath: 'polygon(0% 0%, 100% 15%, 100% 85%, 0% 100%)' }}></div>
            {/* Main arrow face */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-700 py-8 px-6 text-center flex flex-col justify-center" style={{ clipPath: 'polygon(0% 0%, calc(100% - 24px) 0%, 100% 50%, calc(100% - 24px) 100%, 0% 100%)' }}>
              <h3 className="text-sm font-serif font-bold text-white">Idea Clinic</h3>
              <p className="text-xs text-emerald-100">Discuss solutions to 20% of unique problems</p>
            </div>
          </div>
          
          <p className="text-xs font-mono text-emerald-400 font-semibold mt-4">STEP 03</p>
        </div>
      </div>
    </div>
  );
}
