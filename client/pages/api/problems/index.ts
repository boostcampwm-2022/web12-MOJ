import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const { page } = req.query;
    let _page = 1;

    if (!page) _page = 1;
    else if (Array.isArray(page)) _page = 1;
    else _page = +page;

    const problems = Array.from({ length: 20 }, (_, i) => {
      return {
        id: (_page - 1) * 20 + i + 1,
        title: `${(_page - 1) * 20 + i + 1}번째 문제 - 알고리즘 망령 효석이`,
        rate: 50.5 + i,
        datetime: new Date().getTime(),
        state: Math.floor(Math.random() * 2),
      };
    });

    const pageCount = 8;
    const currentPage = _page;

    res.status(200).json({
      pageCount: pageCount,
      problems: problems,
      currentPage: currentPage,
    });
  } else {
    res.status(404);
  }
}
