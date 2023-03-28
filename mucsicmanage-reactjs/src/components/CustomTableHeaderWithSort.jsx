import { BsSortAlphaUpAlt, BsSortAlphaDownAlt } from 'react-icons/bs';
function CustomTableHeaderWithSort({
	get,
	field,
	func,
	IconAsc = BsSortAlphaUpAlt,
	IconDesc = BsSortAlphaDownAlt,
}) {
	const lowerCaseField = field.toLowerCase();
	return (
		<th key={lowerCaseField} onClick={() => func(lowerCaseField)}>
			{field}
			{get('field') === lowerCaseField &&
				(get('type_sort') === 'asc' ? (
					<IconAsc size={15} style={{ marginLeft: '2px' }} />
				) : (
					<IconDesc size={15} style={{ marginLeft: '2px' }} />
				))}
		</th>
	);
}
export default CustomTableHeaderWithSort;
