import { ReactNode } from 'react';
import ReactModal, { Props } from 'react-modal';

import useLockBodyScroll from '../../hooks/useLockBodyScroll';

interface ModalProps extends Props {
  children: ReactNode;
  hasCloseButton?: boolean;
  title?: string;
  customPadding?: string;
}
const Modal = ({
  children,
  isOpen,
  className = 'react-modal-content',
  overlayClassName = 'react-modal-overlay',
  onRequestClose,
  ...rest
}: ModalProps) => {
  useLockBodyScroll(isOpen);

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName={overlayClassName}
      className={className}
      onRequestClose={onRequestClose}
      style={{
        content: {
          maxWidth: 'max-content',
          width: '100%',
        },
      }}
      {...rest}
    >
      <div className="w-full bg-gray-800 rounded-lg p-8 border-4 border-red-white">
        {children}
      </div>
    </ReactModal>
  );
};

export default Modal;
