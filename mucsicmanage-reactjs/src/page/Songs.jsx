/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable jsx-a11y/anchor-is-valid */
import '../css/songs.css';
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Table } from 'react-bootstrap';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { BsPlayCircle, BsSearchHeart, BsPauseCircle } from 'react-icons/bs';
import { RiHeartAddFill } from 'react-icons/ri';
import { BiSkipNextCircle, BiSkipPreviousCircle } from 'react-icons/bi';
import { MdCancel } from 'react-icons/md';
import PaginationComponent from '../components/PaginationComponent';
import NavbarComponent from '../components/NavbarComponent';
import songService from '../services/SongService';

function Songs() {
	const location = useLocation();
	const searchParams = location.search.slice(1).split('=');
	const [search, setSearch] = useState('');
	const [typeSearch, setTypeSearch] = useState('title');
	const [currentPage, setCurrentPage] = useState(1);
	const [songsPerPage, setSongsPerPage] = useState(10);
	const [songs, setSongs] = useState([]);
	const [currentSongPlay, setCurrentSongPlay] = useState(0);
	const [currentSongPlayUrl, setCurrentSongPlayUrl] = useState('');
	const [currentSongIndex, setCurrentSongIndex] = useState(0);
	const [playing, setPlaying] = useState(false);
	const audio = useRef(new Audio());
	const navigate = useNavigate();
	useEffect(() => {
		if (searchParams.length === 2) {
			searchParams[1] = decodeURIComponent(searchParams[1]);
			setSearch(searchParams[1]);
			setTypeSearch(searchParams[0]);
		}
		const searchQuery = {};
		searchQuery['_' + searchParams[0]] = searchParams[1];
		songService.get(searchQuery).then((data) => {
			setSongs(data.data.content);
		});
	}, [searchParams[0], searchParams[1]]);
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
		if (search !== '') navigate(`/songs?${typeSearch}=${search}`);
	};
	const handleCancelSearch = () => {
		if (location.search !== '') {
			setSearch('');
			setTypeSearch('title');
			navigate(`/songs`);
		}
	};
	const handleDelete = (id) => {
		if (window.confirm('Do you want to delete this song?')) {
			songService.deleteSong(id);
			setSongs(songs.filter((song) => song.id !== id));
		}
	};
	const handlePlay = (isHandlePlaySongCall = false) => {
		if (currentSongPlay === 0 && !isHandlePlaySongCall) {
			setCurrentSongPlayUrl(currentSongs[currentSongIndex].url);
			setCurrentSongPlay(currentSongs[currentSongIndex].id);
		}
		console.log(audio.current);
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
	const totalPages = Math.ceil(songs.length / songsPerPage);
	const indexOfLastSong = currentPage * songsPerPage;
	const indexOfFirstSong = indexOfLastSong - songsPerPage;
	const currentSongs = songs.slice(indexOfFirstSong, indexOfLastSong);
	return (
		<>
			<NavbarComponent />
			<Container fluid style={{ marginTop: 80 }}>
				<Form>
					<Row>
						<Col>
							<Form.Group>
								<Form.Control
									type='text'
									name={typeSearch}
									placeholder={search ? search : 'Enter Search'}
									value={search}
									onChange={(event) => setSearch(event.target.value)}
								/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group>
								<Form.Control
									as='select'
									value={typeSearch}
									onChange={(event) => setTypeSearch(event.target.value)}
								>
									<option value='title'>Title</option>
									<option value='musician'>Musician</option>
									<option value='genre'>Genre</option>
								</Form.Control>
							</Form.Group>
						</Col>

						<Col>
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
					autoPlay
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
						<col width='30' span='1' />
						<col width='auto' span='3' />
						<col width='150' span='1' />
					</colgroup>
					<thead className='table-dark'>
						<tr>
							<th>STT</th>
							<th>Title</th>
							<th>Genre</th>
							<th>Musician</th>
							<th className='column-'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{currentSongs.map((song, index) => (
							<tr key={song.id}>
								<td>{index + 1}</td>
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
						currentPage={currentPage} // trang hiện tại
						totalPages={totalPages} // tổng số trang
						setCurrentPage={setCurrentPage} // hàm set trang hiện tại
						songsPerPage={songsPerPage} // số lượng mục hiển thị trên mỗi trang
						setSongsPerPage={setSongsPerPage} // hàm set số lượng mục hiển thị trên mỗi trang
					/>
				</Row>
			</Container>
		</>
	);
}

export default Songs;
