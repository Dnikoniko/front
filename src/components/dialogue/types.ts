export type TextStep = {
  id: string;
  type: "text";
  name: string;
  text: string;
};

export type ChoiceStep = {
  id: string;
  type: "choice";
  title: string;
  text: string;
  options: {
    label: string;
    nextStepId?: string;
  }[];
};

export type EndStep = {
  id: string;
  type: "end";
  title: string;
  text: string;
  buttonLabel: string;
  href: string;
};

export type StoryStep = TextStep | ChoiceStep | EndStep;

export type Story = {
  id: string;
  steps: StoryStep[];
};
