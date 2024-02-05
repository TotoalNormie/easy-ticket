import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './component/Login';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Home from './component/Home';
import Event from './component/Event';
import './style/main.css';

const queryClient = new QueryClient();

const App = () => {
	// const user = isLoggedIn();
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<header></header>
				<nav></nav>
				<main>
					<Routes>
						<Route index element={<Home />} />
						<Route path='/login' element={<Login />} />
						<Route path='/event/:id' element={<Event />} />
					</Routes>
				</main>
			</BrowserRouter>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
};

export default App;
