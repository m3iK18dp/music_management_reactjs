import { useState, useEffect } from 'react';
import {
	RiUserUnfollowLine,
	RiUserFollowLine,
	RiUserSettingsLine,
} from 'react-icons/ri';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { MdLockReset } from 'react-icons/md';
import '../../css/customContextMenu.css';

const CustomContextMenuUser = ({
	x,
	y,
	id,
	status,
	navigate,
	handleChangeStatus,
	handleResetPassword,
}) => {
	console.log(x, y);
	const [show, setShow] = useState({
		display: 'none',
		left: x,
		top: y,
	});

	useEffect(() => {
		let winWidth = window.innerWidth,
			cmWidth = 250,
			winHeight = window.innerHeight,
			cmHeight = 210;
		setShow({
			display: 'block',
			left: x > winWidth - cmWidth - 10 ? x - cmWidth : x,
			top: y > winHeight - cmHeight - 10 ? y - cmHeight : y,
		});
	}, [x, y]);

	return (
		<div
			id='context-menu'
			className='context-menu'
			onClick={(e) => e.stopPropagation()}
			style={show}
		>
			<div className='context-menu-row flex'>
				<div onClick={() => navigate('/users/new')}>
					<AiOutlineUserAdd />
					<h6 style={{ marginBottom: 0 }}>Add new User</h6>
				</div>
			</div>
			<hr style={{ margin: 0 }}></hr>
			<div
				style={{
					padding: 5,
					borderRadius: 5,
					marginBottom: 5,
				}}
			>
				<div>
					<h6 style={{ marginBottom: 0 }}>User ID : {id}</h6>
				</div>
			</div>
			<div className='context-menu-row flex'>
				<div
					onClick={() => {
						handleChangeStatus(id);
						document.getElementById(`context-menu`).style.display = 'none';
					}}
				>
					{status ? <RiUserUnfollowLine /> : <RiUserFollowLine />}
					<h6 style={{ marginBottom: 0 }}>
						{(status ? 'Disable' : 'Enable') + ' User'}
					</h6>
				</div>
			</div>

			<div className='context-menu-row flex'>
				<div
					onClick={(event) => {
						handleResetPassword(id);
					}}
				>
					<MdLockReset />
					<h6 style={{ marginBottom: 0 }}>Reset password</h6>
				</div>
			</div>
			<div className='context-menu-row flex'>
				<div onClick={() => navigate(`/user/${id}`)}>
					<RiUserSettingsLine />
					<h6 style={{ marginBottom: 0 }}>Update User</h6>
				</div>
			</div>
		</div>
	);
};
export default CustomContextMenuUser;
