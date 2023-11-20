import { useContext, useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../context/LoginProvider";

export function MemberList() {
  const [list, setList] = useState(null);

  const navigate = useNavigate();
  const { hasAccess, isAdmin } = useContext(LoginContext);
  useEffect(() => {
    axios.get("/api/member/list").then((response) => setList(response.data));
  }, []);

  if (list === null) {
    return <Spinner />;
  }

  function handleTableRowClick(id) {
    const params = new URLSearchParams();
    params.set("id", id);
    // /member?id=id
    navigate("/member?" + params.toString());
  }

  return (
    <Box>
      <Table>
        <Thead>
          <Tr>
            <Th>id</Th>
            <Th>Email</Th>
            <Th>이름</Th>
            <Th>별명</Th>
            <Th>성별</Th>
            <Th>생년월일</Th>
            <Th>전화번호</Th>
            <Th>가입일시</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isAdmin() &&
            list.map((member) => (
              <Tr
                _hover={{ cursor: "pointer" }}
                onClick={() => handleTableRowClick(member.id)}
                key={member.id}
              >
                <Td>{member.id}</Td>
                <Td>{member.email}</Td>
                <Td>{member.name}</Td>
                <Td>{member.nickName}</Td>
                <Td>{member.gender}</Td>
                <Td>{member.birth}</Td>
                <Td>{member.phone}</Td>
                <Td>{member.inserted}</Td>
                <Td>{member.grade}</Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </Box>
  );
}
