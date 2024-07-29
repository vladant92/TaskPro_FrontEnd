import styled from 'styled-components';

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
`;

export const ModalTitle = styled.h2`
  margin-top: 0;
`;

export const ModalContent = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const ModalButton = styled.button`
  padding: 10px 20px;
  margin: 10px;
  border-radius: 5px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:first-child {
    background-color: #dc3545;

    &:hover {
      background-color: #c82333;
    }
  }
`;
