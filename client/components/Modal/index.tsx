import { css, Global } from '@emotion/react';
import React from 'react';
import modal from '../../styles/modal';
import { CloseSvg } from '../svgs';

interface ModalCloseState {
  isShowModal: false;
}

interface ModalOpenstate<T> {
  isShowModal: true;
  data: T;
}

interface ModalProps<T> {
  isShow: boolean;
  data: T;
  render: (data: T) => React.ReactNode;
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function Modal<T>({ data, render, setIsShowModal, isShow }: ModalProps<T>) {
  if (!isShow) return <></>;

  return (
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
            onClick={() => setIsShowModal(false)}
          >
            <CloseSvg />
          </div>
          <div css={modal.modalWrapper}>{render(data)}</div>
        </div>
      </div>
    </>
  );
}

export default Modal;
