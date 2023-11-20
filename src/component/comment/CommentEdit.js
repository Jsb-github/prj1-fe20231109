import {
  Box,
  Button,
  Spinner,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { useImmer } from "use-immer";

export function CommentEdit() {
  const { id } = useParams();
  const [commentEdit, updateComment] = useImmer(null);
  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`/api/comment/id/${id}`)
      .then((response) => updateComment(response.data));
  }, []);

  function handleEdit() {
    axios.put(`/api/comment/update`, commentEdit).then((response) => {
      toast({
        description: "수정 성공 했습니다",
        status: "success",
      });
      navigate("/");
    });
  }
  if (commentEdit === null) {
    return <Spinner />;
  }
  return (
    <Box>
      <Text>{id}번수정하기</Text>
      <Textarea
        value={commentEdit.comment}
        onChange={(e) =>
          updateComment((draft) => {
            draft.comment = e.target.value;
          })
        }
      />
      <Button onClick={handleEdit}>수정하기</Button>
    </Box>
  );
}
