import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  useParams,
} from "react-router-dom";
import { BoardWrite } from "./page/BoardWrite";
import { BoardList } from "./page/BoardList";
import { HomeLayout } from "./layout/HomeLayout";
import { Box, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";

function BoardView() {
  const [board, setBoard] = useState(null);
  let { id } = useParams();

  console.log(id);
  useEffect(() => {
    axios.get(`api/board/id${id}`).then((response) => setBoard(response.data));
  }, []);
  if (board === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>글보기</h1>
      <p>번호 : {board.id}</p>
      <p>제목 : {board.title}</p>
      <p>본문 : {board.content}</p>
      <p>작성자 : {board.write}</p>
      <p>작성일시 : {board.inserted}</p>
    </Box>
  );
}

const routes = createBrowserRouter(
  createRoutesFromElements(
    // HomeLayout
    <Route path="/" element={<HomeLayout />}>
      <Route index element={<BoardList />} />
      <Route path="write" element={<BoardWrite />} />
      <Route path="board/:id" element={<BoardView />} />
    </Route>,
  ),
);

function App(props) {
  return <RouterProvider router={routes} />;
}

export default App;
