import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";

import { ChatIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faImages } from "@fortawesome/free-solid-svg-icons";
import { Pagination } from "./Pagination";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

function SearchComponent() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  function handleSearch() {
    // /?k=keyword & c=all

    const params = new URLSearchParams();
    params.set("k", keyword);
    params.set("c", category);
    navigate("/?" + params);
  }

  return (
    <Flex>
      <Select defaultValue={""} onChange={(e) => setCategory(e.target.value)}>
        <option value="all">전체</option>
        <option value="title">제목</option>
        <option value="content">본문</option>
      </Select>
      <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <Button onClick={handleSearch}>검색</Button>
    </Flex>
  );
}

export function BoardList() {
  const [boardList, setBoardList] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axios.get("/api/board/list?" + params).then((response) => {
      setBoardList(response.data.boardList);
      setPageInfo(response.data.pageInfo);
    });
  }, [location]);

  if (boardList === null) {
    return <Spinner />;
  }

  return (
    <Box marginTop={"35px"}>
      <Heading>게시물 목록</Heading>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th w={"100px"}>id</Th>
              <Th w={"70px"}>
                <FontAwesomeIcon icon={faHeart} />
              </Th>
              <Th>title</Th>
              <Th w={"150px"}>by</Th>
              <Th w={"150px"}>at</Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList.map((board) => (
              <Tr
                _hover={{
                  cursor: "pointer",
                }}
                key={board.id}
                onClick={() => navigate("/board/" + board.id)}
              >
                <Td>{board.id}</Td>
                <Td>{board.countLike !== 0 && board.countLike}</Td>
                <Td>
                  {board.title}
                  {board.countComment > 0 && (
                    <Badge>
                      <ChatIcon />
                      {board.countComment}
                    </Badge>
                  )}
                  {board.countFile > 0 && (
                    <Badge>
                      <FontAwesomeIcon icon={faImages} />
                      {board.countFile}
                    </Badge>
                  )}
                </Td>

                <Td>{board.nickName}</Td>
                <Td>{board.ago}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <SearchComponent />
      <Pagination pageInfo={pageInfo} />
    </Box>
  );
}
