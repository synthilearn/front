import { Modal as AntdModal } from 'antd';
import styled from 'styled-components';

interface IProps {
  width: number;
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  okText: string;
  okLoading: boolean;
  onOk: () => void;
  okDisabled: boolean;
  title: string;
}
const Modal = ({
  children,
  okText,
  okLoading,
  onOk,
  okDisabled,
  open,
  title,
  onClose,
  width,
}: IProps) => {
  return (
    <AntdModal
      title={title}
      width={width}
      centered
      open={open}
      destroyOnClose
      cancelText={'Отмена'}
      onCancel={onClose}
      okText={okText}
      okButtonProps={{
        loading: okLoading,
        disabled: okDisabled,
        type: 'default',
      }}
      onOk={onOk}
    >
      <ModalContentWrapper>{children}</ModalContentWrapper>
    </AntdModal>
  );
};

export default Modal;

const ModalContentWrapper = styled.div`
  padding: 30px 0;
`;
