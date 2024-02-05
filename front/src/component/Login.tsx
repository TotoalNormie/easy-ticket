import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorData } from './Home';

type Response = {
	result: boolean;
	token: string;
	user: {
		name: string;
		email: string;
	};
};

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const login = (e: FormEvent) => {
		e.preventDefault();
		console.log('works');
		setLoading(true);
		setError('');

		axios
			.post('http://127.0.0.1:8000/api/v1/login', {
				email: email,
				password: password,
			})
			.then((response: AxiosResponse) => {
				const data: Response = response.data;
				Cookies.set('token', data.token);
				Cookies.set('username', data.user.name);
				Cookies.set('email', data.user.email);
				setLoading(false);
				navigate('/');
			})
			.catch(res => {
				const error = res.response.data as ErrorData;
				// console.error(res.response, error);
				if (error?.errors) {
					setError(Object.values(error.errors)[0][0]);
					return;
				}
				setError(error.message);
			}).finally(() => {
				setLoading(false);
			});
	};

	return (
		<div className='center'>
			<form onSubmit={login} className={`auth${loading ? ' loading' : ''}${error ? ' validation-error' : ''}`}>
				<label>
					Email:
					<input
						autoComplete='email'
						type='email'
						onChange={e => setEmail(e.target.value)}
						value={email}
					/>
				</label>
				<label>
					Password:
					<input
						type='password'
						autoComplete='current-password'
						onChange={e => setPassword(e.target.value)}
						value={password}
					/>
				</label>
				<span>{error}</span>
				<input type='submit' value='Login' />
			</form>
		</div>
	);
};

export default Login;
