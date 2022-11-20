import { css } from '@emotion/react';

const modalStyle = {
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

export default modalStyle;
