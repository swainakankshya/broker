import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAnglesLeft,
  faAngleLeft,
  faAngleRight,
  faAnglesRight,
  faSave,
  faStar,
} from "@fortawesome/free-solid-svg-icons"
import { usePagination } from "../../context/PaginationContext"

const PaginationGlobalControls = () => {
  const {
  currentPage,
  setCurrentPage,
  totalRecords
} = usePagination()

const pageSize = 100
const totalPages = Math.ceil(totalRecords / pageSize)

const handleFirst = () => {
  setCurrentPage(1)
}

const handlePrev = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1)
  }
}

const handleNext = () => {
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1)
  }
}

const handleLast = () => {
  setCurrentPage(totalPages)
}

  return (
    <div className="flex items-center gap-1 p-2 mx-auto py-5 w-fit">

      <button
        onClick={handleFirst}
        disabled={currentPage === 1}
        className="rec-btn max-w-[72px] text-[11px] py-2 disabled:opacity-50"
      >
        <FontAwesomeIcon icon={faAnglesLeft} />
      </button>

      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="rec-btn max-w-[70px] text-[9px] py-2 disabled:opacity-50"
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>

     <p type="text" class="eninp-n w-[80px] text-center flex-shrink-0">{currentPage} / {totalPages}</p>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="rec-btn max-w-[70px] text-[9px] py-2 disabled:opacity-50"
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>

      <button
        onClick={handleLast}
        disabled={currentPage === totalPages}
        className="rec-btn max-w-[70px] text-[9px] py-2 disabled:opacity-50"
      >
        <FontAwesomeIcon icon={faAnglesRight} />
      </button>
{/* 
      <button className="rec-btn max-w-[70px] text-[9px] py-2">
        <FontAwesomeIcon icon={faStar} />
      </button> */}

    </div>
  )
}

export default PaginationGlobalControls