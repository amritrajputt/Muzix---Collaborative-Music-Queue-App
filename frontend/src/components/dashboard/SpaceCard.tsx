
export interface Space {
  id: string;
  name: string;
  guestCount: number;
  songCount: number;
  isHost: boolean;
}

interface SpaceCardProps {
  space: Space;
  copiedId: string | null;
  onCopy: (id: string) => void;
  onDelete: (id: string) => void;
  onEnter: (id: string) => void;
}

export function SpaceCard({
  space,
  copiedId,
  onCopy,
  onDelete,
  onEnter,
}: SpaceCardProps) {
  return (
    <div className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.15] backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/5 hover:-translate-y-0.5">
      <div>
        {/* Badge status */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            {space.id}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Active
          </span>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors line-clamp-1">
          {space.name}
        </h3>

        {/* Details list */}
        <div className="mt-5 space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <span>{space.guestCount} listeners online</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            <span>{space.songCount} songs in queue</span>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="mt-8 flex items-center justify-between gap-3 pt-4 border-t border-white/[0.05]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCopy(space.id)}
            className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white text-slate-400 transition-all cursor-pointer relative"
            title="Copy space ID"
          >
            {copiedId === space.id ? (
              <span className="text-[10px] text-emerald-400 font-bold">Copied!</span>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
            )}
          </button>
          {space.isHost && (
            <button
              onClick={() => onDelete(space.id)}
              className="p-2 rounded-lg bg-red-500/5 border border-red-500/20 hover:bg-red-500/10 text-red-400 transition-all cursor-pointer"
              title="Delete space"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
        <button
          onClick={() => onEnter(space.id)}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5"
        >
          Enter Room
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
