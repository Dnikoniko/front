"use client";

import { useEffect, useState } from "react";
import { STORY } from "./story";
import Link from "next/link";

type DialogueWindowProps = {
  isOpen: boolean;
};

export default function DialogueWindow({ isOpen }: DialogueWindowProps) {
  const [storyIndex, setStoryIndex] = useState(0);
  const [visibleChars, setVisibleChars] = useState(0);
  const [storyFinished, setStoryFinished] = useState(false);

  const currentStory = STORY[storyIndex];

  // 1文字ずつ表示
  useEffect(() => {
    if (!isOpen || storyFinished) return;

    const text = STORY[storyIndex].text;

    if (visibleChars >= text.length) return;

    const timer = window.setTimeout(() => {
      setVisibleChars((count) => count + 1);
    }, 45);

    return () => window.clearTimeout(timer);
  }, [isOpen, storyIndex, visibleChars, storyFinished]);

  // 会話を進める
  function advanceStory() {
    if (storyFinished) return;

    // 文字表示中なら全文表示
    if (visibleChars < currentStory.text.length) {
      setVisibleChars(currentStory.text.length);
      return;
    }

    // 次のセリフへ
    if (storyIndex < STORY.length - 1) {
      setStoryIndex((index) => index + 1);
      setVisibleChars(0);
      return;
    }

    setStoryFinished(true);
  }

  // 最初から読む
  function restartStory() {
    setStoryIndex(0);
    setVisibleChars(0);
    setStoryFinished(false);
  }

  // 会話開始前は表示しない
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-4 left-1/2 z-30 m-2 w-[320px] max-w-[calc(100vw-1rem)] -translate-x-1/2">
      {/* セリフ */}
      <button
        type="button"
        onClick={advanceStory}
        className="block w-full rounded-2xl border-2 border-white/80 bg-white p-4 text-left text-neutral-900 shadow-xl"
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="font-bold text-indigo-700">
            {storyFinished ? "次に進もう！" : currentStory.name}
          </span>

          <span className="text-xs text-neutral-500">
            {storyFinished
              ? "END"
              : visibleChars < currentStory.text.length
                ? "タップで全文表示 ▼"
                : "タップして進む ▼"}
          </span>
        </div>

        <p className="min-h-14 text-sm leading-7">
          {storyFinished
            ? "色を探しに行こう！"
            : currentStory.text.slice(0, visibleChars)}
        </p>
      </button>
      {/* 読み直し */}
      {storyFinished && (
        <a
          href="/PickerPage"
          className="mt-3 block w-full rounded-full bg-indigo-600 px-4 py-3 text-center font-semibold text-white"
        >
          色を探しに行く！
        </a>
      )}{" "}
    </div>
  );
}
