import { modal } from '../../styles';
import Button from '../common/Button';

interface DeleteProblemModalProps {
  title: string;
  handleCancel: () => void;
  handleDelete: () => void;
}

function DeleteProblemModal({
  title,
  handleDelete,
  handleCancel,
}: DeleteProblemModalProps) {
  return (
    <>
      <div css={modal.modalTitle}>{title}</div>
      <div css={modal.modalContent}>문제를 정말 삭제하시겠습니까?</div>
      <div css={modal.modalActionButtonContainer}>
        <Button style="cancel" minWidth="60px" onClick={handleCancel}>
          취소
        </Button>
        <Button minWidth="60px" onClick={handleDelete}>
          삭제
        </Button>
      </div>
    </>
  );
}

export default DeleteProblemModal;
