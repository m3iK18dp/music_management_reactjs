/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable jsx-a11y/anchor-is-valid */
import '../css/songs.css';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Table } from 'react-bootstrap';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import {
	BsPlayCircle,
	BsSearchHeart,
	BsPauseCircle,
	BsSortNumericUpAlt,
	BsSortAlphaUpAlt,
	BsSortNumericDownAlt,
	BsSortAlphaDownAlt,
} from 'react-icons/bs';
import { RiHeartAddFill } from 'react-icons/ri';
import { BiSkipNextCircle, BiSkipPreviousCircle } from 'react-icons/bi';
import { MdCancel } from 'react-icons/md';
import PaginationComponent from '../components/PaginationComponent';
import NavbarComponent from '../components/NavbarComponent';
import songService from '../services/SongService';
import convertPathSearchUrl from '../services/ConvertPathSearchUrl';
function Songs() {
	const navigate = useNavigate();
	const location = useLocation();
	const path = useLocation().search;
	const [search, setSearch] = useState('');
	const [typeSearch, setTypeSearch] = useState('title');

	const [totalPages, setTotalPages] = useState();

	const [currentSongs, setCurrentSongs] = useState([]);
	const [currentSongPlay, setCurrentSongPlay] = useState(0);
	const [currentSongPlayUrl, setCurrentSongPlayUrl] = useState('');
	const [currentSongIndex, setCurrentSongIndex] = useState(0);

	const [playing, setPlaying] = useState(false);
	const audio = useRef(new Audio());
	const searchParams = useRef();
	useEffect(() => {
		if (path !== '')
			path
				.slice(1)
				.split('&')
				.forEach((pathParam) => {
					const param = pathParam.split('=');
					searchParams['_' + param[0]] =
						param[0] === 'page' ? parseInt(param[1]) - 1 : param[1];
				});

		// if (!searchParams[`_${typeSearch}`]) {
		// 	searchParams[`_${typeSearch}`] = '';
		// }
		if (!searchParams['_page']) {
			searchParams['_page'] = 0;
		}
		if (!searchParams['_limit']) {
			searchParams['_limit'] = 10;
		}
		if (!searchParams['_page']) {
			searchParams['_page'] = 0;
		}
		if (!searchParams['_field']) {
			searchParams['_field'] = 'id';
		}
		if (!searchParams['_type_sort']) {
			searchParams['_type_sort'] = 'asc';
		}
		console.log(searchParams);

		songService.get(searchParams).then((data) => {
			console.log(data.data);
			setTotalPages(data.data.totalPages);
			setCurrentSongs(data.data.content);
			setCurrentSongPlay(data.data.content[0].id);
			setCurrentSongPlayUrl(data.data.content[0].url);
		});
	}, [path]);
	const handlePlaySong = (id, url) => {
		if (currentSongPlay !== id) {
			setCurrentSongPlay(id);
			setCurrentSongPlayUrl(url);
			handlePlay(true);
		} else {
			setCurrentSongPlay(-1);
			handlePause();
		}
	};
	const handleSearch = () => {
		if (search !== '') {
			navigate(convertPathSearchUrl([{ property: typeSearch, value: search }]));
		}
	};
	const handleCancelSearch = () => {
		if (location.search !== '') {
			setSearch('');
			setTypeSearch('title');
			navigate(
				convertPathSearchUrl([{ property: typeSearch, value: search }], 0),
			);
		}
	};
	const handleDelete = (id) => {
		if (window.confirm('Do you want to delete this song?')) {
			songService.deleteSong(id);
			setCurrentSongs(currentSongs.filter((song) => song.id !== id));
		}
	};
	const handlePlay = () => {
		setPlaying(true);
		audio.current.play();
	};
	const handlePause = () => {
		setPlaying(false);
		audio.current.pause();
	};
	const previousSong = () => {
		const newIndex =
			(currentSongIndex + currentSongs.length - 1) % currentSongs.length;
		setCurrentSongIndex(newIndex);
		setCurrentSongPlayUrl(currentSongs[newIndex].url);
		setCurrentSongPlay(currentSongs[newIndex].id);
	};
	const nextSong = () => {
		const newIndex = (currentSongIndex + 1) % currentSongs.length;
		setCurrentSongIndex(newIndex);
		setCurrentSongPlayUrl(currentSongs[newIndex].url);
		setCurrentSongPlay(currentSongs[newIndex].id);
	};
	const handleSort = (field) => {
		const oldField = searchParams['_field'];
		const oldType = searchParams['_type_sort'];
		navigate(
			convertPathSearchUrl([
				{ property: 'field', value: field },
				{
					property: 'type_sort',
					value:
						oldField !== field ? 'asc' : oldType === 'asc' ? 'desc' : 'asc',
				},
			]),
		);
	};
	return (
		<>
			<NavbarComponent />
			<Container fluid style={{ marginTop: 80 }}>
				<Form>
					<Row>
						<Col sm={6}>
							<Form.Group>
								<Form.Control
									type='text'
									onKeyDown={(event) => {
										if (event.key === 'Enter') {
											event.preventDefault();
											handleSearch();
										}
									}}
									placeholder={search ? search : 'Enter Search'}
									value={search}
									onChange={(event) => setSearch(event.target.value)}
								/>
							</Form.Group>
						</Col>
						<Col sm={3}>
							<Form.Group>
								<Form.Control
									as='select'
									value={typeSearch}
									onChange={(event) => setTypeSearch(event.target.value)}
								>
									<option value='id'>Id</option>
									<option value='title'>Title</option>
									<option value='musician'>Musician</option>
									<option value='genre'>Genre</option>
								</Form.Control>
							</Form.Group>
						</Col>

						<Col sm={3}>
							<div
								className='mr-15'
								style={{ display: 'inline' }}
								onClick={handleSearch}
								onMouseOver={(e) => {
									e.target.style.color = 'rgb(40, 144, 144)';
									e.target.style.cursor = 'pointer';
								}}
								onMouseOut={(e) => (e.target.style.color = 'black')}
								title='Search Song'
							>
								<BsSearchHeart size={40} color='black'></BsSearchHeart>
							</div>

							<div
								className='mr-15'
								style={{ display: 'inline' }}
								onClick={handleCancelSearch}
								onMouseOver={(e) => {
									e.target.style.color = 'rgb(40, 144, 144)';
									e.target.style.cursor = 'pointer';
								}}
								onMouseOut={(e) => (e.target.style.color = 'black')}
								title='Cancel Search'
							>
								<MdCancel size={40} color='black'></MdCancel>
							</div>
							<Link
								style={{ display: 'inline' }}
								to={'/songs/new'}
								onMouseOver={(e) => {
									e.target.style.color = 'rgb(40, 144, 144)';
									e.target.style.cursor = 'pointer';
								}}
								onMouseOut={(e) => (e.target.style.color = 'black')}
								title='Add new Song'
							>
								<RiHeartAddFill size={40} color='black'></RiHeartAddFill>
							</Link>
						</Col>
					</Row>
				</Form>{' '}
				<audio
					src={currentSongPlayUrl}
					controls={['volume', 'seekbar', 'duration']}
					autoPlay={playing}
					ref={audio}
				/>
				<div className='controls-audio'>
					<div
						className='mr-15'
						onClick={previousSong}
						onMouseOver={(e) => {
							e.target.style.color = 'rgb(40, 144, 144)';
							e.target.style.cursor = 'pointer';
						}}
						onMouseOut={(e) => (e.target.style.color = 'black')}
					>
						<BiSkipPreviousCircle size={30} color='black' variant='primary' />
					</div>
					<div
						className='mr-15'
						onMouseOver={(e) => {
							e.target.style.color = 'rgb(40, 144, 144)';
							e.target.style.cursor = 'pointer';
						}}
						onMouseOut={(e) => (e.target.style.color = 'black')}
					>
						{!playing && (
							<BsPlayCircle
								onClick={handlePlay}
								size={30}
								color='black'
								variant='primary'
							/>
						)}
						{playing && (
							<BsPauseCircle
								onClick={handlePause}
								size={30}
								color='black'
								variant='primary'
							/>
						)}
					</div>
					<div
						onClick={nextSong}
						className='mr-15'
						onMouseOver={(e) => {
							e.target.style.color = 'rgb(40, 144, 144)';
							e.target.style.cursor = 'pointer';
						}}
						onMouseOut={(e) => (e.target.style.color = 'black')}
					>
						<BiSkipNextCircle size={30} color='black' variant='primary' />
					</div>
				</div>
				<Table striped bordered>
					<colgroup>
						<col width='50' span='2' />
						<col width='auto' span='1' />
						<col width='110' span='2' />
						<col width='150' span='1' />
					</colgroup>
					<thead className='table-dark'>
						<tr>
							<th>STT</th>
							<th onClick={() => handleSort('id')}>
								ID
								{searchParams['_field'] === 'id' && (
									<>
										{searchParams['_type_sort'] === 'asc' && (
											<BsSortNumericUpAlt
												size={15}
												style={{ marginLeft: '2px' }}
											/>
										)}
										{searchParams['_type_sort'] === 'desc' && (
											<BsSortNumericDownAlt
												size={15}
												style={{ marginLeft: '2px' }}
											/>
										)}
									</>
								)}
							</th>
							<th onClick={() => handleSort('title')}>
								Title
								{searchParams['_field'] === 'title' && (
									<>
										{searchParams['_type_sort'] === 'asc' && (
											<BsSortAlphaUpAlt
												size={15}
												style={{ marginLeft: '2px' }}
											/>
										)}
										{searchParams['_type_sort'] === 'desc' && (
											<BsSortAlphaDownAlt
												size={15}
												style={{ marginLeft: '2px' }}
											/>
										)}
									</>
								)}
							</th>
							<th onClick={() => handleSort('genre')}>
								Genre
								{searchParams['_field'] === 'genre' && (
									<>
										{searchParams['_type_sort'] === 'asc' && (
											<BsSortAlphaUpAlt
												size={15}
												style={{ marginLeft: '2px' }}
											/>
										)}
										{searchParams['_type_sort'] === 'desc' && (
											<BsSortAlphaDownAlt
												size={15}
												style={{ marginLeft: '2px' }}
											/>
										)}
									</>
								)}
							</th>
							<th onClick={() => handleSort('musician')}>
								Musician
								{searchParams['_field'] === 'musician' && (
									<>
										{searchParams['_type_sort'] === 'asc' && (
											<BsSortAlphaUpAlt
												size={15}
												style={{ marginLeft: '2px' }}
											/>
										)}
										{searchParams['_type_sort'] === 'desc' && (
											<BsSortAlphaDownAlt
												size={15}
												style={{ marginLeft: '2px' }}
											/>
										)}
									</>
								)}
							</th>
							<th className='column-'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{currentSongs.map((song, index) => (
							<tr key={song.id}>
								<td>{index + 1}</td>
								<td>{song.id}</td>
								<td>{song.title}</td>
								<td>{song.genre}</td>
								<td>{song.musician}</td>
								<td>
									<div>
										<div
											style={{ display: 'inline' }}
											onClick={() => handlePlaySong(song.id, song.url)}
											className='mr-15'
											onMouseOver={(e) => {
												e.target.style.color = 'rgb(40, 144, 144)';
												e.target.style.cursor = 'pointer';
											}}
											onMouseOut={(e) => (e.target.style.color = 'black')}
										>
											{(currentSongPlay !== song.id || !playing) && (
												<BsPlayCircle
													size={30}
													color='black'
													variant='primary'
												/>
											)}
											{currentSongPlay === song.id && playing && (
												<BsPauseCircle
													size={30}
													color='black'
													variant='primary'
												/>
											)}
										</div>
										<Link
											to={`/songs/${song.id}`}
											className='mr-15'
											onMouseOver={(e) => {
												e.target.style.color = 'rgb(40, 144, 144)';
												e.target.style.cursor = 'pointer';
											}}
											onMouseOut={(e) => (e.target.style.color = 'black')}
										>
											<AiOutlineEdit
												size={30}
												color='black'
												variant='primary'
											/>
										</Link>
										<div
											style={{ display: 'inline' }}
											onClick={() => handleDelete(song.id)}
											onMouseOver={(e) => {
												e.target.style.color = 'red';
												e.target.style.cursor = 'pointer';
											}}
											onMouseOut={(e) => (e.target.style.color = 'black')}
										>
											<AiOutlineDelete
												size={30}
												color='black'
												variant='danger'
											/>
										</div>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
				<Row>
					<PaginationComponent
						currentPage={searchParams['_page']} // trang hiện tại
						totalPages={totalPages} // tổng số trang
						songsPerPage={searchParams['_limit']} // số lượng mục hiển thị trên mỗi trang
					/>
				</Row>
			</Container>
		</>
	);
}

export default Songs;
