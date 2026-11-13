"use client";

import ArCamera from "@/features/ar/ArCamera";
import DialogueWindow from "@/features/dialogue/DialogueWindow";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // 犬を配置したかどうか
  const [characterPlaced, setCharacterPlaced] = useState(false);

  // ステータス
  const [status, setStatus] = useState("ARを開始してください");

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleCharacterPlaced() {
    console.log("page.tsx：犬の配置通知を受け取りました");

    setCharacterPlaced(true);
    setStatus("警官ぽめが現れた！");
  }

  return (
    <main className="fixed inset-0 h-[100dvh] w-[100vw] overflow-hidden bg-black">
      {/* ARカメラ */}
      <ArCamera
        onCharacterPlaced={handleCharacterPlaced}
        onStatusChange={setStatus}
      />

      {/* UIをdocument.body直下に描画 */}
      {mounted &&
        createPortal(
          <>
            {/* 上部ステータス */}
            <div
              style={{
                position: "fixed",
                top: 16,
                left: 16,
                right: 16,
                zIndex: 2147483647,
                pointerEvents: "none",
              }}
            >
              <p className="rounded-xl bg-black/75 px-4 py-3 text-center text-sm text-white">
                {status}
              </p>
            </div>
            {/* 会話ウィンドウ */}
            <DialogueWindow isOpen={characterPlaced} />
          </>,
          document.body,
        )}
    </main>
  );
}
