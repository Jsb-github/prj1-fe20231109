import {
  Box,
  Button,
  Center,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { LoginContext } from "../../context/LoginProvider";

import { CommentForm } from "./CommentForm";
import { CommentList } from "./CommentList";
import { Fa0 } from "react-icons/fa6";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons/faComment";

export function CommentContainer({ boardId, p }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [id, setId] = useState(0);
  // useRef : 컴포넌트에서 임시로 값을 저장하는 용도로 사용
  //
  const commentIdRef = useRef(0);
  const [commentList, setCommentList] = useState([]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const { isAuthenticated } = useContext(LoginContext);
  const [pageInfo, setPageInfo] = useState(null);
  const [nowPage, setNowPage] = useState(1);
  const [comment, setComment] = useState("");
  function handleSubmit(comment) {
    setIsSubmitting(true);
    axios
      .post("/api/comment/add", comment)
      .then(() => {
        toast({
          description: "댓글 작성 등록되었습니다.",
          status: "success",
        });
        setComment("");
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
        .get(`/api/comment/list?${params}&&p=${nowPage}`)
        .then((response) => {
          setCommentList(response.data.commentList);
          setPageInfo(response.data.pageInfo);
        });
    }
  }, [isSubmitting, nowPage]);

  function handleDeleteModalOpen(id) {
    // id를 어딘가 저장
    // setId(id);
    commentIdRef.current = id;
    // 모달 열기
    onOpen();
  }

  return (
    <Box>
      <Center mt={10}>
        <Box w={"lg"}>
          <Heading>
            <FontAwesomeIcon icon={faComment} />
            COMMENTS
          </Heading>
        </Box>
      </Center>
      {isAuthenticated() && (
        <Center mt={10}>
          <Box w={"lg"}>
            <CommentForm
              boardId={boardId}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
              setComment={setComment}
              comment={comment}
            />
          </Box>
        </Center>
      )}

      <CommentList
        boardId={boardId}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        commentList={commentList}
        onDeleteModalOpen={handleDeleteModalOpen}
        pageInfo={pageInfo}
        setNowPage={setNowPage}
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
