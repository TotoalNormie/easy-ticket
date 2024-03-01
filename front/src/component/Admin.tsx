import { isLoggedIn } from '../auth/isLoggedIn';
import React from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';

const Admin = () => {
	const user = isLoggedIn();
	if (!user?.isAdmin) return <Navigate to='/' />;
	return (
		<div>
			<aside>
				<Link to=''>Event admin panel</Link>
				<Link to='addEvent'>Add event</Link>
				<Link to='types'>Event type admin panel</Link>
			</aside>
			<Outlet />
		</div>
	);
};

export default Admin;
