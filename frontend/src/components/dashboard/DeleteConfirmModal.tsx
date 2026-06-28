
interface DeleteConfirmModalProps {
  spaceId: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  spaceId,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!spaceId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />

      {/* Content */}
      <div className="relative w-full max-w-sm rounded-2xl bg-[#0d0714] border border-red-500/10 shadow-2xl p-6 overflow-hidden">
        <div className="flex items-center gap-3 text-red-400 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-base font-bold text-white">Delete Space?</h3>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          Are you sure you want to delete space <code className="text-red-300 font-mono">{spaceId}</code>? This will permanently close the room, end playback, and wipe the collaborative queue.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg hover:bg-white/5 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg shadow-red-500/10 active:scale-95 transition-all cursor-pointer"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
export default DeleteConfirmModal;
