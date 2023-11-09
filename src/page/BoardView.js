import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, FormControl, FormLabel, Input, Spinner } from "@chakra-ui/react";

export function BoardView() {
  const [board, setBoard] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/api/board/id/${id}`)
      .then((response) => setBoard(response.data));
  }, []);
  if (board === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>{board.id}번 보기</h1>
      {/* FormControl*3>FormLabel*3 */}
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input value={board.title} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>본문</FormLabel>
        <Input value={board.content} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>작성자</FormLabel>
        <Input value={board.writer} readOnly />
      </FormControl>
      <FormControl>
        <FormLabel>작성일시</FormLabel>
        <Input value={board.inserted} readOnly />
      </FormControl>
    </Box>
  );
}
