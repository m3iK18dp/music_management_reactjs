import { Form, Button, Col, Row } from 'react-bootstrap';
import '../css/MusicLogin.css';
import { useRef, useState, useEffect } from 'react';
import authenticationService from '../services/AuthenticationService';
import { useNavigate } from 'react-router-dom';
import AuthNavbarComponent from '../components/AuthNavbarComponent';
import CustomFormGroup from '../components/CustomFormGroup';
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
				: user.password !== user.confirmPassword && !isFirst
				? 'Password and Confirm password do not match'
				: '',
		);
		setStatus('');
	}, [user]);

	function handleSubmit() {
		setIsFirst(false);
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
						setStatus('');
						alert('Registration successful!');

						navigate('/login');
					} else {
						setEmailIsFilled(
							'Email already exists. You try again with another email.',
						);
						setStatus('Registration failed.');
					}
				});
			} catch (error) {
				console.log(error);
			}
		else setStatus('Register failed. Please enter full information.');
	}
	return (
		<div>
			<AuthNavbarComponent />
			<div className='background-container' />
			<div className=' background-container-opacity-low' />

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
						backgroundColor: 'rgba(255,255,255,0.2)',
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
								<CustomFormGroup
									funcEnter={handleSubmit}
									controlId='firstName'
									func={set}
									placeholder='Enter first name'
									label='First Name'
									value={user.firstName}
									warning={firstNameIsFilled}
								/>
								<CustomFormGroup
									funcEnter={handleSubmit}
									controlId='lastName'
									func={set}
									placeholder='Enter last name'
									label='Last Name'
									value={user.lastName}
									warning={lastNameIsFilled}
								/>
							</Col>
							<CustomFormGroup
								funcEnter={handleSubmit}
								controlId='email'
								func={set}
								placeholder='Enter email'
								label='Email'
								value={user.email}
								warning={emailIsFilled}
							/>
							<CustomFormGroup
								funcEnter={handleSubmit}
								controlId='password'
								func={set}
								placeholder='Enter password'
								label='Password'
								value={user.password}
								type='password'
								warning={passwordIsFilled}
							/>
							<CustomFormGroup
								funcEnter={handleSubmit}
								controlId='confirmPassword'
								func={set}
								placeholder='Enter confirm password'
								label='Confirm Password'
								value={user.confirmPassword}
								type='password'
								warning={confirmPasswordIsFilled}
							/>

							<Button onClick={handleSubmit} variant='primary'>
								Register
							</Button>
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
							<div className='mt-4'>
								<p className='text-center'>
									You have account? <a href='/login'>Login here</a>
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
