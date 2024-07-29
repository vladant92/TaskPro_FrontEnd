import React from 'react';
import {
  ModalBackground,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalButton,
} from './LogOutModal.styled';

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <ModalBackground>
      <ModalContainer>
        <ModalTitle>Confirm Logout</ModalTitle>
        <ModalContent>Are you sure you want to log out?</ModalContent>
        <div>
          <ModalButton onClick={onConfirm}>Yes</ModalButton>
          <ModalButton onClick={onClose}>No</ModalButton>
        </div>
      </ModalContainer>
    </ModalBackground>
  );
};

export default LogoutConfirmationModal;
