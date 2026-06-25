interface LeaderBoardMember {
  name: string;
  score: number;
}

interface LeaderBoardProps {
  leaderBoard?: LeaderBoardMember[];
}

const MOCK_LEADERBOARD: LeaderBoardMember[] = [
  { name: "Host (amrit)", score: 142 },
  { name: "Rohan", score: 87 },
  { name: "Sneha", score: 64 },
  { name: "Alex", score: 29 },
];

const LeaderBoard: React.FC<LeaderBoardProps> = ({ leaderBoard = MOCK_LEADERBOARD }) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-3xl bg-[#09061a]/85 border border-white/[0.08] shadow-2xl backdrop-blur-xl relative overflow-hidden group">
      {/* Decorative ambient background glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <h3 className="text-base font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2">
        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Top Contributors
      </h3>

      {!leaderBoard || leaderBoard.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-6">No contributors yet.</p>
      ) : (
        <div className="space-y-3">
          {leaderBoard.map((member, index) => {
            // Gold, Silver, Bronze badges for top 3, standard style for others
            const rankStyles = [
              "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
              "bg-slate-300/20 text-slate-300 border-slate-300/30",
              "bg-amber-600/20 text-amber-500 border-amber-600/30",
            ];
            const defaultRankStyle = "bg-white/5 text-slate-400 border-white/5";
            const badgeClass = rankStyles[index] || defaultRankStyle;

            return (
              <div
                key={index}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full border text-xs font-bold flex items-center justify-center font-mono ${badgeClass}`}>
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {member.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-mono font-bold text-pink-400">
                    {member.score}
                  </span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}

export default LeaderBoard