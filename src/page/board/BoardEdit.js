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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";

function BoardEdit(props) {
  const [board, updateBoard] = useImmer(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  // /edit/:id
  const { id } = useParams();

  const navigate = useNavigate();

  const toast = useToast();

  useEffect(() => {
    axios
      .get(`/api/board/id/${id}`)
      .then((response) => updateBoard(response.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleUpdate() {
    axios
      .put(`/api/board/update`, board)
      .then((response) => {
        toast({
          description: "수정 성공 했습니다",
          status: "success",
        });
        navigate(-1);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            description: "수정 내용 확인해주세요",
            status: "error",
          });
        } else if (err.response.status === 401) {
          toast({
            description: "로그인후 이용해주세요.",
            status: "error",
          });
        } else if (err.response.status === 403) {
          toast({
            description: "다른 사람 글은 수정할수 없습니다..",
            status: "error",
          });
        } else {
          toast({
            description: "수정 중 에러가 발생했습니다.",
            status: "error",
          });
        }
      });
  }

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>{board.id}번 수정하기</h1>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input
          value={board.title}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.title = e.target.value;
            })
          }
        />
      </FormControl>
      <FormControl>
        <FormLabel>본문</FormLabel>
        <Input
          value={board.content}
          onChange={(e) =>
            updateBoard((draft) => {
              draft.content = e.target.value;
            })
          }
        />
      </FormControl>

      <Button colorScheme="blue" onClick={onOpen}>
        수정
      </Button>

      {/*  수정 모달*/}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정 확인</ModalHeader>
          <ModalCloseButton onClick={() => navigate(-1)} />
          <ModalBody>수정 하시겠습니까 ? </ModalBody>
          <ModalFooter>
            {/* navigate(-1) : 이전 경로로 이동 */}
            <Button onClick={() => navigate(-1)}>닫기</Button>
            <Button onClick={handleUpdate} colorScheme="blue">
              수정하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default BoardEdit;
