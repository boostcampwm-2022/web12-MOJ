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

const style = {
  container: css`
    margin: 64px 20%;
    position: relative;
  `,
  title: css`
    font-size: 32px;
    font-weight: bold;
    margin: 42px 12px;
  `,
  titleContainer: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  modalDimmed: css`
    background-color: rgba(196, 196, 196, 0.5);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    position: fixed;
    z-index: 100;
  `,
  modal: css`
    position: absolute;
    top: calc(50vh - 150px);
    left: calc(50vw - 285px);
    width: 570px;
    height: 300px;
    border-radius: 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    background-color: #ffffff;
  `,
  modalCloseButton: css`
    text-align: right;
    padding: 12px;
    & > svg {
      cursor: pointer;
    }
  `,
  modalActionButtonContainer: css`
    display: flex;
    justify-content: center;
  `,
  modalTitle: css`
    color: #3949ab;
    font-size: 24px;
    margin-bottom: 30px;
  `,
  modalContent: css`
    color: black;
    font-size: 20px;
    margin-bottom: 50px;
  `,
  modalWrapper: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 25px;
  `,
};

interface MyProblemSummary {
  id: number;
  title: string;
  datetime: number;
  state: number;
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

  React.useEffect(() => {
    if (!router.isReady) return;

    async function fetchMyProblemList() {
      const page = router.query.page;
      const userName = 'hyoseok0604';

      let _page = 1;
      if (!page) _page = 1;
      else if (Array.isArray(page)) _page = 1;
      else _page = +page;

      const { data } = await axiosInstance.get(`/api/problems?page=${_page}`);
      setMyProblems(data);
    }

    fetchMyProblemList();
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
          <div css={style.modalDimmed}>
            <div css={style.modal}>
              <div
                css={style.modalCloseButton}
                onClick={() => setIsShowModal({ isShowModal: false })}
              >
                <CloseSvg />
              </div>
              <div css={style.modalWrapper}>
                <div css={style.modalTitle}>{isShowModal.title}</div>
                <div css={style.modalContent}>
                  문제를 정말 삭제하시겠습니까?
                </div>
                <div css={style.modalActionButtonContainer}>
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

                      if (result.status === 200) Router.reload();
                      else {
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
      <div css={style.container}>
        <div css={style.titleContainer}>
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
                  path: 'state',
                  name: '공개/비공개',
                  weight: 0.5,
                  style: {
                    all: css`
                      text-align: center;
                    `,
                  },
                  format: (state: number) =>
                    state === 0 ? <Toggle.Off /> : <Toggle.On />,
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
