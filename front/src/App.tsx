import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { isLoggedIn } from './auth/isLoggedIn';
import Login from './component/Login';

const App = () => {
	const user = isLoggedIn();
	return (
		<BrowserRouter>
			<header></header>
			<nav></nav>
			<main>
				<Routes>
					<Route
						index
						element={
							<div>
								{user ? (
									<>
										<h1>{user.name}</h1>
										<p>{user.email}</p>
									</>
								) : null}
							</div>
						}
					/>
					<Route path='/login' element={<Login />} />
				</Routes>
			</main>
		</BrowserRouter>
	);
};

export default App;
