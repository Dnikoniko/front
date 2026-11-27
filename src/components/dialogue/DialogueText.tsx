type DialogueTextProps = {
  name: string;
  text: string;
  onClick: () => void;
  hint?: string;
};

export default function DialogueText({
  name,
  text,
  onClick,
  hint = "タップして進む ▼",
}: DialogueTextProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full rounded-2xl border-2 border-white/80 bg-white p-4 text-left text-neutral-900 shadow-xl"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-bold text-indigo-700">{name}</span>

        <span className="text-xs text-neutral-500">{hint}</span>
      </div>

      <p className="min-h-14 text-sm leading-7">{text}</p>
    </button>
  );
}
