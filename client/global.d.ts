interface Problem {
  id: number;
  title: string;
  content: string;
  input: string;
  output: string;
  examples: { input: string; output: string }[];
  explanation: string;
  limitExplanation: string;
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
  createdAt: string;
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
  state: string;
  time: number;
  datetime: number;
}

interface SubmissionResopnseData {
  submission: {
    id: number;
    user: string;
    code: string;
    language: string;
    datetime: number;
    state: string;
    time: number;
    memory: number;
    stateId: number;
  };
  problem: Problem;
}
