"use client";

import { useEffect, useState } from "react";
import type { Story } from "./types";
import DialogueText from "./DialogueText";
import DialogueModal from "./DialogueModal";

type Props = {
  isOpen: boolean;
  story: Story;
};

export default function DialogueWindow({ isOpen, story }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [visibleChars, setVisibleChars] = useState(0);

  const currentStep = story.steps[stepIndex];

  // ストーリーが開いたら最初から開始
  useEffect(() => {
    if (!isOpen) return;

    setStepIndex(0);
    setVisibleChars(0);
  }, [isOpen, story.id]);

  // 1文字ずつ表示
  useEffect(() => {
    if (
      !isOpen ||
      (currentStep?.type !== "text" && currentStep?.type !== "end")
    )
      return;
    if (visibleChars >= currentStep.text.length) return;

    const timer = window.setTimeout(() => {
      setVisibleChars((count) => count + 1);
    }, 45);

    return () => window.clearTimeout(timer);
  }, [isOpen, currentStep, visibleChars]);

  if (!isOpen || !currentStep) return null;

  // 次のステップへ進む
  function goToStep(nextIndex: number) {
    setStepIndex(nextIndex);
    setVisibleChars(0);
  }

  // セリフを進める
  function advanceStory() {
    if (currentStep.type !== "text" && currentStep.type !== "end") return;
    // 文字表示中なら全文表示
    if (visibleChars < currentStep.text.length) {
      setVisibleChars(currentStep.text.length);
      return;
    }

    goToStep(stepIndex + 1);
  }

  // 選択肢を選ぶ
  function selectChoice(nextStepId?: string) {
    const nextIndex = nextStepId
      ? story.steps.findIndex((step) => step.id === nextStepId)
      : stepIndex + 1;

    if (nextIndex < 0 || nextIndex >= story.steps.length) return;

    goToStep(nextIndex);
  }

  return (
    <>
      {currentStep.type === "text" && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-4 pb-10">
          <DialogueText
            name={currentStep.name}
            text={currentStep.text.slice(0, visibleChars)}
            onClick={advanceStory}
            hint={
              visibleChars < currentStep.text.length
                ? "タップで全文表示 ▼"
                : "タップして進む ▼"
            }
          />
        </div>
      )}
      {currentStep.type === "choice" && (
        <DialogueModal
          title={currentStep.title}
          text={currentStep.text}
          options={currentStep.options.map((option) => ({
            label: option.label,
            onClick: () => selectChoice(option.nextStepId),
          }))}
        />
      )}
      {currentStep.type === "end" && (
        <div className="absolute bottom-4 left-1/2 z-30 m-2 w-[320px] max-w-[calc(100vw-1rem)] -translate-x-1/2">
          <DialogueText
            name={currentStep.title}
            text={currentStep.text.slice(0, visibleChars)}
            onClick={advanceStory}
            hint={
              visibleChars < currentStep.text.length
                ? "タップで全文表示 ▼"
                : "タップして進む ▼"
            }
          />

          {visibleChars >= currentStep.text.length && (
            <a
              href={currentStep.href}
              className="mt-3 block w-full rounded-full bg-[#FFE9B4] px-4 py-3 text-center font-semibold"
            >
              {currentStep.buttonLabel}
            </a>
          )}
        </div>
      )}
    </>
  );
}
