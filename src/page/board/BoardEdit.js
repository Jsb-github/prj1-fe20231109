import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Divider,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Switch,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function BoardEdit(props) {
  const [board, updateBoard] = useImmer(null);
  const [uploadFiles, setUploadFiles] = useState(null);
  const [removeFileIds, setRemoveFileIds] = useState([]);
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
      .putForm(`/api/board/update`, {
        id: board.id,
        title: board.title,
        content: board.content,
        removeFileIds,
        uploadFiles,
      })

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
            description: "수정 권한이 없습니다..",
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

  function handleRemoveFileSwitch(e) {
    if (e.target.checked) {
      // removeFileIds에 추가
      setRemoveFileIds([...removeFileIds, e.target.value]);
    } else {
      setRemoveFileIds(removeFileIds.filter((item) => item !== e.target.value));
      // removeFileIds에서 삭제
    }
  }

  return (
    <Center>
      <Card w={"lg"}>
        <CardHeader>
          <Heading>{board.id}번 수정하기</Heading>
        </CardHeader>

        <CardBody>
          <FormControl mb={5}>
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

          <FormControl mb={5}>
            <FormLabel>본문</FormLabel>
            <Textarea
              value={board.content}
              onChange={(e) =>
                updateBoard((draft) => {
                  draft.content = e.target.value;
                })
              }
            />
          </FormControl>

          {/*이미지 출력*/}
          {board.files.length > 0 &&
            board.files.map((file) => (
              <Card key={file.id} my={5}>
                <CardBody height="300px">
                  <Image
                    width="100%"
                    height="100%"
                    src={file.url}
                    alt={file.fileName}
                  />
                </CardBody>
                <Divider />
                <CardFooter>
                  <FormControl display="flex" alignItems="center" gap={2}>
                    <FormLabel m={0} p={0}>
                      <FontAwesomeIcon color="red" icon={faTrashCan} />
                    </FormLabel>
                    <Switch
                      value={file.id}
                      colorScheme="red"
                      onChange={handleRemoveFileSwitch}
                    />
                  </FormControl>
                </CardFooter>
              </Card>
            ))}

          <FormControl mb={5}>
            <FormLabel>이미지</FormLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setUploadFiles(e.target.files)}
            />
            <FormHelperText>
              한 개 파일은 1MB 이내, 총 용량은 10MB 이내로 첨부하세요.
            </FormHelperText>
          </FormControl>
        </CardBody>
        <CardFooter>
          <Flex gap={2}>
            <Button colorScheme="blue" onClick={onOpen}>
              수정
            </Button>
            <Button onClick={() => navigate(-1)}>취소</Button>
          </Flex>
        </CardFooter>
      </Card>
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
    </Center>
  );
}

export default BoardEdit;
