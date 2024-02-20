import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorData } from './Home';
import { useMutation, useQueryClient } from 'react-query';
import { sendRequest } from '../global/sendRequest';

type Response = {
	result: boolean;
	token: string;
	user: {
		name: string;
		email: string;
		isAdmin: boolean;
	};
};

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [errorMsg, setErrorMsg] = useState('');

	const { mutate, status, error } = useMutation({
		mutationFn: (data: any) => sendRequest('post', 'v1/login', data),
		onSuccess: (data: Response) => {
			Cookies.set('token', data.token);
			Cookies.set('username', data.user.name);
			Cookies.set('email', data.user.email);
			Cookies.set('isAdmin', `${data.user.isAdmin}`);
			queryClient.resetQueries(['user']);
			setErrorMsg('');
			navigate('/');
		},
		onError: (res: any) => {
			const error = res.response.data as ErrorData;
			// console.error(res.response, error);
			if (error?.errors) {
				return setErrorMsg(Object.values(error.errors)[0][0]);
			}
			return setErrorMsg(error.message);
		},
	});

	const login = (e: FormEvent) => {
		e.preventDefault();
		console.log('works');

		mutate({ email, password });
	};

	return (
		<div className='center'>
			<form
				onSubmit={login}
				className={`auth ${status == 'loading' ? ' loading' : ''}${
					status == 'error' ? ' validation-error' : ''
				}`}>
				<label>
					Email:
					<input
						autoComplete=''
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
				<span>{errorMsg}</span>
				<input type='submit' value='Login' />
				<p>Don't have an account? <Link to='/register'>Register</Link></p>
			</form>
		</div>
	);
};

export default Login;
