"use client";

import Link from "next/link";
import { useState } from "react";

const STORY_PARTS = [
  [
    "遥か昔、こんな不思議な噂がありました。",
    "ある少女が、白と黒だけの世界で暮らす、小さな人々を見たというのです。",
    "ですが、誰も信じませんでした。",
    "そこで少女も気のせいだと思うことにしました。",
    "しかしある夜、少女はどこからか不思議な声を聞きました。",
    "「ぼくにも、あんな色があったらな……」",
    "「あの色、素敵だな……」",
    "それは、遠いどこかから聞こえてくる、小さな声。",
  ],
  [
    "それから長い年月が経ちました。",
    "もう誰も覚えていない、どこで聞いたのかも覚えていない、あの不思議な噂。",
    "「……ねえ。」",
    "「ぼくにも、あんな色があったらな……」",
    "「あの色、素敵だな……」",
  ],
];

export default function Prologue() {
  const [part, setPart] = useState(0);
  const [line, setLine] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPartEnd, setIsPartEnd] = useState(false);

  const handleNext = () => {
    if (isTransitioning || isModalOpen) return;

    if (isPartEnd) {
      setIsTransitioning(true);

      setTimeout(() => {
        setPart(1);
        setLine(0);
        setDisplayedLines([]);
        setIsPartEnd(false);
        setIsTransitioning(false);
      }, 1800);

      return;
    }

    const currentStory = STORY_PARTS[part];
    const nextLines = [...displayedLines, currentStory[line]];

    setDisplayedLines(nextLines);

    if (line === currentStory.length - 1) {
      if (part === 0) {
        setIsPartEnd(true);
      } else {
        setIsModalOpen(true);
      }
    } else {
      setLine((prev) => prev + 1);
    }
  };

  return (
    <main className="min-h-screen bg-[url('/images/background.png')] bg-cover bg-center flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 sm:p-6">
        <div
          className="
            w-full max-w-2xl
            h-[min(70dvh,28rem)]
            sm:h-[min(65dvh,32rem)]
            bg-[url('/images/text_bg.png')]
            bg-cover bg-center
            p-5 sm:p-6 md:p-8
            flex flex-col
            justify-start
            overflow-hidden
          "
        >
          <div
            className={`
              w-full flex-1 min-h-0
              space-y-3 sm:space-y-4
              overflow-hidden
              transition-all duration-[1800ms] ease-in-out
              ${
                isTransitioning
                  ? "opacity-0 -translate-y-3 blur-sm"
                  : "opacity-100 translate-y-0 blur-0"
              }
            `}
          >
            {displayedLines.map((text, index) => {
              const isDialogue = text.startsWith("「") && text.endsWith("」");

              return (
                <p
                  key={`${part}-${index}`}
                  className={`
                  w-full
                  text-base sm:text-[1.6rem] md:text-xl
                  leading-relaxed sm:leading-loose
                  ${isDialogue ? "text-center" : "text-left"}
                  animate-dialogue
                `}
                >
                  {text}
                </p>
              );
            })}
          </div>
        </div>

        {!isModalOpen && (
          <button
            onClick={handleNext}
            disabled={isTransitioning}
            className="
              mt-5 sm:mt-6
              text-sm sm:text-base
              text-white/60
              hover:text-white
              transition
              animate-pulse
              cursor-pointer
              disabled:opacity-0
            "
          >
            タップして進む ⬇
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
          <div
            className="
              w-full max-w-md
              bg-[#E9E6DE]
              border border-white/20
              rounded-xl
              p-6 sm:p-8
              text-center
            "
          >
            <p className="text-sm sm:text-base mb-8">
              ……声のする方を、探してみる？
            </p>
            <Link href="/ArPage">
              <button
                onClick={() => setIsModalOpen(false)}
                className="
                px-8 py-3
                bg-[#D9CDAF]
                border border-white/40
                rounded-lg
                hover:bg-white
                hover:text-black
                transition
                cursor-pointer
              "
              >
                探してみる
              </button>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
