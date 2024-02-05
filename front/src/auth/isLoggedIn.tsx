import axios from 'axios';
import Cookies from 'js-cookie';
import { useQuery } from 'react-query';
import { ErrorData } from '../component/Home';

type User = {
    name: string;
    email: string;
}

export const isLoggedIn = () => {
	const token = Cookies.get('token');

	if (!token) {
		return null;
	}

	const { data: user, error } = useQuery<User | ErrorData>({
		queryKey: ['user'],
		queryFn: () => axios.get('http://127.0.0.1:8000/api/v1/check-auth', {
            headers: {Authorization: `Bearer ${token}`}
        }).then(res => res.data.user),
	});

	if (error) {
		// console.log(error);
		return null;
	}

	if (user &&  'name' in user) {
        // console.log(user);
		Cookies.set('username', user.name);
		Cookies.set('email', user.email);
		return {
			name: user.name,
			email: user.email,
		};
	}
};
