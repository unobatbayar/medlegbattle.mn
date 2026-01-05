export type QuestionCategory =
  | "Ерөнхий"
  | "Монгол"
  | "Түүх"
  | "Газарзүй"
  | "Шинжлэх ухаан"
  | "Соёл"
  | "Спорт"
  | "Технологи"
  | "Математик"
  | "Байгаль";

export type Question = {
  id: string;
  category: QuestionCategory;
  question: string;
  choices: [string, string, string, string];
  answerIndex: 0 | 1 | 2 | 3;
  explanation?: string;
  difficulty?: 1 | 2 | 3;
};

export type QuizSettings = {
  amount: number;
  categories: QuestionCategory[] | "ALL";
  shuffleChoices: boolean;
  autoNext: boolean;
};


