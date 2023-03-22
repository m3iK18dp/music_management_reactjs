import authenticationService from '../services/AuthenticationService';
import { useNavigate } from 'react-router-dom';

function Logout() {
	const navigate = useNavigate();
	try {
		authenticationService.logout().then((data) => {
			console.log(data);
			if (data.status === 'ok') {
				navigate('/');
			} else alert('Logout Failed');
		});
	} catch (error) {
		console.log(error);
	}
}
export default Logout;
