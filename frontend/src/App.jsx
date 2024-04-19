import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/Home";
import SignUp from "./pages/SignUp";
import Transaction from "./pages/Transaction";
import NotFound from "./components/common/NotFound";
import Login from "./pages/LogIn";

function App() {
	const authUser = true;

	return (
		<>
			{authUser && <Header />}
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/login' element={<Login />} />
				<Route path='/signup' element={<SignUp />} />
				<Route path='/transaction/:id' element={<Transaction />} />
				<Route path='*' element={<NotFound />} />
			</Routes>
		</>
	);
}
export default App;
