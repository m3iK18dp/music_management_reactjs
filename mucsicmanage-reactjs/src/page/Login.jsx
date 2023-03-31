import '../css/MusicLogin.css';
import authenticationService from '../services/AuthenticationService';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthNavbarComponent from '../components/AuthNavbarComponent';
const Login = () => {
	// const [username, setUsername] = useState('');
	// const [password, setPassword] = useState('');
	const [authLogin, setAuthLogin] = useState({
		username: '',
		password: '',
	});
	const [isFirst, setIsFirst] = useState(true);
	const set = (prop, value) => {
		setAuthLogin({ ...authLogin, [prop]: value });
	};
	const [usernameIsFilled, setUsernameIsFilled] = useState(' ');
	const [passwordIsFilled, setPasswordIsFilled] = useState('');
	const [status, setStatus] = useState('');

	const navigate = useNavigate();
	useEffect(() => {
		setUsernameIsFilled(
			authLogin.username === '' && !isFirst ? 'Please enter email' : '',
		);
		setPasswordIsFilled(
			authLogin.password === '' && !isFirst ? 'Please enter Password' : '',
		);
		setStatus('');
		setIsFirst(false);
	}, [authLogin]);

	const handleSubmit = () => {
		if (!(authLogin.username === '' || authLogin.password === ''))
			try {
				setStatus('Please wait...Login in progress');
				authenticationService.login(authLogin).then((data) => {
					console.log(data);
					if (data.status === 'ok') {
						alert('Login successful!');
						navigate('/songs');
					} else {
						setStatus('Login failed');
					}
				});
			} catch (error) {
				alert('Login failed.');
				console.log(error);
			}
	};

	return (
		<div>
			<AuthNavbarComponent />
			<div className='background-container' />
			<div
				fluid
				style={{
					with: '80%',
					minWidth: 500,
					maxWidth: 1000,
					margin: '80px auto',
				}}
			>
				<Col
					className='card'
					style={{
						border: '3px solid purple',
						backgroundColor: 'white',
					}}
				>
					<h1
						className='text-center'
						style={{
							borderBottom: '2px solid purple',
							padding: '20px',
							marginBottom: '0',
						}}
					>
						Login
					</h1>
					<div
						className='card-body'
						style={{
							with: '80%',
							minWidth: 400,
							maxWidth: 900,
						}}
					>
						<Form className='card-body'>
							<Form.Group controlId='formBasicUsername'>
								<Form.Label style={{ marginTop: 10 }}>Username</Form.Label>
								<Form.Control
									type='text'
									placeholder='Enter username'
									value={authLogin.username}
									onChange={(event) => set('username', event.target.value)}
									required
								/>
								<div style={{ height: 5 }}>
									<p
										style={{
											fontStyle: 'italic',
											color: 'red',
											margin: 0,
											fontSize: 12,
										}}
									>
										{usernameIsFilled}
									</p>
								</div>
							</Form.Group>
							<Form.Group controlId='formBasicPassword'>
								<Form.Label style={{ marginTop: 30 }}>Password</Form.Label>
								<Form.Control
									type='password'
									placeholder='Password'
									value={authLogin.password}
									onChange={(event) => set('password', event.target.value)}
									required
								/>
								<div style={{ height: 5 }}>
									<p
										style={{
											fontStyle: 'italic',
											color: 'red',
											margin: 0,
											fontSize: 12,
										}}
									>
										{passwordIsFilled}
									</p>
								</div>
							</Form.Group>
							<Button
								variant='primary'
								block='true'
								style={{ marginTop: 40 }}
								onClick={() => handleSubmit()}
							>
								Login
							</Button>{' '}
							<div className='mt-4'>
								<p className='text-center'>
									Don't have an account? <Link to='/register'>Register</Link>
								</p>
							</div>
							<div style={{ height: 5 }}>
								<p
									style={{
										fontStyle: 'italic',
										color: 'red',
										margin: 0,
										fontSize: 12,
									}}
								>
									{status}
								</p>
							</div>
						</Form>
					</div>
				</Col>
			</div>
		</div>
	);
};

export default Login;
