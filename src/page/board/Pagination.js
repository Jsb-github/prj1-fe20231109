import { Box, Button } from "@chakra-ui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import { useNavigate, useSearchParams } from "react-router-dom";

function PageButton({ variant, pageNumber, children }) {
  const [params] = useSearchParams();

  const navigate = useNavigate();
  console.log(params);
  function handleClick() {
    params.set("p", pageNumber);
    navigate("/?" + params);
  }

  return (
    <Button variant={variant} onClick={handleClick}>
      {children}
    </Button>
  );
}

export function Pagination({ pageInfo }) {
  const pageNumbers = [];
  const navigate = useNavigate();

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box>
      {pageInfo.prevPageNumber > 0 && (
        <PageButton pageNumber={1}>
          <FontAwesomeIcon icon={faAnglesLeft} />
        </PageButton>
      )}

      {pageInfo.prevPageNumber > 0 && (
        <PageButton pageNumber={pageInfo.prevPageNumber}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </PageButton>
      )}
      {pageNumbers.map((pageNumber) => (
        <PageButton
          key={pageNumber}
          variant={
            pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
          }
          pageNumber={pageNumber}
        >
          {pageNumber}
        </PageButton>
      ))}
      {pageInfo.nextPageNumber && (
        <PageButton pageNumber={pageInfo.nextPageNumber}>
          <FontAwesomeIcon icon={faChevronRight} />
        </PageButton>
      )}
      {pageInfo.nextPageNumber && (
        <PageButton pageNumber={pageInfo.lastPageNumber}>
          <FontAwesomeIcon icon={faAnglesRight} />
        </PageButton>
      )}
    </Box>
  );
}
