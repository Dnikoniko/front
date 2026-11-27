import type { Story } from "@/components/dialogue/types";

export const REQUEST_STORY: Story = {
  id: "request",
  steps: [
    {
      id: "greeting",
      type: "text",
      name: "？？？",
      text: "あ！！気づいてくれたんだね！！",
    },
    {
      id: "apology",
      type: "text",
      name: "？？？",
      text: "急に驚かせてごめんね！",
    },
    {
      id: "introduction",
      type: "text",
      name: "？？？",
      text: "ぼくは色のない世界から来た小人なんだ。",
    },
    {
      id: "world",
      type: "text",
      name: "小人",
      text: "ぼくたちの世界には、色がないから、色のある世界にずっと憧れていたの。",
    },
    {
      id: "observation",
      type: "text",
      name: "小人",
      text: "だから昔から、人間たちのことをこっそり観察していたんだ！",
    },
    {
      id: "lonely",
      type: "text",
      name: "小人",
      text: "でも誰も見つけてくれなかったの…",
    },
    {
      id: "first",
      type: "text",
      name: "小人",
      text: "こうしてぼくを見つけてくれたのは、きみが初めてなんだ！",
    },
    {
      id: "request",
      type: "text",
      name: "小人",
      text: "お願い！僕のために色をつけてくれない？",
    },
    {
      id: "choice",
      type: "choice",
      title: "お願い、聞いてくれる？",
      text: "ぼくのために色をつけてくれる？",
      options: [{ label: "もちろん！" }, { label: "いいよ！" }],
    },
    {
      id: "end",
      type: "end",
      title: "小人",
      text: "やったー！ありがとう！じゃあ早速この帽子を君の好きな色でぬってほしいな！",
      buttonLabel: "色を探しに行く",
      href: "/PickerPage",
    },
  ],
};
