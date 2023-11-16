import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { LoginContext } from "./LoginProvider";
import { DeleteIcon, EditIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

function CommentForm({ boardId, isSubmitting, onSubmit }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button isDisabled={isSubmitting} onClick={handleSubmit}>
        쓰기
      </Button>
    </Box>
  );
}

function CommentList({
  commentList,
  onDeleteModalOpen,
  isSubmitting,
  setIsSubmitting,
}) {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">댓글 리스트</Heading>
      </CardHeader>
      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          {commentList.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDeleteModalOpen={onDeleteModalOpen}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
            />
          ))}
        </Stack>
      </CardBody>
    </Card>
  );
}

function CommentItem({ comment, onDeleteModalOpen, setIsSubmitting }) {
  const [isEditing, setIsEditing] = useState(false);
  const [commentEdited, setCommentEdited] = useState(comment.comment);
  const toast = useToast();

  const { hasAccess, isAdmin } = useContext(LoginContext);
  function handleSubmit() {
    // TODO : 댓글 list refesh
    // TODO : textarea 닫기
    // TODO : 응답 코드에 따른 기능들 추가
    setIsSubmitting(true);
    axios
      .put(`/api/comment/edit`, { id: comment.id, comment: commentEdited })
      .then((response) => {
        toast({
          description: "댓글 수정 성공 했습니다",
          status: "success",
        });
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "warning",
          });
        } else if (error.response.status === 400) {
          toast({
            description: "입력값을 확인해주세요",
            status: "warning",
          });
        } else {
          toast({
            description: "서버에 문제가 발생했씁니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        setIsEditing(false);
        setIsSubmitting(false);
      });
  }

  return (
    <Box>
      <Flex justifyContent="space-between">
        <Heading size="xs">{comment.nickName}</Heading>
        <Text fontSize="xs">{comment.inserted}</Text>
      </Flex>
      <Flex justifyContent="space-between" alignItems="center">
        <Box flex={1}>
          {isEditing || (
            <Text sx={{ whiteSpace: "pre-wrap" }} pt="2" fontSize="sm">
              {comment.comment}
            </Text>
          )}

          {isEditing && (
            <Box>
              <Textarea
                value={commentEdited}
                onChange={(e) => setCommentEdited(e.target.value)}
              />
              <Button colorScheme="blue" onClick={handleSubmit}>
                저장
              </Button>
            </Box>
          )}
        </Box>

        {(hasAccess(comment.memberId) || isAdmin()) && (
          <Box>
            {isEditing || (
              <Button
                size="xs"
                colorScheme="purple"
                onClick={() => setIsEditing(true)}
              >
                <EditIcon />
              </Button>
            )}
            {isEditing && (
              <Button
                size="xs"
                colorScheme="gray"
                onClick={() => setIsEditing(false)}
              >
                <NotAllowedIcon />
              </Button>
            )}
            <Button
              colorScheme="red"
              size="xs"
              onClick={() => onDeleteModalOpen(comment.id)}
            >
              <DeleteIcon />
            </Button>
          </Box>
        )}
      </Flex>
    </Box>
  );
}

export function CommentContainer({ boardId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [id, setId] = useState(0);
  // useRef : 컴포넌트에서 임시로 값을 저장하는 용도로 사용
  //
  const commentIdRef = useRef(0);
  const [commentList, setCommentList] = useState([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const { isAuthenticated } = useContext(LoginContext);

  function handleSubmit(comment) {
    setIsSubmitting(true);
    axios
      .post("/api/comment/add", comment)
      .then(() => {
        toast({
          description: "댓글 작성 등록되었습니다.",
          status: "success",
        });
      })
      .catch((error) => {
        if (error.response.status === 400) {
          toast({
            description: "잘못된 요청입니다.",
            status: "warning",
          });
        } else if (error.response.status === 401) {
          toast({
            description: "로그인후 이용해주세요..",
            status: "warning",
          });
        } else {
          toast({
            description: "서버에서 문제가 발생했습니다",
            status: "error",
          });
        }
      })
      .finally(() => setIsSubmitting(false));
  }
  function handleDelete() {
    setIsSubmitting(true);
    // console.log(id + "번 댓글 삭제");
    //  TODO : 모달,then catch finally
    axios
      .delete(`/api/comment/${commentIdRef.current}`)
      .then(() =>
        toast({
          description: "댓글 삭제 성공",
          status: "success",
        }),
      )
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "권한이 없습니다.",
            status: "warning",
          });
        } else {
          toast({
            description: "서버에서 문제가 발생했습니다.",
            status: "error",
          });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
        onClose();
      });
  }

  useEffect(() => {
    if (!isSubmitting) {
      const params = new URLSearchParams();
      params.set("id", boardId);
      axios
        .get(`/api/comment/list?${params}`)
        .then((response) => setCommentList(response.data));
    }
  }, [isSubmitting]);

  function handleDeleteModalOpen(id) {
    // id를 어딘가 저장
    // setId(id);
    commentIdRef.current = id;
    // 모달 열기
    onOpen();
  }

  return (
    <Box>
      {isAuthenticated() && (
        <CommentForm
          boardId={boardId}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      )}

      <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        commentList={commentList}
        onDeleteModalOpen={handleDeleteModalOpen}
      />

      {/* 댓글 삭제 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제 하시겠습니까 ?</ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button
              isDisabled={isSubmitting}
              onClick={handleDelete}
              colorScheme="red"
            >
              삭제하기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
