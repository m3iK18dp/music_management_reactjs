import React from "react";
import { Form } from "react-bootstrap";
const MySelect = ({ check, setCheck, all, full = true }) => {
  const handleChecks = (event, oneInAll) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setCheck([
        ...Array.from(check ? check : []),
        !full ? oneInAll.id : oneInAll,
      ]);
    } else {
      setCheck(
        Array.from(check).filter(
          (checkId) => checkId !== (!full ? oneInAll.id : oneInAll)
        )
      );
    }
  };
  return (
    <div
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        maxHeight: 70,
        overflow: "hidden",
        overflowY: "scroll",
        color: "white",
      }}
    >
      {Array.from(all ? all : []).map((oneInAll) => (
        <div key={oneInAll.id}>
          <Form.Check
            type="checkbox"
            label={oneInAll.name}
            name={oneInAll.name}
            value={oneInAll.id}
            checked={Array.from(check ? check : []).find(
              (oneInCheck) =>
                (!full ? oneInCheck : oneInCheck.id) === oneInAll.id
            )}
            onChange={(event) => {
              handleChecks(event, oneInAll);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default MySelect;
