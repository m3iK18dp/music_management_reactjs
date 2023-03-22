import React from 'react';
function LastUpdateTimeComponent(date) {
	const options = {
		year: 'numeric',
		month: 'numeric',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		hour12: false,
		timeZone: 'Asia/Ho_Chi_Minh',
	};
	const lastUpdate = new Date(date.date).toLocaleString('vi-VN', options);
	return <p>Last update: {lastUpdate}</p>;
}

export default LastUpdateTimeComponent;
