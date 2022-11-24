import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { page } = req.query;
    let _page = 1;

    if (!page) _page = 1;
    else if (Array.isArray(page)) _page = 1;
    else _page = +page;

    const status = Array.from({ length: 20 }, (_, i) => {
      return {
        id: (_page - 1) * 20 + i + 1,
        user: 'string',
        title: `${Math.floor(
          Math.random() * 100,
        )}번째 문제 - 알고리즘 망령 효석이`,
        result: Math.floor(Math.random() * 4 + 1),
        time: Math.floor(Math.random() * 150),
        datetime: new Date().getTime(),
      };
    });

    const pageCount = 10;
    const currentPage = _page;

    res.status(200).json({
      pageCount: pageCount,
      currentPage: currentPage,
      status: status,
    });
  } else {
    res.status(404);
  }
}

export default handler;
