import { Navbar, Nav } from 'react-bootstrap';
import { SiApplemusic } from 'react-icons/si';
import React, { useState } from 'react';
import { TbLogout } from 'react-icons/tb';
import { HiOutlineUser } from 'react-icons/hi';
import authenticationService from '../services/AuthenticationService';
import { useNavigate, useLocation } from 'react-router-dom';
function NavbarComponent() {
	const location = useLocation();

	const navigate = useNavigate();
	const [expanded, setExpanded] = useState(false);
	const handleToggle = () => {
		setExpanded(!expanded);
	};
	const handleLogout = () => {
		authenticationService.logout().then((data) => {
			console.log(data);
			if (data.status === 'ok') {
				navigate('/');
			} else alert('Logout Failed');
		});
	};
	const isLoggedIn =
		localStorage.getItem('token') && localStorage.getItem('roles');
	const roles = localStorage.getItem('roles');
	const isAdmin = roles !== null ? roles.includes('ROLE_ADMIN') : false;
	return (
		<Navbar
			// expanded={expanded}
			// expand='sm'
			variant='light'
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				zIndex: 10,
				padding: 5,
				height: 55,
				minWidth: 400,
			}}
			className='background-color'
		>
			<Navbar.Toggle
				onClick={handleToggle}
				aria-controls='basic-navbar-nav'
				style={{ border: 'none' }}
			>
				<SiApplemusic size={45} color={'black'} />
			</Navbar.Toggle>
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
			</Navbar.Collapse>
			{isLoggedIn && (
				<Nav.Link
					href={`/account/${encodeURIComponent(
						localStorage.getItem('username'),
					)}`}
					title='Your Account Information'
				>
					<HiOutlineUser
						size={40}
						style={{
							width: 45,
							height: 45,
							backgroundColor: 'rgba(255,255,255,0.2)',
							borderRadius: '50%',
							padding: 5,
							filter: 'blur(0.5px)',
						}}
					></HiOutlineUser>
				</Nav.Link>
			)}
			{isLoggedIn ? (
				<Nav.Link
					onClick={() => handleLogout()}
					title='Logout'
					style={{ border: 'sold 1 black', marginLeft: 20 }}
				>
					Logout
					<TbLogout size={40}></TbLogout>
				</Nav.Link>
			) : (
				<Nav>
					<Nav.Link
						onClick={() => navigate('/login')}
						title='Login'
						style={{ border: 'sold 1 black', marginLeft: 20 }}
					>
						Login
					</Nav.Link>
					<Nav.Link
						onClick={() => navigate('/register')}
						title='Register'
						style={{ border: 'sold 1 black', marginLeft: 20 }}
					>
						Register
					</Nav.Link>
				</Nav>
			)}
		</Navbar>
	);
}
export default NavbarComponent;
