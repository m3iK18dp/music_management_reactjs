import '../css/MusicLogin.css';
import authenticationService from '../services/AuthenticationService';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthNavbarComponent from '../components/AuthNavbarComponent';
const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const handleSubmit = (event) => {
		event.preventDefault();
		try {
			authenticationService
				.login({
					username: username,
					password: password,
				})
				.then((data) => {
					console.log(data);
					if (data.status === 'ok') {
						alert('Login successful!');
						navigate('/songs');
					} else {
						alert('Login failed.');
					}
				});
		} catch (error) {
			alert('Login failed.');
			console.log(error);
		}
	};

	return (
		<>
			<AuthNavbarComponent />
			<Row fluid style={{ maxWidth: 500, margin: '80px auto' }}>
				<Col
					md={9}
					className='card'
					style={{
						border: '3px solid purple',
						backgroundColor: 'white',
					}}
				>
					<h1 className='text-center mb-4 card-header'>Login</h1>
					<Form className='card-body' onSubmit={handleSubmit}>
						<Form.Group controlId='formBasicUsername'>
							<Form.Label style={{ marginTop: 10 }}>Username</Form.Label>
							<Form.Control
								type='text'
								placeholder='Enter username'
								value={username}
								onChange={(event) => setUsername(event.target.value)}
								required
							/>
						</Form.Group>

						<Form.Group controlId='formBasicPassword'>
							<Form.Label style={{ marginTop: 30 }}>Password</Form.Label>
							<Form.Control
								type='password'
								placeholder='Password'
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								required
							/>
						</Form.Group>

						<Button
							variant='primary'
							type='submit'
							block='true'
							style={{ marginTop: 20 }}
						>
							Login
						</Button>
					</Form>

					<div className='mt-4'>
						<p className='text-center'>
							Don't have an account? <Link to='/register'>Register</Link>
						</p>
					</div>
				</Col>
			</Row>
		</>
	);
};

export default Login;
