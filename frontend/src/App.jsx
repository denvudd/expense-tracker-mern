import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/Home";
import SignUp from "./pages/SignUp";
import Transaction from "./pages/Transaction";
import NotFound from "./components/common/NotFound";
import Login from "./pages/LogIn";
import { useQuery } from "@apollo/client";
import { GET_AUTHENTICATED_USER } from "./graphql/queries/user.query";

function App() {
  const { data, loading } = useQuery(GET_AUTHENTICATED_USER);
  console.log(data)

  if (loading) return null;

  return (
    <>
      {data?.authUser && <Header />}
      <Routes>
        <Route
          path="/"
          element={data?.authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!data?.authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!data?.authUser ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/transaction/:id"
          element={data?.authUser ? <Transaction /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
export default App;
