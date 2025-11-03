import React from 'react';
import { Modal as BootstrapModal } from 'react-bootstrap';

const Modal = ({ show, onHide, title, children, size = 'lg', footer }) => {
  return (
    <BootstrapModal show={show} onHide={onHide} size={size} centered className="modal-custom">
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{title}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>{children}</BootstrapModal.Body>
      {footer && <BootstrapModal.Footer>{footer}</BootstrapModal.Footer>}
    </BootstrapModal>
  );
};

export default Modal;