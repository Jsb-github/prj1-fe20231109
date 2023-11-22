import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormControl,
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
  Text,
  Textarea,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../context/LoginProvider";
import { CommentContainer } from "../../component/comment/CommentContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";

function LikeContainer({ like, onClick }) {
  const { isAuthenticated } = useContext(LoginContext);
  if (like == null) {
    return <Spinner />;
  }
  return (
    <Flex gap={2}>
      <Heading size="xl">{like.countLike}</Heading>
      <Tooltip isDisabled={isAuthenticated()} hasArrow label={"로그인 하세요"}>
        <Button variant="ghost" size="xl" onClick={onClick}>
          {like.like && (
            <Text>
              <FontAwesomeIcon size="xl" icon={fullHeart} />
            </Text>
          )}
          {like.like || (
            <Text>
              <FontAwesomeIcon size="xl" icon={emptyHeart} />
            </Text>
          )}
        </Button>
      </Tooltip>
    </Flex>
  );
}

export function BoardView() {
  const [board, setBoard] = useState(null);
  const [like, setLike] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id } = useParams();
  const { hasAccess, isAdmin } = useContext(LoginContext);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/board/id/${id}`)
      .then((response) => setBoard(response.data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    axios
      .get("/api/like/board/" + id)
      .then((response) => setLike(response.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }
  function handleDelete() {
    axios
      .delete(`/api/board/remove/${id}`)
      .then((response) => {
        toast({
          description: id + "번 게시물이 삭제되었습니다.",
          status: "success",
          duration: 1000,
        });
        navigate("/");
      })
      .catch((error) => {
        toast({
          description: "삭제 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => onClose());
  }

  function handleLike() {
    axios
      .post("/api/like", { boardId: board.id })
      .then((response) => setLike(response.data))
      .catch(() => console.log("실패"))
      .finally(() => console.log("끝"));
  }

  return (
    <Box>
      <Center>
        <Card w={"lg"}>
          <CardHeader>
            <Flex justifyContent="space-between">
              <Heading size="xl">{board.id}번 보기</Heading>
              <LikeContainer like={like} onClick={handleLike} />
            </Flex>
          </CardHeader>

          <CardBody>
            {/* FormControl*3>FormLabel*3 */}

            <FormControl mb={5}>
              <FormLabel>제목</FormLabel>
              <Input value={board.title} readOnly />
            </FormControl>

            {board.files.map((file) => (
              <Card key={file.id} mb={5}>
                <CardBody>
                  <Image
                    width="100%"
                    height="300px"
                    src={file.url}
                    alt={file.fileName}
                  />
                </CardBody>
              </Card>
            ))}

            <FormControl mb={5}>
              <FormLabel>본문</FormLabel>
              <Textarea h={"sm"} value={board.content} readOnly />
            </FormControl>
            {/*이미지 출력*/}

            <FormControl mb={5}>
              <FormLabel>닉네임</FormLabel>
              <Input value={board.nickName} readOnly />
            </FormControl>

            <FormControl mb={5}>
              <FormLabel>작성일시</FormLabel>
              <Input value={board.inserted} readOnly />
            </FormControl>
          </CardBody>

          <CardFooter>
            {(hasAccess(board.writer) || isAdmin()) && (
              <Flex gap={2}>
                <Button
                  colorScheme="purple"
                  onClick={() => navigate(`/edit/${id}`)}
                >
                  수정
                </Button>
                <Button colorScheme="red" onClick={onOpen}>
                  삭제
                </Button>
              </Flex>
            )}
          </CardFooter>
        </Card>
      </Center>
      {/* 삭제 모달  */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까 ?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleDelete} colorScheme="red">
              삭제하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <CommentContainer boardId={id} />
    </Box>
  );
}
