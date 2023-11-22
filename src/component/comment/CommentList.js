import {
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  Stack,
  StackDivider,
} from "@chakra-ui/react";
import { CommentItem } from "./CommentItem";

import React from "react";

import { CommentPagination } from "./CommentPagination";

export function CommentList({
  commentList,
  onDeleteModalOpen,
  isSubmitting,
  setIsSubmitting,
  pageInfo,
  boardId,
  setNowPage,
}) {
  return (
    <Center>
      <Card w={"lg"}>
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
          {commentList.length > 0 && (
            <CommentPagination
              pageInfo={pageInfo}
              boardId={boardId}
              setNowPage={setNowPage}
            />
            // <Pagination pageInfo={pageInfo} setNowPage={setNowPage} />
          )}
        </CardBody>
      </Card>
    </Center>
  );
}
