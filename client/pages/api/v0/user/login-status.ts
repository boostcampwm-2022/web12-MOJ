import { NextApiRequest, NextApiResponse } from 'next';

function mockHandler(req: NextApiRequest, res: NextApiResponse) {
  const result = [
    { status: 'logged in', userName: 'hyoseok' },
    { status: 'logged out' },
  ];
  const rnd = Math.floor(Math.random() * 2);

  return res.status(rnd === 0 ? 200 : 401).json(result[rnd]);
}

export default mockHandler;
