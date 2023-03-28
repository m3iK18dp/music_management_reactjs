import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Button, Form } from 'react-bootstrap';
import songService from '../services/SongService';
import { useParams, useNavigate } from 'react-router-dom';
import { AiFillSave } from 'react-icons/ai';
import { MdCancel } from 'react-icons/md';
import LastUpdateTimeComponent from '../components/LastUpdateTimeComponent';
function UpdateSong() {
	const navigate = useNavigate();
	const [song, setSong] = useState({});
	const id = useParams();
	const title = useRef('');
	const genre = useRef('');
	const musician = useRef('');
	const file = useRef('');
	const [titleIsFilled, setTitleIsFilled] = useState('');
	const [status, setStatus] = useState('');
	const [check, setCheck] = useState(true);
	useEffect(() => {
		songService.get({ _id: id._id }).then((data) => {
			console.log(data.data);
			setSong(data.data.content[0]);
		});
	}, [id]);
	function handleSubmit() {
		console.log(file.current.files[0]);
		if (!title.current.value) {
			setTitleIsFilled(`The title field cannot be blank, please enter a title`);
			setCheck(false);
		} else {
			setTitleIsFilled();
			setCheck(true);
		}
		if (!check) setStatus();
		else if (file.current.files[0]) {
			songService
				.updateSongWithFile(
					id._id,
					{
						title: title.current.value,
						genre: genre.current.value,
						musician: musician.current.value,
					},
					file.current.files[0],
				)
				.then((res) => {
					if (res.status === 'ok') {
						alert('Update Song successful!');
						navigate('/songs');
					} else {
						setStatus('Update Song failed, try again.');
					}
				});
		} else {
			songService
				.updateSongWithoutFile(id._id, {
					title: title.current.value,
					genre: genre.current.value,
					musician: musician.current.value,
				})
				.then((res) => {
					if (res.status === 'ok') {
						alert('Update Song successful!');
						navigate('/songs');
					} else {
						setStatus('Update Song failed, try again.');
					}
				});
		}
	}
	return (
		<Container>
			<Row className='col-md-8 offset-md-2 card'>
				<h1 className='text-center' style={{ margin: '10px auto 0 auto' }}>
					Add song
				</h1>
				<div style={{ padding: '20px' }}>
					<Form action='/songs/new' method='POST' encType='multipart/form-data'>
						<Form.Group>
							<Form.Label style={{ fontWeight: 'bold' }}>ID</Form.Label>
							<Form.Control
								type='text'
								name='id'
								ref={id}
								defaultValue={song.id}
								readOnly
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label style={{ fontWeight: 'bold', marginTop: 10 }}>
								Title
							</Form.Label>
							<Form.Control
								type='text'
								name='title'
								placeholder='Enter song name'
								ref={title}
								defaultValue={song.title}
								required
							/>
							{titleIsFilled && (
								<p style={{ marginBottom: '0px' }}>{titleIsFilled}</p>
							)}
						</Form.Group>
						<Form.Group>
							<Form.Label style={{ fontWeight: 'bold', marginTop: 10 }}>
								Genre
							</Form.Label>
							<Form.Control
								type='text'
								name='genre'
								placeholder='Enter genre'
								ref={genre}
								defaultValue={song.genre}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label style={{ fontWeight: 'bold', marginTop: 10 }}>
								Musician
							</Form.Label>
							<Form.Control
								type='text'
								name='musician'
								placeholder='Enter musician'
								ref={musician}
								defaultValue={song.musician}
							/>
						</Form.Group>
						<Form.Group>
							<Form.Label style={{ fontWeight: 'bold', marginTop: 10 }}>
								File song
							</Form.Label>
							<Form.Control type='file' name='audioFile' ref={file} />
						</Form.Group>
						<div className='box-footer'>
							<Button
								onClick={handleSubmit}
								style={{
									backgroundColor: '#e9ecef',
									border: 'none',
									color: 'black',
									marginTop: 20,
								}}
								title='Save'
							>
								<AiFillSave size={30}></AiFillSave>Save
							</Button>
							<Button
								variant='danger'
								href='/songs'
								style={{
									backgroundColor: '#e9ecef',
									border: 'none',
									color: 'black',
									marginTop: 20,
									marginLeft: 20,
								}}
							>
								<MdCancel size={30}></MdCancel>Cancel
							</Button>
						</div>{' '}
						<p style={{ marginBottom: '0px' }}>{status}</p>
					</Form>
				</div>
				<LastUpdateTimeComponent date={song.lastUpdate} />
			</Row>
		</Container>
	);
}

export default UpdateSong;
