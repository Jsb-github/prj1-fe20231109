import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { BoardWrite } from "./page/board/BoardWrite";

import { HomeLayout } from "./layout/HomeLayout";
import { BoardView } from "./page/board/BoardView";
import BoardEdit from "./page/board/BoardEdit";
import MemberSignup from "./page/member/MemberSignup";
import { MemberList } from "./page/member/MemberList";
import { MemberView } from "./page/member/MemberView";
import { MemberEdit } from "./page/member/MemberEdit";
import { BoardList } from "./page/board/BoardList";
import MemberLogin from "./page/member/MemberLogin";

import LoginProvider from "./context/LoginProvider";

const routes = createBrowserRouter(
  createRoutesFromElements(
    // HomeLayout
    <Route path="/" element={<HomeLayout />}>
      <Route index element={<BoardList />} />
      <Route path="write" element={<BoardWrite />} />
      <Route path="board/:id" element={<BoardView />} />
      <Route path="edit/:id" element={<BoardEdit />} />
      <Route path="signup" element={<MemberSignup />} />
      <Route path="member/List" element={<MemberList />} />
      <Route path="member" element={<MemberView />} />
      <Route path="member/edit" element={<MemberEdit />} />
      <Route path="member/edit" element={<MemberEdit />} />
      {/*<Route path="comment/edit/:id" element={<CommentEdit />} />*/}
      <Route path="login" element={<MemberLogin />} />
    </Route>,
  ),
);

function App(props) {
  return (
    <LoginProvider>
      <RouterProvider router={routes} />
    </LoginProvider>
  );
}

export default App;
