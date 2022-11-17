import { NextApiRequest, NextApiResponse } from 'next';
import { problems } from '../../../../mock/problems';

function mockHandler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (req.method === 'PATCH') {
    const index = problems.findIndex((problem) => problem.id === id);
    if (index === -1)
      return res.status(404).json({ message: '그런문제 없어요,' });

    problems[index].visible = !problems[index].visible;

    return res.status(200).json({});
  }
}

export default mockHandler;
