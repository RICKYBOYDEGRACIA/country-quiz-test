export default function PopModal({ score, totalQuestions, onRestart }) {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="flex flex-col items-center bg-[var(--panel-bg)] border border-slate-700 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center transform transition-all animate-in fade-in zoom-in duration-200">
        
        {/* Quiz Completed Trophy/Badge */}
        <div className="text-5xl mb-4"><img src="congrats.png"></img></div>

        <h2 className="text-2xl font-bold text-[var(--color-white)] mb-2">
          Quiz Completed!
        </h2>
        
        <p className="text-slate-300 text-sm mb-6">
          You answered all {totalQuestions} questions. Here is your final score:
        </p>

        {/* Score Display */}
        <div className="bg-gradient-primary w-full py-4 rounded-xl mb-6 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-[var(--color-white)]">
            {score} / {totalQuestions}
          </span>
          <span className="text-xs text-slate-200 mt-1 uppercase tracking-wider font-semibold">
            {percentage}% Accuracy
          </span>
        </div>

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="w-full bg-gradient-primary hover:opacity-90 active:scale-95 text-[var(--color-white)] font-semibold py-3 rounded-xl transition-all duration-200 cursor-pointer"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}