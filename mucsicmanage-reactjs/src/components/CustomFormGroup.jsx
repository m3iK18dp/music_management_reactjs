import { Form } from "react-bootstrap";

function CustomFormGroup({
  className = "mb-3",
  controlId = null,
  func,
  placeholder,
  label,
  prop = controlId,
  value,
  warning = null,
  formControlStyle,
  type = "text",
  readonly = false,
  funcEnter,
}) {
  return (
    <Form.Group className={className} controlId={controlId}>
      <Form.Label>
        <strong>{label}</strong>
      </Form.Label>
      <Form.Control
        style={formControlStyle}
        type={type}
        onChange={(event) => func(prop, event.target.value)}
        placeholder={placeholder}
        required
        value={value}
        readOnly={readonly}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            if (!readonly) funcEnter();
          }
        }}
      />
      {warning !== null && (
        <div style={{ height: 5 }}>
          <p
            style={{
              fontStyle: "italic",
              color: "red",
              margin: 0,
              fontSize: 12,
            }}
          >
            {warning}
          </p>
        </div>
      )}
    </Form.Group>
  );
}
export default CustomFormGroup;
