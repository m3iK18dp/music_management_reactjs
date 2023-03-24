const convertPathSearchUrl = (property_values, type = 1) => {
	const url = new URL(window.location.href);
	const searchParams = url.searchParams;

	for (const propertyValue of property_values) {
		const property = propertyValue.property;
		const value = propertyValue.value;
		if (type)
			if (searchParams.has(property)) {
				searchParams.set(property, value);
			} else {
				searchParams.append(property, value);
			}
		else if (searchParams.has(property)) {
			searchParams.delete(property);
		}
	}

	return `${url.pathname}?${searchParams.toString()}`;
};

export default convertPathSearchUrl;
