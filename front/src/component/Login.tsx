import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
	const navigate = useNavigate();

	const login = (e: FormEvent) => {
		e.preventDefault();
        console.log('works')
		setLoading(true);
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
            .catch((error) => {
                console.error(error);
                setLoading(false);
            }
            )
	};

	return (
		<form onSubmit={login}>
			<input type='email' onChange={e => setEmail(e.target.value)} value={email} />
			<input type='password' onChange={e => setPassword(e.target.value)} value={password} />
			<input type='submit' value='Login' />
            {loading ? <div>Loading...</div> : null}
		</form>

		
	);
};

export default Login;
