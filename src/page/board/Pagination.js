import { Box, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export function Pagination({ pageInfo }) {
  const pageNumbers = [];
  const navigate = useNavigate();

  for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box>
      {pageInfo.prevPageNumber > 0 && (
        <Button onClick={() => navigate("/?p=" + pageInfo.prevPageNumber)}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
      )}
      {pageNumbers.map((pageNumber) => (
        <Button key={pageNumber} onClick={() => navigate("/?p=" + pageNumber)}>
          {pageNumber}
        </Button>
      ))}
      {pageInfo.nextPageNumber && (
        <Button onClick={() => navigate("/?p=" + pageInfo.nextPageNumber)}>
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      )}
    </Box>
  );
}
