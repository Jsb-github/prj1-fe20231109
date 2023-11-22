import { Button, Flex, Spacer, useToast } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { useContext, useEffect } from "react";
import { LoginContext } from "../context/LoginProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowRightFromBracket,
  faHouse,
  faPenToSquare,
  faRightToBracket,
  faUser,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { ThemeContext } from "../context/TemeContextProvider";
import { BsMoonFill, BsSun } from "react-icons/bs";

export function NavBar() {
  const toast = useToast();
  const navigate = useNavigate();
  const { fetchLogin, login, isAuthenticated, isAdmin } =
    useContext(LoginContext);

  const context = useContext(ThemeContext);

  const urlParams = new URLSearchParams();
  const location = useLocation();
  useEffect(() => {
    fetchLogin();
  }, [location]);

  if (login !== "") {
    urlParams.set("id", login.id);
  }
  function handleLogout() {
    axios.post("/api/member/logout").then(() => {
      toast({
        description: "로그아웃 되었습니다.",
        status: "info",
      });
      navigate("/");
    });
  }

  return (
    <Flex mb={10} gap="4" borderBottom={"1px solid #b0c4de"}>
      <Button
        borderRadius={0}
        variant={"ghost"}
        size={0}
        leftIcon={<FontAwesomeIcon icon={faHouse} />}
        onClick={() => navigate("/")}
        className="nav__theme--btn"
      >
        Home
      </Button>
      {}

      {isAuthenticated() ? (
        <>
          <Button
            borderRadius={0}
            variant={"ghost"}
            size={0}
            leftIcon={<FontAwesomeIcon icon={faPenToSquare} />}
            className="nav__theme--btn"
            onClick={() => navigate("/write")}
          >
            write
          </Button>
          <Spacer />
          <Button
            borderRadius={0}
            variant={"ghost"}
            size={0}
            leftIcon={<FontAwesomeIcon icon={faUser} />}
            className="nav__theme--btn"
            onClick={() => navigate(`/member?${urlParams}`)}
          >
            {login.nickName}님
          </Button>
          {isAdmin() && (
            <Button
              borderRadius={0}
              variant={"ghost"}
              size={0}
              leftIcon={<FontAwesomeIcon icon={faUsers} />}
              className="nav__theme--btn"
              onClick={() => navigate("/member/List")}
            >
              회원목록
            </Button>
          )}

          <Button
            borderRadius={0}
            variant={"ghost"}
            size={0}
            leftIcon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}
            className="nav__theme--btn"
            onClick={handleLogout}
          >
            로그아웃
          </Button>
        </>
      ) : (
        <>
          <Spacer />
          <Button
            borderRadius={0}
            variant={"ghost"}
            size={0}
            className="nav__theme--btn"
            leftIcon={<FontAwesomeIcon icon={faRightToBracket} />}
            onClick={() => navigate("/login")}
          >
            로그인
          </Button>
          <Button
            borderRadius={0}
            variant={"ghost"}
            size={0}
            leftIcon={<FontAwesomeIcon icon={faUserPlus} />}
            className="nav__theme--btn"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </Button>
        </>
      )}

      {context.theme === "light" ? (
        <BsSun onClick={context.toggleMode} className="nav__theme-btn" />
      ) : (
        <BsMoonFill onClick={context.toggleMode} className="nav__theme-btn" />
      )}
    </Flex>
  );
}
