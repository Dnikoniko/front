import * as THREE from "three";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import Dwarf from "@/components/characters/components/Dwarf";
import type { PartColor } from "@/components/characters/types/character";

export async function createCharacterSprite(
  scene: THREE.Scene,
  colors: PartColor[] = [],
): Promise<THREE.Sprite> {
  // コンポーネントをSVG文字列に変換
  const svgMarkup = renderToStaticMarkup(createElement(Dwarf, { colors }));

  // SVGを解析
  const parser = new DOMParser();
  const svgDocument = parser.parseFromString(svgMarkup, "image/svg+xml");

  // SVGの解析エラーを確認
  if (svgDocument.querySelector("parsererror")) {
    throw new Error("ドワーフのSVGを解析できませんでした");
  }

  const svgElement = svgDocument.documentElement;

  // SVGの画像サイズを指定
  const width = 512;
  const height = Math.round(width * (585.89 / 419.54));

  svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgElement.setAttribute("width", String(width));
  svgElement.setAttribute("height", String(height));

  // SVGをBlob URLに変換
  const serializedSvg = new XMLSerializer().serializeToString(svgDocument);

  const blob = new Blob([serializedSvg], {
    type: "image/svg+xml;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  try {
    // SVGを画像として読み込む
    const image = new Image();

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(new Error("ドワーフのSVG画像を読み込めませんでした"));

      image.src = url;
    });

    // Canvasに描画
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Canvasを取得できませんでした");
    }

    context.drawImage(image, 0, 0, width, height);

    // Three.jsのテクスチャに変換
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;

    // Spriteを作成
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    });

    const sprite = new THREE.Sprite(material);

    // SVGの縦横比を維持
    const aspectRatio = height / width;
    sprite.scale.set(0.5, 0.5 * aspectRatio, 1);

    sprite.visible = false;

    scene.add(sprite);

    return sprite;
  } finally {
    // Blob URLを解放
    URL.revokeObjectURL(url);
  }
}
