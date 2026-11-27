"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { characters } from "@/components/characters/data/characters";

export default function PickerPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [color, setColor] = useState<string | null>(null);
  const [previewColor, setPreviewColor] = useState<string | null>(null);
  const [isPicking, setIsPicking] = useState(false);

  const [previewPosition, setPreviewPosition] = useState({
    x: 0,
    y: 0,
  });

  const previewColorRef = useRef<string | null>(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (error) {
        console.error("カメラを起動できませんでした", error);
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const pickColor = (clientX: number, clientY: number) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !video.videoWidth) return;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0);

    const rect = video.getBoundingClientRect();

    const scale = Math.max(
      rect.width / video.videoWidth,
      rect.height / video.videoHeight,
    );

    const xOffset = (video.videoWidth * scale - rect.width) / 2;
    const yOffset = (video.videoHeight * scale - rect.height) / 2;

    const x = Math.floor((clientX - rect.left + xOffset) / scale);

    const y = Math.floor((clientY - rect.top + yOffset) / scale);

    if (x < 0 || y < 0 || x >= video.videoWidth || y >= video.videoHeight)
      return;

    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;

    const hex =
      "#" +
      [r, g, b]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();

    previewColorRef.current = hex;
    setPreviewColor(hex);

    setPreviewPosition({
      x: clientX,
      y: clientY,
    });
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLVideoElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    setIsPicking(true);
    pickColor(event.clientX, event.clientY);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLVideoElement>) => {
    if (!isPicking) return;

    pickColor(event.clientX, event.clientY);
  };

  const handlePointerUp = () => {
    if (previewColorRef.current) {
      setColor(previewColorRef.current);
    }

    setIsPicking(false);
    setPreviewColor(null);
    previewColorRef.current = null;
  };

  const handleGetColor = () => {
    if (!color) return;

    setIsConfirmOpen(true);
  };

  const handleConfirmColor = () => {
    if (!color) return;

    const storedColors = sessionStorage.getItem("dwarfColors");

    const currentColors = storedColors
      ? JSON.parse(storedColors)
      : characters.find((character) => character.id === "dwarf")!.colors;

    // 帽子の色だけ変更
    const updatedColors = currentColors.map(
      (part: { id: string; color: string }) =>
        part.id === "hat" ? { ...part, color } : part,
    );

    sessionStorage.setItem("dwarfColors", JSON.stringify(updatedColors));

    setIsConfirmOpen(false);
  };

  return (
    <main className="min-h-screen p-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="w-full cursor-crosshair rounded-lg"
        style={{
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      />

      {isPicking && previewColor && (
        <div
          className="pointer-events-none fixed z-50 flex -translate-x-1/2 -translate-y-full items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 shadow-lg"
          style={{
            left: previewPosition.x,
            top: previewPosition.y - 20,
          }}
        >
          <div
            className="h-10 w-10 rounded border border-gray-300"
            style={{ backgroundColor: previewColor }}
          />
          <span className="text-sm font-bold text-black">{previewColor}</span>
        </div>
      )}

      <div className="mt-4 flex items-center gap-4">
        <div
          className="h-[100px] w-[100px] border border-gray-300"
          style={{ backgroundColor: color ?? "white" }}
        />

        <div>
          <p className="text-base">カラーコード：{color ?? "未取得"}</p>

          <button
            type="button"
            onClick={handleGetColor}
            disabled={!color}
            className="mt-2 rounded-lg bg-black px-6 py-2 font-bold text-white disabled:opacity-30"
          >
            GET！
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} hidden />
      {isConfirmOpen && color && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-center text-xl font-bold text-black">
              この色でいいですか？
            </h2>

            <div className="my-6 flex flex-col items-center gap-3">
              <div
                className="h-24 w-24 rounded-xl border border-gray-300"
                style={{ backgroundColor: color }}
              />

              <p className="font-bold text-black">{color}</p>

              <p className="text-sm text-gray-600">
                この色を小人の帽子に使用します。
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 rounded-lg border border-gray-300 py-3 font-bold text-black"
              >
                やり直す
              </button>
              <Link
                href="/ArPage?story=thanks"
                onClick={handleConfirmColor}
                className="flex-1 rounded-lg bg-black py-3 text-center font-bold text-white"
              >
                決定する
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
