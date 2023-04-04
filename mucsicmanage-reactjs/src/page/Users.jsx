import '../css/users.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Table } from 'react-bootstrap';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { FaUserEdit } from 'react-icons/fa';
import {
	BsSortNumericUpAlt,
	BsSortAlphaUpAlt,
	BsSortNumericDownAlt,
	BsSortAlphaDownAlt,
} from 'react-icons/bs';
import {
	RiUserSearchLine,
	RiUserFollowLine,
	RiUserUnfollowLine,
} from 'react-icons/ri';
import { MdCancel, MdLockReset } from 'react-icons/md';
import { ImCancelCircle } from 'react-icons/im';
import PaginationComponent from '../components/PaginationComponent';
import NavbarComponent from '../components/NavbarComponent';
import userService from '../services/UserService';
import convertPathSearchUrl from '../services/ConvertPathSearchUrl';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomTableHeaderWithSort from '../components/CustomTableHeaderWithSort';
function Users() {
	const navigate = useNavigate();
	const path = useLocation().search;
	const [search, setSearch] = useState({
		id: Number,
		email: '',
		name: '',
		role_ids: [],
		status: '',
		page: 0,
		limit: 10,
		field: 'id',
		type_sort: 'asc',
		totalPages: 0,
		currentUsers: [],
		roles: [],
	});
	const get = (field) => {
		return search[field];
	};
	const set = (field, value) => {
		setSearch((prevState) => ({
			...prevState,
			[field]: value,
		}));
	};
	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const params = {};
		[
			'id',
			'email',
			'name',
			'role_ids',
			'status',
			'page',
			'limit',
			'field',
			'type_sort',
		].forEach((prop) => {
			const value = searchParams.get(prop);
			if (value !== null) {
				if (!(prop === 'id' && value < 1))
					search[prop] =
						prop === 'page'
							? parseInt(value) - 1
							: prop === 'role_ids'
							? value.split(',').map(Number)
							: value;
			}
			params[`_${prop}`] =
				prop === 'id' ? (get(prop) > 0 ? get(prop) : -1) : get(prop);
		});

		userService.getRoles({}).then((data) => {
			set('roles', data.data.content);
		});

		userService.get(params).then((data) => {
			set('totalPages', data.data.totalPages);
			set('currentUsers', data.data.content);
		});
	}, [path]);
	useEffect(() => {
		handleSearch();
	}, [search.role_ids, search.status]);
	const covertArrayObjectToString = (roles) => {
		if (roles) return roles.map((role) => (role ? role.name : null)).join(', ');
		return '';
	};
	const changeStatus = (id) => {
		const user = get('currentUsers').find((user) => user.id === id);
		userService.changeStatusUser(id).then((res) => {
			if (res.status === 'ok') {
				user.status = !user.status;
				navigate(convertPathSearchUrl());
			}
		});
	};
	const handleResetPassword = (id) => {
		userService.resetPasswordUser(id).then((res) => {
			if (res.status === 'ok') {
				alert('Reset Password for user have ' + id + ' success');
			} else alert('Reset Password for user have ' + id + ' failed');
		});
	};
	const handleSearch = () => {
		const search = [];
		['id', 'email', 'name', 'role_ids', 'status'].forEach((field) => {
			search.push({
				property: field,
				value: get(field),
			});
		});
		navigate(convertPathSearchUrl(search));
	};
	const handleCancelSearch = (searchField) => {
		const search = [];
		(searchField === 'all'
			? ['id', 'email', 'name', 'role_ids', 'status', 'field', 'type_sort']
			: [searchField]
		).forEach((field) => {
			set(
				field,
				{
					id: Number,
					email: '',
					name: '',
					role_ids: [],
					status: '',
				}[field],
			);
			search.push({ property: field, value: '' });
		});
		navigate(convertPathSearchUrl(search));
	};
	const handleNewUser = () => {
		navigate('/users/new');
	};
	const handleUpdateUser = (id) => {
		navigate(`/users/${id}`);
	};
	const handleSort = (field) => {
		navigate(
			convertPathSearchUrl([
				{ property: 'field', value: field },
				{
					property: 'type_sort',
					value:
						get('field') !== field
							? 'asc'
							: get('type_sort') === 'asc'
							? 'desc'
							: 'asc',
				},
			]),
		);
	};
	return (
		<div style={{ overflow: 'hidden', width: '90%' }}>
			<NavbarComponent />
			<div className='background-container ' />
			<Container
				fluid
				style={{
					position: 'fixed',
					top: 55,
					left: 0,
					right: 0,
					zIndex: 9,
					padding: 5,
					backgroundColor: '#f8f9fa',
					minWidth: 450,
				}}
				className='background-color'
			>
				<Form
					style={{ overflow: 'hidden', maxWidth: '1200px', margin: '0 auto' }}
				>
					<Row>
						{['Id', 'Email', 'Name'].map((field) => (
							<React.Fragment key={field}>
								<CustomInput
									set={set}
									get={get}
									field={field}
									type={field === 'Id' ? 'number' : 'text'}
									min={field === 'Id' ? 1 : 'none'}
									func={handleSearch}
									size={2}
								/>
								<Col className='col' xl={1}>
									<CustomButton
										field={field}
										IconButton={MdCancel}
										func={handleCancelSearch}
										title={`Cancel Search with ${field}`}
										id={`${field}-filter`}
									/>
								</Col>
							</React.Fragment>
						))}
					</Row>
					<Row>
						<Col xs={1}></Col>

						<Col xs={1}>
							<Form.Label>Role</Form.Label>
						</Col>
						<Col xs={4}>
							{Array.from(get('roles') ? get('roles') : []).map((role) => (
								<div key={role.id}>
									<Form.Check
										type='checkbox'
										label={role.name}
										name={role.name}
										value={role.id}
										checked={Array.from(
											get('role_ids') ? get('role_ids') : [],
										).find((roleId) => roleId == role.id)}
										onChange={(event) => {
											const isChecked = event.target.checked;
											if (isChecked) {
												set('role_ids', [
													...Array.from(get('role_ids') ? get('role_ids') : []),
													role.id,
												]);
											} else {
												set(
													'role_ids',
													Array.from(get('role_ids')).filter(
														(roleId) => roleId != role.id,
													),
												);
											}
										}}
									/>
								</div>
							))}
						</Col>
						<Col xs={1}></Col>
						<Col xs={1}>
							<Form.Label>Role</Form.Label>
						</Col>
						<Col xs={4}>
							{['1', '0', ''].map((status) => (
								<div key={`status_${status}`}>
									<Form.Check
										type='radio'
										label={
											status === '1'
												? 'Enabled'
												: status === '0'
												? 'Disabled'
												: 'None'
										}
										name='status'
										value={status}
										checked={status === get('status')}
										onChange={(event) =>
											event.target.checked
												? set('status', event.target.value)
												: ''
										}
									/>
								</div>
							))}
						</Col>
					</Row>
					<Row />
					<Row>
						<Col />
						<Col />
						<Col>
							<CustomButton
								IconButton={RiUserSearchLine}
								func={handleSearch}
								title={'Search User'}
								id='search'
							/>
						</Col>
						<Col>
							<CustomButton
								field='all'
								IconButton={ImCancelCircle}
								func={handleCancelSearch}
								title={'Cancel Search All filter'}
								id='cancel'
							/>
						</Col>
						<Col>
							<CustomButton
								IconButton={AiOutlineUserAdd}
								func={handleNewUser}
								title={'Add new User'}
								id='new'
							/>
						</Col>
						<Col />
						<Col />
					</Row>
				</Form>
			</Container>
			<Container
				style={{
					marginTop: '250px',
					overflow: 'hidden',
					overflowX: 'scroll',
				}}
			>
				<Table striped bordered>
					<thead className='table-dark'>
						<tr>
							<th>STT</th>
							{[
								{
									field: 'ID',
									icon: [BsSortNumericUpAlt, BsSortNumericDownAlt],
								},
								{
									field: 'Email',
									icon: [BsSortAlphaUpAlt, BsSortAlphaDownAlt],
								},
								{
									field: 'FirstName',
									icon: [BsSortAlphaUpAlt, BsSortAlphaDownAlt],
								},
								{
									field: 'LastName',
									icon: [BsSortAlphaUpAlt, BsSortAlphaDownAlt],
								},
							].map((row) => {
								return (
									<CustomTableHeaderWithSort
										get={get}
										key={row.field}
										field={row.field}
										func={handleSort}
										IconAsc={row.icon[0]}
										IconDesc={row.icon[1]}
									/>
								);
							})}
							<th className='column-'>Roles</th>
							<th className='column-'>Status</th>
							<th className='column-'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{get('currentUsers').map((user, index) => (
							<tr key={user.id}>
								<td>{index + 1}</td>
								<td>{user.id}</td>
								<td style={{ textAlign: 'left' }}>{user.email}</td>
								<td style={{ textAlign: 'left' }}>{user.firstName}</td>
								<td style={{ textAlign: 'left' }}>{user.lastName}</td>
								<td>{covertArrayObjectToString(user.roles)}</td>
								<td>
									{!user.status ? (
										<CustomButton
											field={user.id}
											IconButton={RiUserUnfollowLine}
											size={30}
											func={changeStatus}
											title={'Disable User'}
											id={`td-status-disable-${user.id}`}
											disable={user.id === 1}
										/>
									) : (
										<CustomButton
											field={user.id}
											IconButton={RiUserFollowLine}
											size={30}
											func={changeStatus}
											title={'Enable User'}
											id={`td-status-enable-${user.id}`}
											disable={user.id === 1}
										/>
									)}
								</td>
								<td>
									<CustomButton
										field={user.id}
										IconButton={MdLockReset}
										size={30}
										func={handleResetPassword}
										title={'Reset Password for User'}
										id={`reset-password-${user.id}`}
										disable={user.id === 1}
									/>
									<CustomButton
										field={user.id}
										IconButton={FaUserEdit}
										size={30}
										func={handleUpdateUser}
										title={'Edit User'}
										id={`edit-${user.id}`}
										disable={user.id === 1}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Container>
			<div style={{ visibility: 'hidden', height: 50 }} />
			<Row>
				<PaginationComponent
					currentPage={get('page')}
					totalPages={get('totalPages')}
					objectsPerPage={get('limit')}
				/>
			</Row>
		</div>
	);
}

export default Users;
