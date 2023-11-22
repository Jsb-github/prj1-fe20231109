import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../context/LoginProvider";
import axios from "axios";
import { DeleteIcon, EditIcon, NotAllowedIcon } from "@chakra-ui/icons";

export function CommentItem({ comment, onDeleteModalOpen, setIsSubmitting }) {
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
        <Text fontSize="xs">{comment.ago}</Text>
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
                variant={"ghost"}
                size="xs"
                colorScheme="gray"
                onClick={() => setIsEditing(false)}
              >
                <NotAllowedIcon />
              </Button>
            )}
            <Button
              variant={"ghost"}
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
