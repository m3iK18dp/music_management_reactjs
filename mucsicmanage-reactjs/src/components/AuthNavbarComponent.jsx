import { Navbar, Nav } from 'react-bootstrap';
import { SiApplemusic } from 'react-icons/si';
import { useLocation } from 'react-router-dom';
import React, { useState } from 'react';
function AuthNavbarComponent() {
	const [expanded, setExpanded] = useState(false);
	const location = useLocation();

	const handleToggle = () => {
		setExpanded(!expanded);
	};

	const isLoggedIn =
		localStorage.getItem('token') && localStorage.getItem('roles');
	const roles = localStorage.getItem('roles');
	const isAdmin = roles !== null ? roles.includes('ROLE_ADMIN') : false;
	return (
		<Navbar
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				zIndex: 10,
				padding: 10,
				color: 'white',
				minWidth: 400,
			}}
			className='background-color'
		>
			<Nav.Link href='/' disabled={location.pathname === '/'}>
				<SiApplemusic size={50} color={'black'}></SiApplemusic>
			</Nav.Link>
			<Navbar.Toggle
				onClick={handleToggle}
				aria-controls='basic-navbar-nav'
				style={{ border: 'none' }}
			></Navbar.Toggle>
			<Navbar.Collapse id='basic-navbar-nav'>
				<Nav>
					<Nav.Link href='/songs' disabled={location.pathname === '/songs'}>
						Song Management
					</Nav.Link>
					{isLoggedIn && isAdmin && (
						<Nav.Link href='/users' disabled={location.pathname === '/users'}>
							Users Management
						</Nav.Link>
					)}
				</Nav>
				<Nav>
					<Nav.Link href='/login' disabled={location.pathname === '/login'}>
						Login
					</Nav.Link>
					<Nav.Link
						href='/register'
						disabled={location.pathname === '/register'}
					>
						Register
					</Nav.Link>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
}

export default AuthNavbarComponent;
