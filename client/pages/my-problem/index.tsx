import React from 'react';
import Router, { useRouter } from 'next/router';
import axiosInstance from '../../axios';
import List from '../../components/List';
import Button from '../../components/common/Button';
import { css, Global } from '@emotion/react';
import {
  AddFileSvg,
  DeleteSvg,
  EditSvg,
  CloseSvg,
} from '../../components/svgs';
import Toggle from '../../components/svgs/toggle';
import Link from 'next/link';
import style from '../../styles/style';
import modal from '../../styles/modal';

interface MyProblemSummary {
  id: number;
  title: string;
  datetime: number;
  visible: number;
}

interface StatusListResponseData {
  pageCount: number;
  currentPage: number;
  problems: MyProblemSummary[];
}

interface ModalCloseState {
  isShowModal: false;
}

interface ModalOpenstate {
  isShowModal: true;
  title: string;
  id: number;
}

function MyProblem() {
  const router = useRouter();

  const [myProblems, setMyProblems] =
    React.useState<StatusListResponseData | null>(null);

  const [isShowModal, setIsShowModal] = React.useState<
    ModalCloseState | ModalOpenstate
  >({ isShowModal: false });

  function getSafePage() {
    if (!router.isReady) return;

    const page = router.query.page;

    let _page = 1;
    if (!page) _page = 1;
    else if (Array.isArray(page)) _page = 1;
    else _page = +page;

    return _page;
  }

  async function fetchMyProblemList(page: number) {
    const { data } = await axiosInstance.get(`/api/problems?page=${page}`);

    setMyProblems(data);
  }

  React.useEffect(() => {
    if (!router.isReady) return;

    const page = router.query.page;

    let _page = 1;
    if (!page) _page = 1;
    else if (Array.isArray(page)) _page = 1;
    else _page = +page;

    fetchMyProblemList(_page);
  }, [router.isReady, router.query.page]);

  return (
    <>
      {isShowModal.isShowModal ? (
        <>
          <Global
            styles={css`
              body {
                overflow: hidden;
              }
            `}
          />
          <div css={modal.modalDimmed}>
            <div css={modal.modal}>
              <div
                css={modal.modalCloseButton}
                onClick={() => setIsShowModal({ isShowModal: false })}
              >
                <CloseSvg />
              </div>
              <div css={modal.modalWrapper}>
                <div css={modal.modalTitle}>{isShowModal.title}</div>
                <div css={modal.modalContent}>
                  문제를 정말 삭제하시겠습니까?
                </div>
                <div css={modal.modalActionButtonContainer}>
                  <Button
                    onClick={() => setIsShowModal({ isShowModal: false })}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={async () => {
                      const result = await axiosInstance.delete(
                        `/api/problems/${isShowModal.id}`,
                      );

                      if (result.status === 200) {
                        const page = getSafePage();
                        if (!page) return;
                        fetchMyProblemList(page);
                        setIsShowModal({ isShowModal: false });
                      } else {
                        // 에러처리
                      }
                    }}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : undefined}
      <div css={style.relativeContainer}>
        <div css={style.header}>
          <div css={style.title}>출제 리스트</div>
          <Button onClick={() => Router.push('/my-problem/new')}>+ 추가</Button>
        </div>
        {myProblems === null ? (
          <div>로딩중</div>
        ) : (
          <>
            <List
              pageCount={myProblems.pageCount}
              currentPage={myProblems.currentPage}
              data={myProblems.problems}
              mapper={[
                { path: 'id', name: '문제 번호', weight: 1 },
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
                  path: 'datetime',
                  name: '출제날짜',
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
                {
                  path: 'id',
                  name: '편집',
                  weight: 0.5,
                  style: {
                    all: css`
                      text-align: center;
                    `,
                  },
                  format: (value: number) => (
                    <Link href={`/my-problem/edit/${value}`}>
                      <EditSvg />
                    </Link>
                  ),
                },
                {
                  path: undefined,
                  name: '삭제',
                  weight: 0.5,
                  style: {
                    all: css`
                      text-align: center;
                    `,
                  },
                  onclick: (e, row: MyProblemSummary) => {
                    e.preventDefault();

                    setIsShowModal({
                      isShowModal: true,
                      title: row.title,
                      id: row.id,
                    });
                  },
                  format: () => <DeleteSvg />,
                },
                {
                  path: 'id',
                  name: 'TC 추가',
                  weight: 0.5,
                  style: {
                    all: css`
                      text-align: center;
                    `,
                  },
                  format: (value: number) => (
                    <Link href={`/my-problem/tc/${value}`}>
                      <AddFileSvg />
                    </Link>
                  ),
                },
                {
                  path: 'visible',
                  name: '공개/비공개',
                  weight: 0.5,
                  style: {
                    all: css`
                      text-align: center;
                    `,
                  },
                  onclick: async (e, row: MyProblemSummary) => {
                    e.preventDefault();
                    const result = await axiosInstance.patch(
                      `/api/problems/${row.id}/visible`,
                    );
                    if (result.status === 200) {
                      const page = getSafePage();
                      if (!page) return;
                      fetchMyProblemList(page);
                    } else {
                      // 에러처리
                    }
                  },
                  format: (visible: boolean) =>
                    visible ? <Toggle.Off /> : <Toggle.On />,
                },
              ]}
              rowHref={(status: MyProblemSummary) =>
                `/my-problem/edit/${status.id}`
              }
              pageHref={(page: number) => `/my-problem?page=${page}`}
            />
          </>
        )}
      </div>
    </>
  );
}

export default MyProblem;
