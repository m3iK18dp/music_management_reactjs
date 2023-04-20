/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Col } from 'react-bootstrap';
import '../css/MusicLogin.css';
import { useState, useEffect } from 'react';
import authenticationService from '../services/AuthenticationService';
import { Link, useNavigate } from 'react-router-dom';
import NavbarComponent from '../components/NavbarComponent';
import CustomFormGroup from '../components/CustomFormGroup';
import CustomButton from '../components/CustomButton';
import { checkToken } from '../services/CheckToken';
function Register() {
	const navigate = useNavigate();
	useEffect(() => {
		checkToken(navigate, 0);
		if (localStorage.getItem('token')) navigate('/songs');
	});
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
	const [checkForm, setCheckForm] = useState(true);
	const [inProcessing, setInProcessing] = useState(false);

	const validateInput = (field, maxLength, message = '') => {
		if (field.length === 0) {
			setCheckForm(false);
			return !isFirst ? message : '';
		}
		if (field.length > maxLength) {
			setCheckForm(false);
			return `You have exceeded the allowed number of characters ${field.length}/${maxLength}`;
		}
		return '';
	};
	useEffect(() => {
		setCheckForm(true);
		setFirstNameIsFilled(
			validateInput(user.firstName, 40, `Please enter first name`),
		);
		setLastNameIsFilled(
			validateInput(user.lastName, 10, `Please enter last name`),
		);
		setEmailIsFilled(validateInput(user.email, 50, 'Please enter email'));
		setPasswordIsFilled(
			validateInput(user.password, Infinity, 'Please enter password'),
		);
		if (user.password !== '') {
			if (user.password.length < 8 || user.password.length > 20) {
				setCheckForm(false);
				setPasswordIsFilled(
					'Invalid password. Password must be between 8 and 20 characters',
				);
			} else if (
				!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/.test(
					user.password,
				)
			) {
				setCheckForm(false);
				setPasswordIsFilled(
					'Invalid password. Password needs at least 1 uppercase, 1 lowercase, 1 number and 1 special character in @#$%^&+=_!',
				);
			} else setPasswordIsFilled('');
		}
		setConfirmPasswordIsFilled(
			validateInput(
				user.confirmPassword,
				Infinity,
				'Please enter Confirm Password',
			),
		);
		if (user.confirmPassword !== '')
			if (user.password !== user.confirmPassword) {
				setCheckForm(false);
				setConfirmPasswordIsFilled(
					'Password and Confirm password do not match',
				);
			} else setConfirmPasswordIsFilled('');
	}, [isFirst, user]);
	useEffect(() => {
		setStatus('');
	}, [user]);
	function handleSubmit() {
		setIsFirst(false);
		if (checkForm) {
			setStatus('Please wait...Saving is in progress');
			setInProcessing(true);
			authenticationService.register(user, navigate).then((res) => {
				if (res.status === 'ok') {
					setStatus('');
					alert('Registration successful!');
					navigate('/songs');
				} else {
					setEmailIsFilled(res.message);
					setStatus('Registration failed.');
				}
				setInProcessing(false);
			});
		} else {
			setStatus('Failed. Please check information entered.');
		}
	}
	return (
		<div>
			<NavbarComponent disabled={inProcessing} />
			<div className='background-container' />
			<div className=' background-container-opacity-low' />

			<div
				fluid='true'
				style={{
					with: '50%',
					minWidth: 300,
					maxWidth: 500,
					margin: '100px auto',
				}}
			>
				<Col
					className='card'
					style={{
						border: '3px solid purple',
						backgroundColor: 'rgba(255,255,255,0.2)',
						padding: '20px',
					}}
				>
					<h1
						className='text-center neon'
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
							minWidth: 250,
							maxWidth: 550,
						}}
					>
						<Form>
							<Col>
								<CustomFormGroup
									formGroupStyle={{ width: '100%', marginRight: 20 }}
									funcEnter={handleSubmit}
									controlId='firstName'
									func={set}
									placeholder='Enter first name'
									label='First Name'
									value={user.firstName}
									warning={firstNameIsFilled}
									readonly={inProcessing}
								/>
								<CustomFormGroup
									funcEnter={handleSubmit}
									controlId='lastName'
									func={set}
									placeholder='Enter last name'
									label='Last Name'
									value={user.lastName}
									warning={lastNameIsFilled}
									readonly={inProcessing}
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
								readonly={inProcessing}
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
								readonly={inProcessing}
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
								readonly={inProcessing}
							/>

							<CustomButton
								className='text-center '
								style={{
									width: 90,
									height: 40,
									margin: '0 auto',
									textAlign: 'center',
									backgroundColor: 'rgba(255,255,255,0.4)',
									borderRadius: 15,
									border: '1px solid white',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}
								size={20}
								color='white'
								variant='primary'
								func={handleSubmit}
								text='Register'
								disable={inProcessing}
							/>
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
							<div className='mt-4'>
								<p className='text-center'>
									You have account?{' '}
									<Link to={inProcessing ? false : '/login'} className=' neon'>
										Login here
									</Link>
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
