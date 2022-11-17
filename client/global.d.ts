interface Problem {
  id: number;
  title: string;
  content: string;
  io: { input: string; output: string };
  ioExample: { input: string; output: string }[];
  ioExplain: string;
  limitExplain: string;
  timeLimit: number;
  memoryLimit: number;
}

interface TestCase {
  id: number;
  input: string;
  output: string;
}
