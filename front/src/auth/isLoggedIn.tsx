import axios from 'axios';
import Cookies from 'js-cookie';
import { useQuery } from 'react-query';
import { ErrorData } from '../component/Home';

export type User = {
    name: string;
    email: string;
    isAdmin: boolean;
}

export const isLoggedIn = () => {
	const { data: user, error } = useQuery<User | ErrorData>({
		queryKey: ['user'],
		queryFn: () => axios.get('http://127.0.0.1:8000/api/v1/check-auth', {
            headers: {Authorization: `Bearer ${Cookies.get('token')}`}
        }).then(res => res.data.user),
		retry: false,
	});

	if (error) {
		// console.log(error);
		Cookies.remove('token');
		Cookies.remove('username');
		Cookies.remove('email');
		Cookies.remove('isAdmin');
		return null;
	}

	if (user &&  'name' in user) {
        // console.log(user);
		return {
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		} as User;
	}
	if(!user && Cookies.get('token')) {
		console.log('works')
		return {
			name: Cookies.get('username'),
			email: Cookies.get('email'),
			isAdmin: Cookies.get('isAdmin'),
		}
	}
	return null;
};
