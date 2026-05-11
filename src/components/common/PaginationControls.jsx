import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesLeft,
  faAngleLeft,
  faAngleRight,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { usePagination } from "../../context/PaginationContext";

const PaginationControls = () => {
  const {
    handleFirstInvoice,
    handleRecordPrev,
    handleRecordNext,
    handleLastInvoice,
  } = usePagination();

  return (
    <div className="flex items-center gap-1 p-2 bg-gray-100 border-t border-gray-300 w-fit">

      <button
        onClick={handleFirstInvoice}
        className="rec-btn max-w-[72px] text-[11px] py-2"
      >
        <FontAwesomeIcon icon={faAnglesLeft} />
      </button>

      <button
        onClick={handleRecordPrev}
        className="rec-btn max-w-[70px] text-[9px] py-2"
      >
        <FontAwesomeIcon icon={faAngleLeft} />
      </button>

      <button
        onClick={handleRecordNext}
        className="rec-btn max-w-[70px] text-[9px] py-2"
      >
        <FontAwesomeIcon icon={faAngleRight} />
      </button>

      <button
        onClick={handleLastInvoice}
        className="rec-btn max-w-[70px] text-[9px] py-2"
      >
        <FontAwesomeIcon icon={faAnglesRight} />
      </button>

    </div>
  );
};

export default PaginationControls;
