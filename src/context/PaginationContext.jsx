import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { getPagedInvoices, getKeysetInvoices } from "../api/invoiceApi";

const PaginationContext = createContext(null);

export const PaginationProvider = ({ children }) => {

  const [records, setRecords] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [currentRecordIndex, setCurrentRecordIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);



 const loadInitialRecords = useCallback(async (
  page,
  filters,
  sortField = null,
  sortOrder = null
) => {
  try {

    const data = await getPagedInvoices(
  page,
  100,
  filters,
  sortField,
  sortOrder
);


setRecords(data.records || []);
setTotalRecords(data.totalRecords || 0);   // ⭐ IMPORTANT

// reset to first record
setCurrentRecordIndex(0);

   } catch (err) {
    console.error("Pagination load error", err);
  }
}, [activeFilters]);


useEffect(() => {
  loadInitialRecords(currentPage, activeFilters);
}, [currentPage, activeFilters, loadInitialRecords]);
  // ===== RECORD LEVEL NAVIGATION =====

  const handleRecordNext = () => {
    setCurrentRecordIndex(prev =>
      prev < records.length - 1 ? prev + 1 : prev
    );
  };

  const handleRecordPrev = () => {
    setCurrentRecordIndex(prev =>
      prev > 0 ? prev - 1 : prev
    );
  };

  const handleFirstInvoice = () => {
    setCurrentRecordIndex(0);
  };

  const handleLastInvoice = () => {
    setCurrentRecordIndex(records.length - 1);
  };
  
  // ===========================
// KEYSET PAGINATION - LOAD NEXT PAGE
// ===========================
const loadNextPage = async () => {

  if (!records.length) return;

  const lastId = records[records.length - 1]?.OrderNo;

  try {

    const data = await getKeysetInvoices(lastId, 100);

    setRecords(prev => [...prev, ...data]);

  } catch (err) {

    console.error("Keyset pagination error:", err);

  }

};

  const value = useMemo(() => ({
  records,
  currentRecordIndex,
  currentPage,
  setRecords,
  totalRecords,
  setCurrentPage,
  activeFilters,
  setActiveFilters,
  setCurrentRecordIndex,
  handleRecordNext,
  handleRecordPrev,
  handleFirstInvoice,
  handleLastInvoice,
  loadInitialRecords,
  loadNextPage
}), [
  records,
  currentRecordIndex,
  currentPage,
  totalRecords,
  activeFilters
]);

 return (
  <PaginationContext.Provider value={value}>
    {children}
  </PaginationContext.Provider>
);
};

export const usePagination = () => useContext(PaginationContext);