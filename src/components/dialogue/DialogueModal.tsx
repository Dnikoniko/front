type DialogueModalProps = {
  title: string;
  text: string;
  options: {
    label: string;
    onClick?: () => void;
    href?: string;
  }[];
};

export default function DialogueModal({
  title,
  text,
  options,
}: DialogueModalProps) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="flex w-full max-w-xs flex-col gap-3">
        {options.map((option, index) =>
          option.href ? (
            <a
              key={index}
              href={option.href}
              className="w-full rounded-full bg-[#FFE9B4] px-4 py-3 text-center font-semibold transition"
            >
              {option.label}
            </a>
          ) : (
            <button
              key={index}
              type="button"
              onClick={option.onClick}
              className="w-full rounded-full bg-[#FFE9B4] px-4 py-3 text-center font-semibold transition"
            >
              {option.label}
            </button>
          ),
        )}
      </div>
    </div>
  );
}
