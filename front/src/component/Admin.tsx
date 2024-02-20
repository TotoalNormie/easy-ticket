import { isLoggedIn } from '../auth/isLoggedIn';
import React from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';

const Admin = () => {
	const user = isLoggedIn();
    // console.log(user);
    if(!user?.isAdmin) return <Navigate to='/' />
	return (
		<div>
			<Outlet />
			<aside>
				<Link to='addEvent'>Add event</Link>
			</aside>
		</div>
	);
};

export default Admin;
