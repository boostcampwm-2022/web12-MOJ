import { NextApiRequest, NextApiResponse } from 'next';
import { problems } from '../../../mock/problems';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { page } = req.query;
    let _page = 1;

    const limit = 20;

    if (!page) _page = 1;
    else if (Array.isArray(page)) _page = 1;
    else _page = +page;

    const pageCount = Math.ceil(problems.length / limit);
    const currentPage = _page;

    const currentPageProblems = problems.slice(
      (_page - 1) * limit,
      _page * limit,
    );

    res.status(200).json({
      pageCount: pageCount,
      problems: currentPageProblems,
      currentPage: currentPage,
    });
  } else {
    res.status(404);
  }
}
