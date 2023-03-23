import { Pagination, Form } from "react-bootstrap";
import {
  BsFillSkipStartFill,
  BsFillSkipEndFill,
  BsFillCaretLeftFill,
  BsFillCaretRightFill,
} from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
function PaginationComponent({
  currentPage,
  setCurrentPage,
  totalPages,
  songsPerPage,
  setSongsPerPage,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  //   const paginationItems = [];
  //   for (let i = 1; i <= totalPages; i++) {
  //     paginationItems.push(
  //       <Pagination.Item
  //         key={i}
  //         active={i === currentPage}
  //         onClick={() => setCurrentPage(i)}
  //       >
  //         {i}
  //       </Pagination.Item>
  //     );
  //   }

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
            navigate(
              location.pathname +
                (location.search.includes("?page=" + currentPage)
                  ? location.search.replace("?page=" + currentPage, "?page=1")
                  : location.search + "?page=1")
            );
            setCurrentPage(1);
          }}
          disabled={currentPage === 1}
        >
          <BsFillSkipStartFill color="black" />
        </Pagination.First>
        <Pagination.Prev
          onClick={() => {
            navigate(
              location.pathname +
                (location.search.includes("?page=" + currentPage)
                  ? location.search.replace(
                      "?page=" + currentPage,
                      "?page=" + (currentPage - 1)
                    )
                  : location.search + "?page=" + (currentPage - 1))
            );
            setCurrentPage(currentPage - 1);
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
                location.pathname +
                  (location.search.includes("?page=" + currentPage)
                    ? location.search.replace(
                        "?page=" + currentPage,
                        "?page=" + (index + 1)
                      )
                    : location.search + "?page=" + (index + 1))
              );
              setCurrentPage(index + 1);
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
              location.pathname +
                (location.search.includes("?page=" + currentPage)
                  ? location.search.replace(
                      "?page=" + currentPage,
                      "?page=" + (currentPage + 1)
                    )
                  : location.search + "?page=" + (currentPage + 1))
            );
            setCurrentPage(currentPage + 1);
          }}
          disabled={currentPage === totalPages}
        >
          <BsFillCaretRightFill color="black" />
        </Pagination.Next>
        <Pagination.Last
          onClick={() => {
            navigate(
              location.pathname +
                (location.search.includes("?page=" + currentPage)
                  ? location.search.replace(
                      "?page=" + currentPage,
                      "?page=" + totalPages
                    )
                  : location.search + "?page=" + totalPages)
            );
            setCurrentPage(totalPages);
          }}
          disabled={currentPage === totalPages}
        >
          <BsFillSkipEndFill color="black" />
        </Pagination.Last>
        <Form>
          {/* <Form.Group className='mb-3' controlId='songsPerPageSelect'> */}
          <Form.Control
            as="select"
            value={songsPerPage}
            onChange={(event) => {
              navigate(
                location.pathname +
                  (location.search.includes("?limit=" + songsPerPage)
                    ? location.search.replace(
                        "?limit=" + songsPerPage,
                        "?limit=" + event.target.value
                      )
                    : location.search + "?limit=" + event.target.value)
              );
              setSongsPerPage(event.target.value);
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
            }}
          >
            {" "}
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Form.Control>
          {/* </Form.Group> */}
        </Form>
      </Pagination>
    </div>
  );
}

export default PaginationComponent;
