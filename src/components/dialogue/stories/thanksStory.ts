import type { Story } from "@/components/dialogue/types";

export const THANKS_STORY: Story = {
  id: "thanks",
  steps: [
    {
      id: "surprise",
      type: "text",
      name: "小人",
      text: "わあ！！これが色なんだね！",
    },
    {
      id: "amazing",
      type: "text",
      name: "小人",
      text: "すごい！",
    },
    {
      id: "hat",
      type: "text",
      name: "小人",
      text: "すごい！ぼくの帽子がもっと素敵になっちゃった！",
    },
    {
      id: "calling",
      type: "text",
      name: "小人",
      text: "ねえねえ！",
    },
    {
      id: "more",
      type: "text",
      name: "小人",
      text: "ねえねえ！ぼく、もっといろんな色を見たくなっちゃった！",
    },
    {
      id: "request",
      type: "text",
      name: "小人",
      text: "ぼくに色をつけるの手伝ってくれない？",
    },
    {
      id: "choice",
      type: "choice",
      title: "また手伝ってくれる？",
      text: "もっといろんな色を見てみたいんだ！",
      options: [{ label: "いいよー" }, { label: "仕方ないなー" }],
    },
    {
      id: "thanks",
      type: "text",
      name: "小人",
      text: "わーい！ありがとう！",
    },
    {
      id: "goodbye",
      type: "text",
      name: "小人",
      text: "またくるね！",
    },
    {
      id: "end",
      type: "end",
      title: "ありがとう！",
      text: "また一緒に色を探そうね！",
      buttonLabel: "ホームに戻る",
      href: "/",
    },
  ],
};
