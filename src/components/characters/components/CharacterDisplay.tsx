import type { Character } from "../types/character";
import Dwarf from "./Dwarf";

type Props = {
  character: Character;
};

export default function CharacterDisplay({ character }: Props) {
  switch (character.id) {
    case "dwarf":
      return <Dwarf colors={character.colors} />;

    default:
      return null;
  }
}
