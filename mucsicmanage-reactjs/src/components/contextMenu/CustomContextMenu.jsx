import { useState, useEffect } from 'react';
import playlistService from '../../services/PlayListService';
import CustomButton from '../CustomButton';
import { IoMdAdd } from 'react-icons/io';
import { AiOutlineRight, AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { RiPlayListAddFill, RiHeartAddFill } from 'react-icons/ri';
import { TbPlaylistOff } from 'react-icons/tb';
import { CiPlay1 } from 'react-icons/ci';
import '../../css/customContextMenu.css';
const CustomContextMenu = ({
	x,
	y,
	id,
	playlists,
	setPlaylists,
	navigate,
	handlePlaySong,
	handleNewSong,
	handleUpdateSong,
	handleDeleteSong,
	isLoggedIn,
	isAdmin,
	location,
}) => {
	console.log(x, y);
	const [showFormAddPlaylist, setShowFormAddPlaylist] = useState(false);
	const [playlist, setPlaylist] = useState({ name: '' });
	const [show, setShow] = useState({
		display: 'none',
		left: x,
		top: y,
	});
	const [showPlaylistMenu, setShowPlaylistMenu] = useState({
		display: 'none',
		x: 245,
		y: 0,
	});
	const set = (prop, value) => {
		setPlaylist({ ...playlist, [prop]: value });
	};
	const get = (field) => {
		return playlist[field];
	};

	useEffect(() => {
		// const contextMenu = document.getElementById(`context-menu`);
		// const playlistMenu = document.getElementById(`playlist-menu`);

		let winWidth = window.innerWidth,
			cmWidth = 250,
			winHeight = window.innerHeight,
			cmHeight = 245;

		setShowPlaylistMenu({
			display: 'none',
			left: x > winWidth - cmWidth - 245 ? 5 - 200 : 245,
			top: y > winHeight - 245 ? cmHeight - 245 : 0,
		});

		setShow({
			display: 'block',
			left: x > winWidth - cmWidth - 10 ? x - cmWidth : x,
			top: y > winHeight - cmHeight - 10 ? y - cmHeight : y,
		});
	}, [x, y]);
	const addPlaylist = () => {
		playlistService.insertPlaylist(playlist, navigate).then((res) => {
			if (res.status === 'ok') {
				setPlaylists([...playlists, res.data]);
				setPlaylist({ name: '' });
				listPlaylist(playlists);
				alert('Add playlist success.');
			} else alert('Add playlist Failed.');
		});
	};
	const addSongToPlaylist = (playlistId) => {
		playlistService.addSongToPlayList(playlistId, id, navigate).then((res) => {
			if (res.status === 'ok') {
				// setPlaylists([...playlists, res.data]);
				alert('Add song to playlist success.');
			} else alert('Add song to playlist Failed.');
		});
	};
	const deleteSongInPlaylist = (playlistId) => {
		playlistService
			.deleteSongInPlaylist(playlistId, id, navigate)
			.then((res) => {
				if (res.status === 'ok') {
					// setPlaylists([...playlists, res.data]);
					alert('Delete song in this playlist success.');
				} else alert('Delete song in this playlist Failed.');
			});
	};
	function listPlaylist(pls = playlists) {
		return pls.map((playlist) => (
			// <>
			<div
				className='context-menu-row'
				style={{
					borderBottom: '1px solid rgba(255,255,255,0.6)',
					marginBottom: 5,
				}}
				key={'context-playlist-' + playlist.id}
				onClick={() => {
					addSongToPlaylist(playlist.id);
				}}
				onMouseOver={(e) => {
					e.target.style.cursor = 'pointer';
				}}
			>
				<h6 style={{ marginBottom: 0 }}>{playlist.name}</h6>
			</div>
		));
	}
	return (
		<div
			id='context-menu'
			className='context-menu'
			onClick={(e) => e.stopPropagation()}
			style={show}
		>
			<div
				className='context-menu-row flex'
				onMouseOver={(e) => {
					document.getElementById('playlist-menu').style.display = 'none';
				}}
				onClick={() => handleNewSong()}
			>
				<div>
					<RiHeartAddFill />
					<h6 style={{ marginBottom: 0 }}>Add new Song</h6>
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
					<h6 style={{ marginBottom: 0 }}>Song ID : {id}</h6>
				</div>
			</div>
			<div className='context-menu-row flex'>
				<div
					onMouseOver={(e) => {
						document.getElementById(`playlist-menu`).style.display = 'none';
					}}
					onClick={() => handlePlaySong(id)}
				>
					<CiPlay1 />
					<h6 style={{ marginBottom: 0 }}>Play Song</h6>
				</div>
			</div>
			{isLoggedIn && (
				<>
					<div
						className='context-menu-row flex'
						onMouseOver={(e) => {
							document.getElementById('playlist-menu').style.display = 'block';
						}}
					>
						<div>
							<RiPlayListAddFill />
							<h6 style={{ marginBottom: 0 }}>Add Song to Playlist</h6>
						</div>
						<AiOutlineRight></AiOutlineRight>
					</div>
					{window.location.pathname.includes('my_playlist') && (
						<div
							className='context-menu-row flex'
							onMouseOver={(e) => {
								document.getElementById(`playlist-menu`).style.display = 'none';
							}}
							onClick={(event) => {
								event.stopPropagation();
								const playlistIdInPath = window.location.pathname.split('/');
								deleteSongInPlaylist(
									playlistIdInPath[playlistIdInPath.length - 1],
								);
							}}
						>
							<div>
								<TbPlaylistOff></TbPlaylistOff>
								<h6 style={{ marginBottom: 0, backgroundColor: 'unset' }}>
									Delete Song in this Playlist
								</h6>
							</div>
						</div>
					)}

					<div
						id='playlist-menu'
						className='context-menu list-playlist'
						style={showPlaylistMenu}
					>
						<div
							className='context-menu-row flex'
							onClick={(event) => {
								event.stopPropagation();
								setShowFormAddPlaylist(!showFormAddPlaylist);
							}}
							onMouseOver={(event) => {
								event.target.style.cursor = 'pointer';
							}}
							style={{
								borderBottom: '1px solid rgba(255,255,255,1)',
								marginBottom: 10,
							}}
						>
							<h6>Add Playlist</h6>
							<IoMdAdd></IoMdAdd>
						</div>
						{showFormAddPlaylist && (
							<div className='context-menu-row flex'>
								<h6>Name:</h6>
								<input
									onClick={(event) => event.stopPropagation()}
									onChange={(event) => {
										// event.stopPropagation();
										set('name', event.target.value);
									}}
									style={{ width: '100%' }}
									value={get('name')}
									onKeyDown={(event) => {
										if (event.key === 'Enter') {
											event.preventDefault();
											addPlaylist();
										}
									}}
									placeholder='Enter name playlist'
								></input>

								<CustomButton
									IconButton={IoMdAdd}
									func={addPlaylist}
									size={20}
									id='add-playlist'
									color='black'
								/>
							</div>
						)}
						{listPlaylist(playlists)}
					</div>
					{(JSON.parse(sessionStorage.getItem('isRevoked')) || isLoggedIn) &&
						(isAdmin || location.pathname === '/my_songs') && (
							<>
								<div className='context-menu-row flex'>
									<div
										onMouseOver={(e) => {
											document.getElementById(`playlist-menu`).style.display =
												'none';
										}}
										onClick={() => handleUpdateSong(id)}
									>
										<AiOutlineEdit />
										<h6 style={{ marginBottom: 0 }}>Edit Song</h6>
									</div>
								</div>
								<div className='context-menu-row flex'>
									<div
										onMouseOver={(e) => {
											document.getElementById(`playlist-menu`).style.display =
												'none';
										}}
										onClick={() => handleDeleteSong(id)}
									>
										<AiOutlineDelete />
										<h6 style={{ marginBottom: 0 }}>Delete Song</h6>
									</div>
								</div>
							</>
						)}
				</>
			)}
		</div>
	);
};
export default CustomContextMenu;
