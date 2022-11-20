import { css } from '@emotion/react';

const newStyle = {
  // 전체 컨테이너
  container: css`
    margin: 64px 20%;
    height: 100%;
  `,
  // relaive가 들어간 전체 컨테이너
  relativeContainer: css`
    margin: 64px 20%;
    padding-bottom: 64px;
    position: relative;
  `,
  // 최상단에서 제목과 버튼을 감싸는 컨테이너
  header: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  // 최상단에서 버튼을 제외한 제목 영역을 감싸는 컨테이너
  titleContainer: css`
    display: flex;
    align-items: center;
  `,
  // 페이지마다 들어가는 최상단에 있는 제목
  title: css`
    font-size: 32px;
    font-weight: bold;
    margin: 42px 0;
  `,
  // flex의 하위 요소에서 비율 정할때 사용하는 스타일
  flexWeight: (weight: number) => css`
    flex: ${weight};
  `,
  // 문제 수정 폼에서 할 줄에 여러개 입력 받는 부분
  labelWrapper: css`
    display: flex;
    gap: 24px;
    margin: 12px 0;
  `,
  // 문제 수정 폼에서 라벨 부분
  label: css`
    font-size: 18px;
    font-weight: bold;
    color: #000000;
    margin: 12px 0;
  `,
  input: css`
    all: unset;
    width: 100%;
    box-sizing: border-box;
    background: rgba(217, 217, 217, 0.2);
    border-radius: 10px;
    padding: 7px 16px;
    font-size: 14px;
  `,
  addBtn: css`
    margin-top: 30px;
    display: flex;
    justify-content: flex-end;
  `,
  // 테케 문제 title
  problemTitle: css`
    color: #3949ab;
    margin-left: 12px;
  `,
  // 컨텐츠 밑 하단 버튼 영역
  footer: css`
    display: flex;
    justify-content: flex-end;
    padding: 10px 0px;
  `,
  // 풀이 제출
  problemDetail: css`
    display: flex;
    height: calc(100% - 70px);
    width: 100%;
  `,
  problemViewer: css`
    height: 100%;
    width: 50%;
    border-right: 1px solid #3949ab;
  `,
  codeContainer: css`
    height: calc(100% - 50px);
    width: 100%;
    border-bottom: 1px solid #3949ab;
  `,
  controlPanel: css`
    height: 49px;

    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,
  codeBox: css`
    height: 60%;
    padding: 15px 0;
    border-radius: 8px;
    margin-top: 15px;
    box-shadow: 0px 0px 1.5px 1.5px rgba(0, 0, 0, 0.15);
  `,
};

export default newStyle;
