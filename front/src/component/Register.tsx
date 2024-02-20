import axios, { AxiosError, AxiosResponse } from 'axios';
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
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [passwordRepeat, setPasswordRepeat] = useState('');
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const [errorMsg, setErrorMsg] = useState('');

	const { mutate, status, error } = useMutation({
		mutationFn: (data: any) => sendRequest('post', 'v1/register', data),
		onSuccess: (data: Response) => {
			console.log(data);
			Cookies.set('token', data.token);
			Cookies.set('username', data.user.name);
			Cookies.set('email', data.user.email);
			Cookies.set('isAdmin', `${data.user.isAdmin}`);
			queryClient.resetQueries(['user']);
			navigate('/');
		},
		onError: (error: ErrorData) => {
			// console.error(res.response, error);
			if (error?.errors) {
				return setErrorMsg(Object.values(error.errors)[0]);
			}
			return setErrorMsg(error.message);
		},
	});

	const register = (e: FormEvent) => {
		e.preventDefault();
		console.log('works');
        setErrorMsg('');


		if (password !== passwordRepeat) {
			return setErrorMsg('Passwords do not match');
		}

		mutate({ name, email, password });
	};

	console.log(status);

	return (
		<div className='center'>
			<form
				onSubmit={register}
				className={`auth register ${status == 'loading' ? ' loading' : ''}${
					errorMsg ? ' validation-error' : ''
				}`}>
				<label>
					Name:
					<input
						autoComplete='new-name'
						type='string'
						onChange={e => setName(e.target.value)}
						value={name}
					/>
				</label>
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
						autoComplete='new-password'
						onChange={e => setPassword(e.target.value)}
						value={password}
					/>
				</label>
				<label>
					Repeat password:
					<input
						type='password'
						autoComplete='new-password'
						onChange={e => setPasswordRepeat(e.target.value)}
						value={passwordRepeat}
					/>
				</label>
				<span>{errorMsg}</span>
				<input type='submit' value='Register' />
				{status == 'loading' ? <div className="loader"></div> : null}
				<p>Already have an account? <Link to='/login'>Log in</Link></p>
			</form>
		</div>
	);
};

export default Login;
