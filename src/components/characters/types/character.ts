export type PartColor = {
  id: string;
  color: string;
};

export type Character = {
  id: string;
  name: string;
  colors: PartColor[];
};
