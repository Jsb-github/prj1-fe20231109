import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import axios from "axios";

function MemberLogin(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    axios
      .post("/api/member/login", { id, password })
      .then(console.log("성공"))
      .catch((err) => console.log(err))
      .finally(console.log("끝"));
  }

  return (
    <Box>
      <h1>로그인</h1>
      <FormControl>
        <FormLabel>아이디</FormLabel>
        <Input value={id} onChange={(e) => setId(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>비밀번호</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button colorScheme="blue" onClick={handleLogin}>
        로그인
      </Button>
    </Box>
  );
}

export default MemberLogin;
