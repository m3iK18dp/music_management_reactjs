import { Form, Button, Col, Row } from 'react-bootstrap';
import '../css/MusicLogin.css';
import { useRef, useState, useEffect } from 'react';
import authenticationService from '../services/AuthenticationService';
import { useNavigate } from 'react-router-dom';
import AuthNavbarComponent from '../components/AuthNavbarComponent';
function Register() {
	const navigate = useNavigate();
	const [user, setUser] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const set = (prop, value) => {
		setUser({ ...user, [prop]: value });
	};
	const [firstNameIsFilled, setFirstNameIsFilled] = useState('');
	const [lastNameIsFilled, setLastNameIsFilled] = useState('');
	const [emailIsFilled, setEmailIsFilled] = useState('');
	const [passwordIsFilled, setPasswordIsFilled] = useState('');
	const [confirmPasswordIsFilled, setConfirmPasswordIsFilled] = useState('');
	const [status, setStatus] = useState('');
	const [isFirst, setIsFirst] = useState(true);

	useEffect(() => {
		setFirstNameIsFilled(
			user.firstName === '' && !isFirst ? 'Please enter First name' : '',
		);
		setLastNameIsFilled(
			user.lastName === '' && !isFirst ? 'Please enter Lase name' : '',
		);
		setEmailIsFilled(user.email === '' && !isFirst ? 'Please enter email' : '');
		setPasswordIsFilled(
			user.password === '' && !isFirst ? 'Please enter Password' : '',
		);
		setConfirmPasswordIsFilled(
			user.confirmPassword === '' && !isFirst
				? 'Please enter Confirm Password'
				: user.password !== user.confirmPassword
				? 'Password and Confirm password do not match'
				: '',
		);
		setStatus('');
		setIsFirst(false);
	}, [user]);

	function handleSubmit() {
		if (
			!(
				user.firstName === '' ||
				user.lastName === '' ||
				user.email === '' ||
				user.password === '' ||
				user.confirmPassword === ''
			)
		)
			try {
				setStatus('Please wait...Saving is in progress');
				authenticationService.register(user).then((res) => {
					if (res.status === 'ok') {
						alert('Registration successful!');
						navigate('/login');
					} else {
						setStatus('Registration failed');
					}
				});
			} catch (error) {
				console.log(error);
			}
	}
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
						Registration
					</h1>

					<div
						className='card-body'
						style={{
							with: '80%',
							minWidth: 400,
							maxWidth: 900,
						}}
					>
						<Form>
							<Col>
								<Form.Group className='mb-3' controlId='firstName'>
									<Form.Label>First Name</Form.Label>
									<Form.Control
										type='text'
										value={user.firstName}
										onChange={(event) => set('firstName', event.target.value)}
										placeholder='Enter first name'
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
											{firstNameIsFilled}
										</p>
									</div>
								</Form.Group>
								<Form.Group className='mb-3' controlId='lastName'>
									<Form.Label>Last Name</Form.Label>
									<Form.Control
										type='text'
										value={user.lastName}
										onChange={(event) => set('lastName', event.target.value)}
										placeholder='Enter last name'
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
											{lastNameIsFilled}
										</p>
									</div>
								</Form.Group>
							</Col>

							<Form.Group className='mb-3' controlId='email'>
								<Form.Label>Email</Form.Label>
								<Form.Control
									type='email'
									value={user.email}
									onChange={(event) => set('email', event.target.value)}
									required
									placeholder='Enter email address'
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
										{emailIsFilled}
									</p>
								</div>
							</Form.Group>
							<Form.Group className='mb-3' controlId='password'>
								<Form.Label>Password</Form.Label>
								<Form.Control
									type='password'
									value={user.password}
									onChange={(event) => set('password', event.target.value)}
									placeholder='Enter password'
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
							<Form.Group className='mb-3' controlId='password'>
								<Form.Label>Confirm Password</Form.Label>
								<Form.Control
									type='password'
									value={user.confirmPassword}
									onChange={(event) =>
										set('confirmPassword', event.target.value)
									}
									placeholder='Enter confirm password'
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
										{confirmPasswordIsFilled}
									</p>
								</div>
							</Form.Group>
							<Button onClick={handleSubmit} variant='primary'>
								Register
							</Button>
							<div className='mt-4'>
								<p className='text-center'>
									You have account? <a href='/login'>Login here</a>
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
}
export default Register;
