import List from '../List';
import { css } from '@emotion/react';

interface StatusListProps {
  status: StatusSummary;
}

function StatusList({ status }: StatusListProps) {
  return (
    <>
      <List
        isShowPaginator={false}
        pageCount={1}
        currentPage={1}
        data={[status]}
        mapper={[
          { path: 'id', name: '제출 번호', weight: 1 },
          {
            path: 'user',
            name: 'ID',
            weight: 1,
            style: {
              row: css`
                color: #3949ab;
              `,
            },
          },
          {
            path: 'title',
            name: '문제',
            weight: 3,
            style: {
              row: css`
                color: #3949ab;
              `,
            },
          },
          {
            path: 'state',
            name: '결과',
            weight: 1,
            style: {
              row: (row: StatusSummary) => {
                if (row.state === '정답') {
                  return css`
                    color: #4caf50;
                  `;
                }
                if (row.state === '오답') {
                  return css`
                    color: #f44336;
                  `;
                }
              },
            },
          },
          {
            path: 'time',
            name: '시간',
            weight: 1,
            format: (value: number) => `${value ?? '--'} ms`,
          },
          {
            path: 'datetime',
            name: '제출시각',
            weight: 1,
            format: (value: number) => {
              const date = new Date(value);
              return (
                <>
                  {date.toLocaleDateString()}
                  <br />
                  {date.toLocaleTimeString()}
                </>
              );
            },
            style: {
              row: css`
                font-size: 12px;
              `,
            },
          },
        ]}
        rowHref={(status: StatusSummary) => `/status/${status.id}`}
        pageHref={(page: number) => `/status?page=${page}`}
      />
    </>
  );
}

export default StatusList;
