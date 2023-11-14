import { Button, Flex, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useContext } from "react";
import { LoginContext } from "./LoginProvider";

export function NavBar() {
  const toast = useToast();
  const navigate = useNavigate();
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);

  function handleLogout() {
    axios
      .post("/api/member/logout")
      .then(() => {
        toast({
          description: "로그아웃 되었습니다.",
          status: "info",
        });
        navigate("/");
      })
      .finally(() => fetchLogin());
  }

  return (
    <Flex>
      <Button onClick={() => navigate("/")}>home</Button>
      {isAuthenticated() ? (
        <>
          <Button onClick={() => navigate("/write")}>write </Button>
          <Button onClick={handleLogout}>로그아웃</Button>
        </>
      ) : (
        <>
          <Button onClick={() => navigate("/login")}>로그인</Button>
          <Button onClick={() => navigate("/signup")}>signup</Button>
        </>
      )}

      {isAdmin() && (
        <Button onClick={() => navigate("/member/List")}>회원목록</Button>
      )}
    </Flex>
  );
}
