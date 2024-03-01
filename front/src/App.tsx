import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './component/Login';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Home from './component/Home';
import Event from './component/Event';
import './style/main.css';
import Register from './component/Register';
import Header from './component/Header';
import Logout from './component/Logoout';
import Admin from './component/Admin';
import AddEvent from './component/AddEvent';
import EditEvent from './component/EditEvent';
import AdminIndex from './component/AdminIndex';
import Types from './component/Types';
import History from './component/History';

const queryClient = new QueryClient();

const App = () => {
	// const user = isLoggedIn();
	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<Header />
				<main>
					<Routes>
						<Route index element={<Home />} />
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />
						<Route path='/logout' element={<Logout />} />
						<Route path='/event/:id' element={<Event />} />
						<Route path='/history' element={<History />} />
						<Route path='/admin' element={<Admin />}>
							<Route index element={<AdminIndex />} />
							<Route path='addEvent' element={<AddEvent />} />
							<Route path='editEvent/:eventId' element={<EditEvent />} />
							<Route path='types' element={<Types />} />
							<Route index element={<Home />} />
						</Route>
					</Routes>
				</main>
			</BrowserRouter>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
};

export default App;
