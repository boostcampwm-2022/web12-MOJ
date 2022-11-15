import { NextApiRequest, NextApiResponse } from 'next';

function mockHandler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (id < 0 || id > 4) {
    res.status(404).end();
    return;
  }

  const result = {
    id,
    title: '개발자 + 디자이너 = 개자이너',
    content:
      '효석이는 개발자인데 디자이너가 너무 답답해서 직접 디자인을 하려고 한다. 이 때 효석이가 디자인한 피그마 파일의 크기를 구하시오.',
    io: [
      {
        input:
          '입력의 첫 줄에는 테스트 케이스의 개수 T가 주어진다. 그 다음 줄부터 각각의 테스트케이스에 대해 첫째 줄에 출발점 (x1, y1)과 도착점 (x2, y2)이 주어진다. 두 번째 줄에는 행성계의 개수 n이 주어지며, 세 번째 줄부터 n줄에 걸쳐 행성계의 중점과 반지름 (cx, cy, r)이 주어진다.',
        output:
          '각 테스트 케이스에 대해 어린 왕자가 거쳐야 할 최소의 행성계 진입/이탈 횟수를 출력한다.',
      },
    ],
    ioExample: [
      {
        input: 'in',
        output: 'out',
      },
    ],
    ioExplain: '효석이는 알고리즘을 좋아한다.',
    limitExplain:
      '-1000 ≤ x1, y1, x2, y2, cx, cy ≤ 1000\n1 ≤ r ≤ 1000\n1 ≤ n ≤ 50\n좌표와 반지름은 모두 정수',
    timeLimit: 1000,
    memoryLimit: 512,
  };

  return res.status(200).json(result);
}

export default mockHandler;
