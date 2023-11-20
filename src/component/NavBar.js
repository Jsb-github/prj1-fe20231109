import { Button, Flex, useToast } from "@chakra-ui/react";
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
  console.log(context.theme);
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
    <Flex>
      <Button onClick={() => navigate("/")}>
        Home <FontAwesomeIcon icon={faHouse} />
      </Button>
      {}

      {isAuthenticated() ? (
        <>
          <Button onClick={() => navigate("/write")}>
            write
            <FontAwesomeIcon icon={faPenToSquare} />
          </Button>
          <Button onClick={() => navigate(`/member?${urlParams}`)}>
            회원정보
            <FontAwesomeIcon icon={faUser} />
          </Button>
          {isAdmin() && (
            <Button onClick={() => navigate("/member/List")}>
              회원목록
              <FontAwesomeIcon icon={faUsers} />
            </Button>
          )}
          <Button onClick={handleLogout}>
            로그아웃
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </Button>
        </>
      ) : (
        <>
          <Button onClick={() => navigate("/login")}>
            로그인
            <FontAwesomeIcon icon={faRightToBracket} />
          </Button>
          <Button onClick={() => navigate("/signup")}>
            회원가입 <FontAwesomeIcon icon={faUserPlus} />
          </Button>
        </>
      )}

      {context.theme === "light" ? (
        <BsSun
          size="xl"
          onClick={context.toggleMode}
          className="nav__theme-btn"
        />
      ) : (
        <BsMoonFill onClick={context.toggleMode} className="nav__theme-btn" />
      )}
    </Flex>
  );
}
