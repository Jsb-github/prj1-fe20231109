import React, { useState } from "react";
import { Box, Button, Center, Flex, Heading, Textarea } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export function CommentForm({
  boardId,
  isSubmitting,
  onSubmit,
  comment,
  setComment,
}) {
  function handleSubmit() {
    onSubmit({ boardId, comment });
  }

  return (
    <Box>
      <Flex>
        <Textarea
          placeholder="댓글을 작성해주세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Center isDisabled={isSubmitting} onClick={handleSubmit}>
          <Button p={5} h={"full"}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </Center>
      </Flex>
    </Box>
  );
}
