import React, { useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";

function BoardEdit(props) {
  const [board, updateBoard] = useImmer(null);

  // /edit/:id
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/api/board/id/${id}`)
      .then((response) => updateBoard(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input value={board.title} />
      </FormControl>
      <FormControl>
        <FormLabel>본문</FormLabel>
        <Input value={board.content} />
      </FormControl>
      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input value={board.writer} />
      </FormControl>
    </Box>
  );
}

export default BoardEdit;
