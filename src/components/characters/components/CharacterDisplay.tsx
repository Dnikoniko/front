"use client";

import { useEffect, useState } from "react";
import type { Character, PartColor } from "../types/character";
import Dwarf from "./Dwarf";

type Props = {
  character: Character;
};

export default function CharacterDisplay({ character }: Props) {
  const [colors, setColors] = useState<PartColor[]>(character.colors);

  useEffect(() => {
    const stored = sessionStorage.getItem("dwarfColors");

    if (stored && character.id === "dwarf") {
      setColors(JSON.parse(stored));
    } else {
      setColors(character.colors);
    }
  }, [character]);

  switch (character.id) {
    case "dwarf":
      return <Dwarf colors={colors} />;

    default:
      return null;
  }
}
