import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

function MemberSignup(props) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [idAvailable, setIdAvailable] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const toast = useToast();
  let submitAvailable = false;

  function handleSubmit() {
    axios
      .post("/api/member/signup", { id, password, email })
      .then(() => console.log("good"))
      .catch(() => console.log("err"))
      .finally(() => console.log("done"));
  }

  function handleIdCheck() {
    const searchParams = new URLSearchParams();
    searchParams.set("id", id);
    console.log(searchParams.toString());
    axios
      .get(`/api/member/check?${searchParams.toString()}`)
      .then(() => {
        toast({
          description: "이미 사용 중인 ID입니다.",
          status: "warning",
          colorScheme: "red",
        });
        setIdAvailable(false);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          toast({
            description: "사용 가능한 ID입니다.",
            status: "success",
          });
          setIdAvailable(true);
        }
      });
  }

  function handleEmailChk() {
    const searchParams = new URLSearchParams();
    searchParams.set("email", email);
    console.log(searchParams.toString());
    axios
      .get(`/api/member/check?${searchParams.toString()}`)
      .then(() => {
        toast({
          description: "이미 사용 중인  email입니다.",
          status: "warning",
          colorScheme: "red",
        });
        setEmailAvailable(false);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            description: "사용가능한 email 입니다.",
            status: "success",
          });
        }
        setEmailAvailable(true);
      });
  }

  if (password !== passwordCheck) {
    submitAvailable = false;
  }

  if (password.length === 0) {
    submitAvailable = false;
  }

  if (!idAvailable) {
    submitAvailable = false;
  }

  if (!emailAvailable) {
    submitAvailable = false;
  }

  return (
    <Box>
      <h1>회원가입</h1>
      <FormControl isInvalid={!idAvailable}>
        <FormLabel>id</FormLabel>
        <Flex>
          <Input
            type="text"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setIdAvailable(false);
            }}
          />
          <Button onClick={handleIdCheck}>중복 확인</Button>
        </Flex>
        <FormErrorMessage>Id 중복체크를 해주세요.</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={password.length === 0}>
        <FormLabel>password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormErrorMessage>암호를 입력해주세요</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={password !== passwordCheck}>
        <FormLabel>password 확인</FormLabel>
        <Input
          type="password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
        <FormErrorMessage>암호가 다릅니다.</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!emailAvailable}>
        <FormLabel>email</FormLabel>
        <Flex>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailAvailable(false);
            }}
          />
          <Button onClick={handleEmailChk}>이메일 중복확인</Button>
        </Flex>
        <FormErrorMessage>이메일 중복체크를 해주세요</FormErrorMessage>
      </FormControl>
      <Button
        onClick={handleSubmit}
        colorScheme="blue"
        isDisabled={!submitAvailable}
      >
        가입
      </Button>
    </Box>
  );
}

export default MemberSignup;
