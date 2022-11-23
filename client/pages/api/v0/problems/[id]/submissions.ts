import { NextApiRequest, NextApiResponse } from 'next';

function mockHandler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).end();
}

export default mockHandler;
