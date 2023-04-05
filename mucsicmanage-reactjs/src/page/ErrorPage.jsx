import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const ErrorPage = () => {
	return (
		<Container>
			<div className='background-container' />
			<div className=' background-container-opacity-low' />

			<Row className='justify-content-center'>
				<Col md={6} className='text-center'>
					<h1 className='my-5'>Oops! Something went wrong...</h1>
					<p>
						We're sorry, but it seems that the page you're looking for doesn't
						exist.
					</p>
					<p>Please check the URL or try refreshing the page.</p>
				</Col>
			</Row>
		</Container>
	);
};

export default ErrorPage;
