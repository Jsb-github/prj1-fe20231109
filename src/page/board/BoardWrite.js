import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // const [board, setBoard] = useState({ title: "", content: "", writer: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  function handleSubmit() {
    setIsSubmitting(true);

    axios
      .post("/api/board/add", { title, content })
      .then(() => {
        toast({
          description: "새글이 저장되었습니다.",
          status: "success",
          duration: 1000,
        });
        navigate("/");
      })
      .catch((error) => {
        console.log(error.response.status);
        if (error.response.status === 400) {
          toast({
            description: "작성한 내용을 확인해주세요.",
            status: "error",
          });
        } else if (error.response.status === 401) {
          toast({
            description: "로그인후 이용해주세요.",
            status: "error",
          });
        } else {
          toast({
            description: "저장 증에 문제가 발생했습니다.",
            status: "error",
          });
        }
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <Box>
      <h1>게시몰 작성</h1>
      <Box>
        <FormControl>
          <FormLabel>제목 </FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>본문</FormLabel>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></Textarea>
        </FormControl>
        <Button color="blue" onClick={handleSubmit} isDisabled={isSubmitting}>
          저장
        </Button>
      </Box>
    </Box>
  );
}
