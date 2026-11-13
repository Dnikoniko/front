"use client";

import { useEffect, useRef, useState } from "react";

export default function PickerPage() {
  // HTML要素を取得するためのRef
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 取得したカラーコードを管理
  const [color, setColor] = useState<string | null>(null);

  // カメラ起動
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("カメラを起動できませんでした", error);
      }
    };

    startCamera();

    // コンポーネント終了時にカメラを停止
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // 映像をタップして色を取得
  const handleVideoClick = (event: React.MouseEvent<HTMLVideoElement>) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !video.videoWidth) return;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });

    if (!ctx) return;

    // Canvasのサイズを映像に合わせる
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 映像をCanvasに描画
    ctx.drawImage(video, 0, 0);

    // タップ位置を取得
    const rect = video.getBoundingClientRect();

    const x = Math.floor(
      ((event.clientX - rect.left) * video.videoWidth) / rect.width,
    );

    const y = Math.floor(
      ((event.clientY - rect.top) * video.videoHeight) / rect.height,
    );

    // タップした位置のRGB値を取得
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;

    // RGBをカラーコードに変換
    const hex =
      "#" +
      [r, g, b]
        .map((v) => v.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();

    // カラーコードを更新
    setColor(hex);
  };

  return (
    <main className="min-h-screen p-4">
      {/* カメラ映像 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        onClick={handleVideoClick}
        className="w-full cursor-crosshair rounded-lg"
      />

      {/* 取得した色 */}
      <div className="mt-4 flex">
        {/* 色見本 */}
        <div
          className="h-[100px] w-[100px] border border-gray-300"
          style={{
            backgroundColor: color ?? "white",
          }}
        />

        {/* カラーコード */}
        <p className="mt-2 text-base">カラーコード：{color ?? "未取得"}</p>
      </div>

      {/* 色取得用Canvas */}
      <canvas ref={canvasRef} hidden />
    </main>
  );
}
