function CustomButton({
  field = "",
  IconButton,
  size = 40,
  func,
  title,
  color = "black",
}) {
  return (
    <div
      style={{ display: "inline" }}
      onClick={() => func(!isNaN(field) ? field : field.toLowerCase())}
      onMouseOver={(e) => {
        e.target.style.color = "rgb(40, 144, 144)";
        e.target.style.cursor = "pointer";
      }}
      onMouseOut={(e) => (e.target.style.color = color)}
      title={title}
    >
      <IconButton size={size} color={color}></IconButton>
    </div>
  );
}
export default CustomButton;
