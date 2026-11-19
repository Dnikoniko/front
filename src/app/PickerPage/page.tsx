"use client";

import { useEffect, useRef, useState } from "react";

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

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
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
            style={{
              backgroundColor: previewColor,
            }}
          />

          <span className="text-sm font-bold text-black">{previewColor}</span>
        </div>
      )}

      <div className="mt-4 flex">
        <div
          className="h-[100px] w-[100px] border border-gray-300"
          style={{
            backgroundColor: color ?? "white",
          }}
        />

        <p className="mt-2 text-base">カラーコード：{color ?? "未取得"}</p>
      </div>

      <canvas ref={canvasRef} hidden />
    </main>
  );
}
