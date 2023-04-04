function CustomButton({
	field = '',
	IconButton,
	size = 40,
	func,
	title,
	color = 'black',
	onMouseOverFunc = null,
	onMouseOutFunc = null,
	style = { display: 'inline-block' },
	id,
	disable = false,
}) {
	return (
		<div
			style={{ ...style, display: 'inline-block' }}
			onClick={() => {
				if (!disable) func(!isNaN(field) ? field : field.toLowerCase());
			}}
			onMouseOver={(e) => {
				// e.target.style.color = 'rgb(40, 144, 144)';
				if (!disable) {
					e.target.style.cursor = 'pointer';
					document.getElementById(`icon-button-${id}`).style.color =
						'rgb(40, 144, 144)';
					if (onMouseOverFunc !== null) onMouseOverFunc();
				}
			}}
			onMouseOut={(e) => {
				// e.target.style.color = color;
				document.getElementById(`icon-button-${id}`).style.color = color;
				if (onMouseOutFunc !== null) onMouseOutFunc();
			}}
			title={title}
		>
			<IconButton
				id={`icon-button-${id}`}
				size={size}
				color={color}
				opacity={!disable ? 1 : 0.5}
			></IconButton>
		</div>
	);
}
export default CustomButton;
