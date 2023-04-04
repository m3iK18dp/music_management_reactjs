import '../css/songs.css';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Form, Table } from 'react-bootstrap';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import {
	BsPlayCircleFill,
	BsSearchHeart,
	BsPauseCircleFill,
	BsSortNumericUpAlt,
	BsSortAlphaUpAlt,
	BsSortNumericDownAlt,
	BsSortAlphaDownAlt,
	BsSkipEndCircleFill,
	BsSkipStartCircleFill,
} from 'react-icons/bs';
import { AiOutlinePlayCircle, AiOutlinePauseCircle } from 'react-icons/ai';
import { RiHeartAddFill } from 'react-icons/ri';
import { MdCancel } from 'react-icons/md';
import { MdOutlineSearchOff } from 'react-icons/md';
import PaginationComponent from '../components/PaginationComponent';
import NavbarComponent from '../components/NavbarComponent';
import songService from '../services/SongService';
import convertPathSearchUrl from '../services/ConvertPathSearchUrl';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomTableHeaderWithSort from '../components/CustomTableHeaderWithSort';
import AudioPlayer from '../components/AudioPlayer';
function Songs() {
	const location = useLocation();
	const isLoggedIn =
		localStorage.getItem('token') && localStorage.getItem('roles');
	const roles = localStorage.getItem('roles');
	const isAdmin = roles !== null ? roles.includes('ROLE_ADMIN') : false;
	const navigate = useNavigate();
	const path = useLocation().search;
	const [search, setSearch] = useState({
		id: Number,
		title: '',
		genre: '',
		musician: '',
		page: 0,
		limit: 10,
		field: 'id',
		type_sort: 'asc',
	});
	const [totalPages, setTotalPages] = useState(0);
	const [currentSongs, setCurrentSongs] = useState([]);
	const [currentSongPlaying, setCurrentSongPlaying] = useState(-1);
	const [isPlaying, setIsPlaying] = useState(false);
	const audioRef = useRef(new Audio());
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
			'title',
			'genre',
			'musician',
			'page',
			'limit',
			'field',
			'type_sort',
		].forEach((prop) => {
			const value = searchParams.get(prop);
			if (value !== null)
				search[prop] = prop === 'page' ? parseInt(value) - 1 : value;
			params[`_${prop}`] =
				prop === 'id' ? (get(prop) > 0 ? get(prop) : -1) : get(prop);
		});

		songService.get(params).then((data) => {
			setTotalPages(data.data.totalPages);
			setCurrentSongs(data.data.content);
			if (currentSongPlaying === -1) {
				setCurrentSongPlaying(data.data.content[0].id);
				//   // handleAudioPlayerUpdate(data.data.content);
			}
		});
	}, [path]);
	useEffect(() => {
		handleAudioPlayerUpdate(currentSongs);
	}, [currentSongPlaying, currentSongs, isPlaying]);
	const handleAudioPlayerUpdate = (songs) => {
		console.log(songs);
		return (
			<AudioPlayer
				songs={songs}
				setIsPlaying={setIsPlaying}
				isPlaying={isPlaying}
				setCurrentSongPlaying={setCurrentSongPlaying}
				currentSongPlaying={currentSongPlaying}
				audioRef={audioRef}
			/>
		);
	};
	const handlePlaySong = (id) => {
		setCurrentSongPlaying(id);
		if (currentSongPlaying !== id) {
			setIsPlaying(true);
			audioRef.current.play();
		} else {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};
	const handleSearch = () => {
		const search = [];

		['id', 'title', 'genre', 'musician'].forEach((field) => {
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
			? ['id', 'title', 'genre', 'musician', 'field', 'type_sort']
			: [searchField]
		).forEach((field) => {
			set(field, { id: Number, title: '', genre: '', musician: '' }[field]);
			search.push({ property: field, value: '' });
		});
		navigate(convertPathSearchUrl(search));
	};
	const handleNewSong = () => {
		navigate('/songs/new');
	};
	const handleUpdateSong = (id) => {
		navigate(`/songs/${id}`);
	};
	const handleDeleteSong = (id) => {
		if (window.confirm('Do you want to delete this song?')) {
			songService.deleteSong(id).then((res) => {
				if (res.status === 'ok') {
					alert('You delete Song success!');
					setCurrentSongs(currentSongs.filter((song) => song.id !== id));
				} else {
					alert('You delete Song failed!');
				}
			});
		}
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
			<div className='background-container' />
			<NavbarComponent />
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
					minWidth: 400,
				}}
				className='background-color'
			>
				<Form
					style={{ overflow: 'hidden', maxWidth: '1200px', margin: '0 auto' }}
				>
					<Row>
						{['Id', 'Title'].map((field) => (
							<React.Fragment key={field}>
								<CustomInput
									set={set}
									get={get}
									field={field}
									type={field === 'Id' ? 'number' : 'text'}
									min={field === 'Id' ? 1 : 'none'}
									func={handleSearch}
									size={4}
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
						{['Genre', 'Musician'].map((field) => (
							<React.Fragment key={field}>
								<CustomInput
									set={set}
									get={get}
									field={field}
									func={handleSearch}
									size={4}
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
					<Row />
					<Row>
						<Col />
						<Col />
						<Col>
							<CustomButton
								IconButton={BsSearchHeart}
								func={handleSearch}
								title={'Search Song'}
								id='search'
							/>
						</Col>
						<Col>
							<CustomButton
								field='all'
								IconButton={MdOutlineSearchOff}
								func={handleCancelSearch}
								title={'Cancel Search All filter'}
								id='cancel-search'
								size={50}
							/>
						</Col>
						{isLoggedIn && (
							<Col>
								<CustomButton
									IconButton={RiHeartAddFill}
									func={handleNewSong}
									title={'Add new Song'}
									id='new-song'
								/>
							</Col>
						)}
						<Col />
						<Col />
					</Row>
				</Form>
				<Row></Row>
				{handleAudioPlayerUpdate(currentSongs)}
			</Container>
			<Container
				style={{
					marginTop: 300,
					overflow: 'hidden',
				}}
			>
				<Table
					striped
					bordered
					style={{
						borderWidth: '0px 0',
					}}
				>
					<colgroup>
						<col width='60' span='2' />
						<col width='auto' span='3' />
						<col width={isLoggedIn ? '110' : '70'} span='1' />
					</colgroup>
					<thead className='table-dark'>
						<tr>
							<th>STT</th>
							{[
								{
									field: 'ID',
									icon: [BsSortNumericUpAlt, BsSortNumericDownAlt],
								},
								{
									field: 'Title',
									icon: [BsSortAlphaUpAlt, BsSortAlphaDownAlt],
								},
								{
									field: 'Genre',
									icon: [BsSortAlphaUpAlt, BsSortAlphaDownAlt],
								},
								{
									field: 'Musician',
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
							<th className='column-'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{currentSongs.map((song, index) => (
							<tr
								style={{
									backgroundColor:
										currentSongPlaying === song.id
											? 'rgba(180, 200, 180, 0.5)'
											: 'transparent',
								}}
								key={song.id}
							>
								<td>{index + 1}</td>
								<td>{song.id}</td>
								<td style={{ textAlign: 'left' }}>{song.title}</td>
								<td>{song.genre}</td>
								<td>{song.musician}</td>
								<td>
									<CustomButton
										field={song.id}
										IconButton={
											currentSongPlaying !== song.id || !isPlaying
												? AiOutlinePlayCircle
												: AiOutlinePauseCircle
										}
										size={30}
										func={() => handlePlaySong(song.id)}
										title={
											currentSongPlaying !== song.id || !isPlaying
												? 'Play'
												: 'Pause'
										}
										id={`play-pause-${song.id}`}
									/>
									{isLoggedIn && isAdmin && (
										<>
											<CustomButton
												field={song.id}
												IconButton={AiOutlineEdit}
												size={30}
												func={handleUpdateSong}
												title={'Edit Song'}
												id={`edit-song-${song.id}`}
											/>
											<CustomButton
												field={song.id}
												IconButton={AiOutlineDelete}
												size={30}
												func={handleDeleteSong}
												title={'Delete Song'}
												id={`delete-song-${song.id}`}
											/>
										</>
									)}
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
					totalPages={totalPages}
					objectsPerPage={get('limit')}
				/>
			</Row>
		</div>
	);
}

export default Songs;
