import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MemberSignup(props) {
  // 초기 값 세팅
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("남성");
  const [email, setEmail] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [idAvailable, setIdAvailable] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [nickName, setNickName] = useState("");
  const [nickNameAvailable, setNickNameAvailable] = useState(false);

  // 오류메시지 상태 저장
  const [idMessage, setIdMessage] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [phoneMessage, setPhoneMessage] = useState("");
  const [birthMessage, setBirthMessage] = useState("");

  // 유효성 검사
  const [isId, setIsId] = React.useState(false);
  const [isname, setIsName] = React.useState(false);
  const [isPassword, setIsPassword] = React.useState(false);
  const [isEmail, setIsEmail] = React.useState(false);
  const [isPhone, setIsPhone] = React.useState(false);
  const [isBirth, setIsBirth] = React.useState(false);
  //check box 상태 채크
  const [checkedBox, setCheckedBox] = useState(false);
  const toast = useToast();

  const navigate = useNavigate();
  function handleSubmit() {
    axios
      .post("/api/member/signup", {
        id,
        password,
        name,
        email,
        gender,
        birth,
        phone,
        nickName,
      })
      .then(() => {
        toast({
          description: "회원가입 완료되었습니다.",
          status: "success",
        });
        navigate("/");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            description: "입력값을 확인해주세요",
            status: "warning",
          });
        } else {
          toast({
            description: "서버 저장 중 에러가 발생했습니다.",
            status: "error",
          });
        }
      })
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

  function handleNickNameCheck() {
    const params = new URLSearchParams();
    params.set("nickName", nickName);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setNickNameAvailable(false);
        toast({
          description: "이미 사용 중인 별명입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setNickNameAvailable(true);
          toast({
            description: "사용 가능한 별명입니다.",
            status: "success",
          });
        }
      });
  }
  // ==========유효성 검사 함수===================
  const onChangeId = (e) => {
    const currentId = e.target.value;
    setId(currentId);
    const idRegExp = /^[a-zA-z0-9]{4,12}$/;
    setIdAvailable(false);
    if (!idRegExp.test(currentId)) {
      setIdMessage("4-12사이 대소문자 또는 숫자만 입력해 주세요!");
      setIsId(false);
    } else {
      setIdMessage("중복검사를 채크해주세요");
      setIsId(true);
    }
  };

  const onChangeName = (e) => {
    const currentName = e.target.value;
    setName(currentName);

    if (currentName.length < 1) {
      setNameMessage("이름은 1글자 이상 입력해주세요!");
      setIsName(false);
    } else {
      setNameMessage("사용가능한 이름 입니다.");
      setIsName(true);
    }
  };

  const onChangePassword = (e) => {
    const currentPassword = e.target.value;
    setPassword(currentPassword);

    const passwordRegExp =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;

    if (!passwordRegExp.test(currentPassword)) {
      setPasswordMessage(
        "숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요!",
      );
      setIsPassword(false);
    } else {
      setPasswordMessage("안전한 비밀번호 입니다.");
      setIsPassword(true);
    }
  };

  const onChangeEmail = (e) => {
    const currentEmail = e.target.value;
    setEmail(currentEmail);

    setEmailAvailable(false);

    const emailRegExp =
      /^[A-Za-z0-9_]+[A-Za-z0-9]*[@]{1}[A-Za-z0-9]+[A-Za-z0-9]*[.]{1}[A-Za-z]{1,3}$/;

    if (!emailRegExp.test(currentEmail)) {
      setEmailMessage("이메일의 형식이 올바르지 않습니다!");
      setIsEmail(false);
    } else if (!emailAvailable) {
      setEmailMessage("중복확인 버튼을 클릭해주세요");
      setIsEmail(true);
    }
  };

  const onChangePhone = (getNumber) => {
    const currentPhone = getNumber;
    setPhone(currentPhone);
    const phoneRegExp = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

    if (!phoneRegExp.test(currentPhone)) {
      setPhoneMessage("올바른 형식이 아닙니다!");
      setIsPhone(false);
    } else {
      setPhoneMessage("사용 가능한 번호입니다:-)");
      setIsPhone(true);
    }
  };

  const addHyphen = (e) => {
    const currentNumber = e.target.value;
    setPhone(currentNumber);
    if (currentNumber.length === 3 || currentNumber.length === 8) {
      setPhone(currentNumber + "-");
      onChangePhone(currentNumber + "-");
    } else {
      onChangePhone(currentNumber);
    }
  };

  const onChangeBirth = (e) => {
    const currentBirth = e.target.value;
    setBirth(currentBirth);
    const birthRegExp = /([0-9]{8})+/g;
    if (!birthRegExp.test(currentBirth)) {
      setBirthMessage("올바른 형식이 아닙니다.");
      setIsBirth(false);
    } else {
      setBirthMessage("사용가능한 생년월일 입니다..");
      setIsBirth(true);
    }
  };
  return (
    <Box width="500px">
      <h1>회원 가입</h1>
      <FormControl>
        <Flex>
          <Input
            type="text"
            value={id}
            placeholder="아이디"
            onChange={onChangeId}
          />

          <Button
            colorScheme={idAvailable ? "blue" : "red"}
            onClick={handleIdCheck}
            isDisabled={!isId}
          >
            중복확인
          </Button>
        </Flex>
        <p>{idMessage}</p>
      </FormControl>

      <FormControl>
        <Input
          type="password"
          value={password}
          placeholder="비밀번호"
          onChange={onChangePassword}
        />
        <p>{passwordMessage}</p>
      </FormControl>

      <FormControl isInvalid={!nickNameAvailable}>
        <FormLabel>nick name</FormLabel>
        <Flex>
          <Input
            type="text"
            value={nickName}
            onChange={(e) => {
              setNickName(e.target.value);
              setNickNameAvailable(false);
            }}
          ></Input>
          <Button
            onClick={handleNickNameCheck}
            colorScheme={nickName ? "blue" : "red"}
            isDisabled={!nickName}
          >
            중복확인
          </Button>
        </Flex>
        <FormErrorMessage>nickName 중복 체크를 해주세요.</FormErrorMessage>
      </FormControl>
      <FormControl>
        <Flex>
          <Input
            type="text"
            value={email}
            placeholder="비밀 번호 분실시 확인용 이메일"
            onChange={onChangeEmail}
          />

          <Button
            onClick={handleEmailChk}
            colorScheme={emailAvailable ? "blue" : "red"}
            isDisabled={!isEmail}
          >
            이메일 중복확인
          </Button>
        </Flex>
        <p>{emailMessage}</p>
      </FormControl>

      <FormControl>
        <Input
          type="text"
          value={name}
          placeholder="이름"
          onChange={onChangeName}
        />
        <p>{nameMessage}</p>
      </FormControl>

      <FormControl>
        <Input
          type="text"
          value={birth}
          maxLength={8}
          placeholder="생년월일 8자리"
          onChange={onChangeBirth}
        />
        <p>{birthMessage}</p>
      </FormControl>

      <FormControl>
        <Box>
          <Flex>
            <FormLabel>
              <input
                type="radio"
                id="gender1"
                name="gender"
                value={"남성"}
                checked
                onChange={(e) => {
                  setGender(e.target.value);
                }}
              />
              남성
            </FormLabel>

            <FormLabel>
              <input
                type="radio"
                id="gender2"
                name="gender"
                value={"여성"}
                onChange={(e) => {
                  setGender(e.target.value);
                }}
              />
              여성
            </FormLabel>
          </Flex>
        </Box>
        <FormErrorMessage>성별을 채크해주세요</FormErrorMessage>
      </FormControl>

      <FormControl>
        <Input value={phone} placeholder="휴대전화번호" onChange={addHyphen} />
        <p>{phoneMessage}</p>
      </FormControl>

      <FormControl isInvalid={checkedBox === false}>
        <FormLabel>이용약관</FormLabel>
        <Textarea rows={10} readOnly>
          {/* 약관 컴포넌트 생성*/}
        </Textarea>

        <FormLabel>
          <Checkbox
            value={checkedBox}
            onChange={(e) => {
              //채크박스 초기화
              setCheckedBox(e.target.checked);
            }}
          >
            동의 합니까?
          </Checkbox>
        </FormLabel>
        <FormErrorMessage>약관을 읽어보시고 채크해주세요.!!!</FormErrorMessage>
      </FormControl>

      <Button
        isDisabled={
          !(
            idAvailable &&
            isname &&
            emailAvailable &&
            isBirth &&
            isPassword &&
            isPhone &&
            checkedBox &&
            nickNameAvailable
          )
        }
        onClick={handleSubmit}
      >
        가입
      </Button>

      <Button colorScheme="blue">가입취소</Button>
    </Box>
  );
}

export default MemberSignup;
