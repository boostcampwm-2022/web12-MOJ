import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const problems = Array.from({ length: 20 }, (_, i) => {
      return {
        id: i + 1,
        title: `${i + 1}번째 문제 - 알고리즘 망령 효석이`,
        rate: 50.5 + i,
      };
    });

    const pageCount = 8;
    const currentPage = 1;

    res.status(200).json({
      pageCount: pageCount,
      problems: problems,
      currentPage: currentPage,
    });
  } else {
    res.status(404);
  }
}
