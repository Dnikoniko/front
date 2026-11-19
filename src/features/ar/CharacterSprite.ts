import * as THREE from "three";

/**
 * Three.jsのシーンにキャラクターを追加する
 */
export function createCharacterSprite(
  scene: THREE.Scene,
): Promise<THREE.Sprite> {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();

    loader.load(
      "/images/character.png",

      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;

        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
        });

        const sprite = new THREE.Sprite(material);

        // キャラクターの大きさ
        sprite.scale.set(0.35, 0.5, 1);

        // 最初は非表示
        sprite.visible = false;

        // 初期位置
        sprite.position.set(0, 0.5, -1);

        scene.add(sprite);

        resolve(sprite);
      },

      undefined,

      (error) => {
        reject(error);
      },
    );
  });
}
