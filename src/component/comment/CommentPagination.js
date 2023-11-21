import { Box, Button } from "@chakra-ui/react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAnglesRight,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export function CommentPagination({ pageInfo, setNowPage }) {
  const pageNumbers = [];

  if (pageInfo != null) {
    for (let i = pageInfo.startPageNumber; i <= pageInfo.endPageNumber; i++) {
      pageNumbers.push(i);
    }
  }

  return (
    <Box>
      {pageInfo.prevPageNumber > 0 && (
        <Button onClick={() => setNowPage(1)}>
          <FontAwesomeIcon icon={faAnglesLeft} />
        </Button>
      )}
      {pageInfo.prevPageNumber > 0 && (
        <Button
          variant="ghost"
          onClick={() => setNowPage(pageInfo.prevPageNumber)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
      )}
      {pageNumbers.map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={
            pageNumber === pageInfo.currentPageNumber ? "solid" : "ghost"
          }
          onClick={() => setNowPage(pageNumber)}
        >
          {pageNumber}
        </Button>
      ))}
      {pageInfo.nextPageNumber && (
        <Button onClick={() => setNowPage(pageInfo.nextPageNumber)}>
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      )}

      {pageInfo.nextPageNumber && (
        <Button onClick={() => setNowPage(pageInfo.lastPageNumber)}>
          <FontAwesomeIcon icon={faAnglesRight} />
        </Button>
      )}
    </Box>
  );
}
