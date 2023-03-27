import { Pagination, Form } from "react-bootstrap";
import {
  BsFillSkipStartFill,
  BsFillSkipEndFill,
  BsFillCaretLeftFill,
  BsFillCaretRightFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import convertPathSearchUrl from "../services/ConvertPathSearchUrl";

function PaginationComponent({ currentPage, totalPages, songsPerPage }) {
  currentPage += 1;
  const navigate = useNavigate();
  return (
    <div
      className="d-flex align-items-center justify-content-between"
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        right: "0",
        margin: "0 auto",
        paddingTop: 10,
        backgroundColor: "rgba(248, 249, 250, 0.7)",
        zIndex: 1,
      }}
    >
      <Pagination>
        <Pagination.First
          onClick={() => {
            navigate(convertPathSearchUrl([{ property: "page", value: 1 }]));
          }}
          disabled={currentPage === 1}
        >
          <BsFillSkipStartFill color="black" />
        </Pagination.First>
        <Pagination.Prev
          onClick={() => {
            navigate(
              convertPathSearchUrl([
                { property: "page", value: currentPage - 1 },
              ])
            );
          }}
          disabled={currentPage === 1}
        >
          <BsFillCaretLeftFill color="black" />
        </Pagination.Prev>
        {Array.from({ length: totalPages }).map((_, index) => (
          <Pagination.Item
            key={index}
            active={index + 1 === currentPage}
            onClick={() => {
              navigate(
                convertPathSearchUrl([{ property: "page", value: index + 1 }])
              );
            }}
            style={{
              "--bs-pagination-active-bg": "black",
              "--bs-pagination-active-border-color": "black",
            }}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => {
            navigate(
              convertPathSearchUrl([
                { property: "page", value: currentPage + 1 },
              ])
            );
          }}
          disabled={currentPage === totalPages}
        >
          <BsFillCaretRightFill color="black" />
        </Pagination.Next>
        <Pagination.Last
          onClick={() => {
            navigate(
              convertPathSearchUrl([{ property: "page", value: totalPages }])
            );
          }}
          disabled={currentPage === totalPages}
        >
          <BsFillSkipEndFill color="black" />
        </Pagination.Last>
        <Form>
          <Form.Control
            as="select"
            value={songsPerPage}
            onChange={(event) => {
              navigate(
                convertPathSearchUrl([
                  { property: "limit", value: event.target.value },
                ])
              );
            }}
            className="rounded-0"
            style={{
              height: "auto",
              width: "auto",
              padding: "6px 10px",
              border: "1px solid #dee2e6",
              backgroundColor: "white",
              marginLeft: 10,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {/* <option value={songsPerPage}>{songsPerPage}</option> */}
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Form.Control>
        </Form>
      </Pagination>
    </div>
  );
}

export default PaginationComponent;
