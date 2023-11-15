import { Box, Button, Input, Spinner, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

function CommentForm({ boardId }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    axios.post("/api/comment/add", {
      boardId,
      comment,
    });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button onClick={handleSubmit}>쓰기</Button>
    </Box>
  );
}

function CommentList({ boardId }) {
  const [commentList, setCommentList] = useState("null");
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("id",boardId)
    axios
      .get(`api/comment/list?${params}`)
      .then((response) => setCommentList(response.data));
  }, []);

  if (commentList === null) {
    return <Spinner />;
  }

  return (
    <Box>
      {commentList.map}
   </Box>
  );
}

export function CommentContainer({ boardId }) {
  return (
    <Box>
      <CommentForm boardId={boardId} />
      <CommentList boardId={boardId} />
    </Box>
  );
}
