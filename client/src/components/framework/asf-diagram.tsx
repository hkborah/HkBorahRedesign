export function ASFDiagram() {
  return (
    <div className="w-full flex justify-center">
      <div className="flex gap-8 items-stretch justify-center w-full max-w-5xl">
        {/* Step 01 */}
        <div className="flex-1 flex flex-col items-center" style={{ width: '260px' }}>
          <div className="w-full bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg p-6 text-center flex-1 flex flex-col justify-center">
            <h3 className="text-sm font-serif font-bold text-white mb-2">Scaling Diagnostic Matrix</h3>
            <p className="text-xs text-amber-100">Identify Stage of Growth and Point of Pain</p>
          </div>
          <p className="text-xs font-mono text-amber-500 font-semibold mt-6">STEP 01</p>
        </div>

        {/* Step 02 */}
        <div className="flex-1 flex flex-col items-center" style={{ width: '260px' }}>
          <div className="w-full bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-6 text-center flex-1 flex flex-col justify-center">
            <h3 className="text-sm font-serif font-bold text-white mb-2">Case File Codex</h3>
            <p className="text-xs text-slate-300">Locate solutions to 80% of problems faced by founders</p>
          </div>
          <p className="text-xs font-mono text-slate-400 font-semibold mt-6">STEP 02</p>
        </div>

        {/* Step 03 */}
        <div className="flex-1 flex flex-col items-center" style={{ width: '260px' }}>
          <div className="w-full bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg p-6 text-center flex-1 flex flex-col justify-center">
            <h3 className="text-sm font-serif font-bold text-white mb-2">Idea Clinic</h3>
            <p className="text-xs text-emerald-100">Discuss solutions to 20% of unique problems</p>
          </div>
          <p className="text-xs font-mono text-emerald-400 font-semibold mt-6">STEP 03</p>
        </div>
      </div>
    </div>
  );
}
