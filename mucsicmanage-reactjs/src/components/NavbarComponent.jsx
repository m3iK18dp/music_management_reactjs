import { Navbar, Nav } from 'react-bootstrap';
import { SiApplemusic } from 'react-icons/si';
import React from 'react';
import { TbLogout } from 'react-icons/tb';
import { HiOutlineUser } from 'react-icons/hi';
import authenticationService from '../services/AuthenticationService';
import { useNavigate, useLocation } from 'react-router-dom';
import CustomButton from './CustomButton';
function NavbarComponent({ disabled = false }) {
	const location = useLocation();

	const navigate = useNavigate();

	const handleLogout = () => {
		authenticationService.logout().then((data) => {
			console.log(data);
			if (data.status === 'ok') {
				navigate('/');
			} else alert('Logout Failed');
		});
	};
	const isLoggedIn = localStorage.getItem('token');
	// &&
	// !JSON.parse(sessionStorage.getItem("isRevoked"));
	const roles = sessionStorage.getItem('roles');
	const isAdmin = roles !== null ? roles.includes('ADMIN') : false;
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
			<Nav.Link href='/' disabled={location.pathname === '/' || disabled}>
				<SiApplemusic size={50} color={'rgba(255,255,255,0.6)'}></SiApplemusic>
			</Nav.Link>
			<Navbar.Collapse id='basic-navbar-nav'>
				<Nav>
					<Nav.Link
						href='/songs'
						disabled={location.pathname === '/songs' || disabled}
						style={{
							borderRight: 'solid 1px rgba(255,255,255,0.3)',
							padding: '0 8px',
							margin: '8px 0',
							color:
								location.pathname !== '/songs'
									? 'rgba(255,255,255,0.7)'
									: 'rgba(255,255,255,0.4)',
						}}
					>
						Songs
					</Nav.Link>

					{(JSON.parse(sessionStorage.getItem('isRevoked')) || isLoggedIn) &&
						isAdmin && (
							<Nav.Link
								href={
									JSON.parse(sessionStorage.getItem('isRevoked'))
										? false
										: '/users'
								}
								onClick={() => {
									if (JSON.parse(sessionStorage.getItem('isRevoked'))) {
										alert(
											'Your account has been revoked, login with another account or contact Administrator to unlock your account to use more features.',
										);
									}
								}}
								disabled={location.pathname === '/users' || disabled}
								style={{
									borderRight: 'solid 1px rgba(255,255,255,0.3)',
									padding: '0 8px',
									margin: '8px 0',
									color:
										location.pathname !== '/users'
											? 'rgba(255,255,255,0.7)'
											: 'rgba(255,255,255,0.3)',
								}}
							>
								Users
							</Nav.Link>
						)}
					{isLoggedIn && location.pathname === '/my_songs' && (
						<Nav.Link
							href={
								JSON.parse(sessionStorage.getItem('isRevoked'))
									? false
									: '/my_songs'
							}
							onClick={() => {
								if (JSON.parse(sessionStorage.getItem('isRevoked'))) {
									alert(
										'Your account has been revoked, login with another account or contact Administrator to unlock your account to use more features.',
									);
								}
							}}
							disabled={location.pathname === '/my_songs' || disabled}
							style={{
								borderRight: 'solid 1px rgba(255,255,255,0.3)',
								padding: '0 8px',
								margin: '8px 0',
								color:
									location.pathname !== '/my_songs'
										? 'rgba(255,255,255,0.7)'
										: 'rgba(255,255,255,0.4)',
							}}
						>
							My Songs
						</Nav.Link>
					)}
					{isLoggedIn && location.pathname.includes('/my_playlist') && (
						<Nav.Link
							href={
								JSON.parse(sessionStorage.getItem('isRevoked'))
									? false
									: location.pathname
							}
							onClick={() => {
								if (JSON.parse(sessionStorage.getItem('isRevoked'))) {
									alert(
										'Your account has been revoked, login with another account or contact Administrator to unlock your account to use more features.',
									);
								}
							}}
							disabled={location.pathname.includes('/my_playlist') || disabled}
							style={{
								borderRight: 'solid 1px rgba(255,255,255,0.3)',
								padding: '0 8px',
								margin: '8px 0',
								color: location.pathname.includes('/my_playlist')
									? 'rgba(255,255,255,0.4)'
									: 'rgba(255,255,255,0.7)',
							}}
						>
							My Playlists
						</Nav.Link>
					)}
				</Nav>
			</Navbar.Collapse>
			{JSON.parse(sessionStorage.getItem('isRevoked')) || isLoggedIn ? (
				<>
					<CustomButton
						IconButton={HiOutlineUser}
						style={{
							width: 40,
							height: 40,
							backgroundColor: 'rgba(255,255,255,0.2)',
							borderRadius: '50%',
							padding: 5,
							filter: 'blur(0.5px)',
						}}
						func={() => {
							if (JSON.parse(sessionStorage.getItem('isRevoked'))) {
								alert(
									'Your account has been revoked, login with another account or contact Administrator to unlock your account to use more features.',
								);
							} else
								navigate(
									`/account/${encodeURIComponent(
										sessionStorage.getItem('username'),
									)}`,
								);
						}}
						size={30}
						color='rgba(255,255,255,0.7)'
						id='my-account'
						disable={disabled}
					/>
					<Nav.Link
						id='logout-btn'
						onClick={() => handleLogout()}
						title='Logout'
						style={{
							border: 'sold 1 black',
							marginLeft: 20,
							color: 'rgba(255,255,255,0.7)',
						}}
						disabled={disabled}
					>
						Logout
						<TbLogout size={40}></TbLogout>
					</Nav.Link>
				</>
			) : (
				<Nav>
					<Nav.Link
						onClick={() => navigate('/login')}
						title='Login'
						style={{
							border: 'sold 1 black',
							marginLeft: 20,
							color:
								location.pathname !== '/login'
									? 'rgba(255,255,255,0.7)'
									: 'rgba(255,255,255,0.3)',
						}}
						disabled={location.pathname === '/login' || disabled}
					>
						Login
					</Nav.Link>
					<Nav.Link
						onClick={() => navigate('/register')}
						title='Register'
						style={{
							border: 'sold 1 black',
							marginLeft: 20,
							color:
								location.pathname !== '/register'
									? 'rgba(255,255,255,0.7)'
									: 'rgba(255,255,255,0.3)',
						}}
						disabled={location.pathname === '/register' || disabled}
					>
						Register
					</Nav.Link>
				</Nav>
			)}
		</Navbar>
	);
}
export default NavbarComponent;
