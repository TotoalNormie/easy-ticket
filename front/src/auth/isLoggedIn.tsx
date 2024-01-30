import Cookies from 'js-cookie';

export const isLoggedIn = () => {
    const token = Cookies.get('token');
    const name = Cookies.get('name');
    const email = Cookies.get('email');
    if(token) {
        return {
            name: name,
            email: email
        }
    }
    return null;
};
