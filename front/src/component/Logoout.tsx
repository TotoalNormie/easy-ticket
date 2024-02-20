import { User } from "../auth/isLoggedIn";
import { useMutation, useQueryClient } from "react-query";
import { ErrorData } from "./Home";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../global/sendRequest";


const Logout = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {mutate, data} = useMutation<User | ErrorData>({
        mutationFn: () => sendRequest('delete', 'v1/logout'),
        onSettled: () => {
            Cookies.remove('token');
            Cookies.remove('username');
            Cookies.remove('email');
			Cookies.remove('isAdmin');
            queryClient.resetQueries(['user']);
            navigate('/');
        },
        mutationKey: ['user'],
	});
    mutate();
    return <div />;
};

export default Logout;
