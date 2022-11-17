import { NextApiRequest, NextApiResponse } from 'next';

function mockHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == 'GET') {
    const data = {
      title: '알고리즘 망령 효석이',
      data: [
        {
          id: 1,
          input: '234',
          output: '345',
        },
        {
          id: 2,
          input: '234234234',
          output: '101010',
        },
        {
          id: 3,
          input: 'asdfsadfsdaf',
          output: 'jfdklsafdljska',
        },
      ],
    };

    return res.status(200).json(data);
  }

  if (req.method == 'POST') {
    return res.status(200).end();
  }
}

export default mockHandler;
