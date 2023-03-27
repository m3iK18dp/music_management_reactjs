const convertPathSearchUrl = (property_value) => {
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;
  console.log(property_value);
  if (Array.isArray(property_value))
    for (const propertyValue of property_value) {
      const property = propertyValue.property;
      const value =
        property === "id" ? parseInt(propertyValue.value) : propertyValue.value;
      if (
        value === "" ||
        !value ||
        (property === "id" && (isNaN(value) || value < 1))
      ) {
        if (searchParams.has(property)) {
          searchParams.delete(property);
        }
      } else {
        if (searchParams.has(property)) {
          searchParams.set(property, value);
        } else {
          searchParams.append(property, value);
        }
      }
    }
  return `${url.pathname}?${searchParams.toString()}`;
};

export default convertPathSearchUrl;
