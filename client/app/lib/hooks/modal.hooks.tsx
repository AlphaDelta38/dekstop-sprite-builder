"use client";

import { useState } from "react";
import { Box, Modal } from "@mui/material";

function useModal() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const ModalWrapper = ({ children }: { children: React.ReactNode }) => (
    <Modal open={isOpen} onClose={closeModal} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ p: 2, bgcolor: "white" }}>{children}</Box>
    </Modal>
  );

  return { openModal, closeModal, isOpen, Modal: ModalWrapper };
}

export default useModal;