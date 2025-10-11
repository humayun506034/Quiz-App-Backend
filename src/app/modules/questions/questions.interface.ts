
export interface IOption {
  label: string; // e.g. "Always"
  value: number; // e.g. 1, 2, 3, 4
}

export interface IQuestions {
  questionNumber: number;
  text: string;
  options: IOption[];
  domain: string; // e.g. "Burnout"
  weight: number; // e.g. 4
  inverted?: boolean; // e.g. true if (Inverted)
  part: number; // 1 = Main Survey (Q1–Q25), 2 = Follow-up (Q26–Q33)
  followUpTrigger?: string; // optional: for linking trigger domains (like Burnout, Anxiety)
}
