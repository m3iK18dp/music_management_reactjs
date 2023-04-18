function CustomButton({
	field = '',
	IconButton = null,
	size = 40,
	func,
	title = '',
	// 'rgba(255,255,255,0.8)',
	// color = 'rgba(0,0,0,0.8)',
	color = 'rgba(255,255,255,0.7)',
	onMouseOverFunc = null,
	onMouseOutFunc = null,
	style = {
		display: 'inline-block',
	},
	id,
	disable = false,
	text = '',
}) {
	return (
		<div
			style={{ display: 'inline-block', ...style }}
			onClick={() => {
				if (!disable) func(!isNaN(field) ? field : field.toLowerCase());
			}}
			onMouseOver={(e) => {
				if (!disable) {
					e.target.style.cursor = 'pointer';
					document.getElementById(`icon-button-${id}`).style.color =
						'rgb(40, 144, 144)';
					if (onMouseOverFunc !== null) onMouseOverFunc();
				}
			}}
			onMouseOut={(e) => {
				document.getElementById(`icon-button-${id}`).style.color = color;
				if (onMouseOutFunc !== null) onMouseOutFunc();
			}}
			title={title}
		>
			{IconButton !== null ? (
				<IconButton
					id={`icon-button-${id}`}
					size={size}
					color={color}
					opacity={!disable ? 1 : 0.4}
				></IconButton>
			) : (
				<span
					id={`icon-button-${id}`}
					fontSize={size}
					color={color}
					fontWeight='bold'
					style={{ margin: 0, padding: 0 }}
					className='neon'
				>
					{text}
				</span>
			)}
		</div>
	);
}
export default CustomButton;
