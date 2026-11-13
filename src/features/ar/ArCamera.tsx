"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import * as THREE from "three";

import { createCharacterSprite } from "./CharacterSprite";

type XR8Api = {
  GlTextureRenderer: {
    pipelineModule: () => object;
  };
  Threejs: {
    pipelineModule: () => object;
    xrScene: () => {
      scene: THREE.Scene;
      camera: THREE.Camera;
      renderer: THREE.WebGLRenderer;
    };
  };
  XrController: {
    configure: (options: object) => void;
    pipelineModule: () => object;
  };
  XrConfig: {
    device: () => { ANY: unknown };
    camera: () => { BACK: unknown };
  };
  addCameraPipelineModules: (modules: object[]) => void;
  run: (options: object) => void;
  stop?: () => void;
};

type XRExtrasApi = {
  FullWindowCanvas: {
    pipelineModule: () => object;
  };
};

declare global {
  interface Window {
    THREE: typeof THREE;
    XR8?: XR8Api;
    XRExtras?: XRExtrasApi;
  }
}

type ArCameraProps = {
  onCharacterPlaced: () => void;
  onStatusChange: (message: string) => void;
};

export default function ArCamera({
  onCharacterPlaced,
  onStatusChange,
}: ArCameraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const xrRef = useRef<XR8Api | null>(null);
  const spriteRef = useRef<THREE.Sprite | null>(null);

  const startedRef = useRef(false);
  const placedRef = useRef(false);

  const [started, setStarted] = useState(false);

  // AR停止・後片付け
  useLayoutEffect(() => {
    return () => {
      console.log("🚪 ARページの終了処理");

      // 8th Wallを停止
      if (xrRef.current) {
        try {
          xrRef.current.stop?.();
          console.log("8th Wall停止");
        } catch (error) {
          console.error("AR停止エラー:", error);
        }
      }

      // キャラクターの参照を解放
      spriteRef.current?.removeFromParent();
      spriteRef.current = null;

      // 状態をリセット
      startedRef.current = false;
      placedRef.current = false;

      // スクロール制限を解除
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

  // 外部スクリプト読み込み
  function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");

      script.src = src;
      script.async = true;
      script.crossOrigin = "anonymous";

      script.onload = () => resolve();

      script.onerror = () => {
        reject(new Error(`スクリプトを読み込めませんでした: ${src}`));
      };

      document.head.appendChild(script);
    });
  }

  // 8th Wall本体読み込み
  function loadXR8(): Promise<XR8Api> {
    return new Promise((resolve, reject) => {
      if (window.XR8) {
        resolve(window.XR8);
        return;
      }

      const timeout = window.setTimeout(() => {
        window.removeEventListener("xrloaded", onLoaded);
        reject(new Error("ARエンジンの読み込みがタイムアウトしました"));
      }, 30000);

      const onLoaded = () => {
        window.clearTimeout(timeout);
        window.removeEventListener("xrloaded", onLoaded);

        if (window.XR8) {
          resolve(window.XR8);
        } else {
          reject(new Error("8th Wallの初期化に失敗しました"));
        }
      };

      window.addEventListener("xrloaded", onLoaded, { once: true });

      const script = document.createElement("script");

      script.src =
        "https://cdn.jsdelivr.net/npm/@8thwall/engine-binary@1/dist/xr.js";

      script.async = true;
      script.crossOrigin = "anonymous";
      script.dataset.preloadChunks = "slam";

      script.onerror = () => {
        window.clearTimeout(timeout);
        window.removeEventListener("xrloaded", onLoaded);
        reject(new Error("8th Wallのスクリプトを読み込めませんでした"));
      };

      document.head.appendChild(script);
    });
  }

  // AR開始
  async function startAR() {
    if (startedRef.current) return;

    try {
      onStatusChange("ARエンジンを読み込んでいます...");

      const XR8 = await loadXR8();

      // XRExtras読み込み
      if (!window.XRExtras) {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@8thwall/xrextras@1/dist/xrextras.js",
        );
      }

      if (!window.XRExtras?.FullWindowCanvas) {
        throw new Error("FullWindowCanvasを読み込めませんでした");
      }

      const canvas = canvasRef.current;

      if (!canvas) {
        throw new Error("AR用canvasが見つかりません");
      }

      xrRef.current = XR8;
      window.THREE = THREE;

      // 空間追跡
      XR8.XrController.configure({
        disableWorldTracking: false,
        scale: "absolute",
      });

      // キャラクター読み込み
      const sceneModule = {
        name: "character-placement",

        onStart: () => {
          const { scene } = XR8.Threejs.xrScene();

          createCharacterSprite(scene)
            .then((sprite) => {
              spriteRef.current = sprite;

              onStatusChange("床にカメラを向けて、好きな場所をタップ！");

              console.log("キャラクター読み込み完了");
            })
            .catch((error) => {
              console.error("キャラクター読み込みエラー:", error);
              onStatusChange("character.pngを読み込めませんでした");
            });
        },
      };

      // ARパイプライン登録
      XR8.addCameraPipelineModules([
        XR8.GlTextureRenderer.pipelineModule(),
        window.XRExtras.FullWindowCanvas.pipelineModule(),
        XR8.Threejs.pipelineModule(),
        XR8.XrController.pipelineModule(),
        sceneModule,
      ]);

      // AR開始
      XR8.run({
        canvas,

        cameraConfig: {
          direction: XR8.XrConfig.camera().BACK,
        },

        allowedDevices: XR8.XrConfig.device().ANY,
      });

      startedRef.current = true;
      setStarted(true);

      onStatusChange("床にカメラを向けて、好きな場所をタップしてください");
    } catch (error) {
      console.error("AR起動エラー:", error);

      onStatusChange(
        error instanceof Error ? error.message : "ARを起動できませんでした",
      );
    }
  }

  // キャラクター配置
  function placeCharacter(event: PointerEvent<HTMLCanvasElement>) {
    console.log("タップイベント発生");

    if (placedRef.current) return;

    if (!startedRef.current || !spriteRef.current || !xrRef.current) {
      console.log("ARまたはキャラクターの準備ができていません");
      return;
    }

    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();

    const { camera } = xrRef.current.Threejs.xrScene();

    // タップ位置を正規化
    const pointer = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );

    camera.updateMatrixWorld(true);

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(pointer, camera);

    // 仮想的な水平面との交点
    const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    const point = new THREE.Vector3();

    const hit = raycaster.ray.intersectPlane(ground, point);

    if (!hit || point.y < -0.01) {
      onStatusChange(
        "床をうまく認識できません。カメラを動かして再度タップしてください",
      );

      return;
    }

    // 犬を配置
    spriteRef.current.position.set(point.x, 0.5, point.z);
    spriteRef.current.visible = true;

    placedRef.current = true;

    console.log("犬の配置完了");

    // 親コンポーネントに通知
    onCharacterPlaced();

    onStatusChange("警官ぽめが現れた！");
  }

  return (
    <>
      {/* ARカメラ */}
      <canvas
        ref={canvasRef}
        onPointerDown={placeCharacter}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          touchAction: "none",
        }}
      />

      {/* AR開始ボタン */}
      {!started && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
          <button
            type="button"
            onClick={startAR}
            className="rounded-full bg-white px-7 py-4 font-semibold text-black"
          >
            ARを開始
          </button>
        </div>
      )}
    </>
  );
}
