interface Problem {
  id: number;
  title: string;
  content: string;
  input: string;
  output: string;
  examples: { input: string; output: string }[];
  explanation: string;
  // TODO: ERD에 제한 추가하고 수정 필요
  limitExplain: string;
  timeLimit: number;
  memoryLimit: number;
}

interface TestCase {
  id: number;
  input: string;
  output: string;
}

interface ProblemSummary {
  id: number;
  title: string;
  rate: number;
}

interface ProblemListResponseData {
  pageCount: number;
  currentPage: number;
  problems: ProblemSummary[];
}

interface MyProblemListResponseData {
  pageCount: number;
  currentPage: number;
  problems: MyProblemSummary[];
}

interface StatusListResponseData {
  pageCount: number;
  currentPage: number;
  status: StatusSummary[];
}

interface MyProblemSummary {
  id: number;
  title: string;
  datetime: number;
  visible: number;
}

interface IO {
  input: string;
  output: string;
}

interface ListMapper<T> {
  path: undefined | keyof T;
  name: string;
  style?: {
    head?: SerializedStyles;
    row?: ((row: T) => SerializedStyles) | SerializedStyles;
    all?: SerializedStyles;
  };
  weight: number;
  format?: (value: any) => ReactNode;
  onclick?: (e: React.MouseEvent, row: T) => void;
}

interface StatusSummary {
  id: number;
  user: string;
  title: string;
  result: number;
  time: string;
  datetime: number;
}
