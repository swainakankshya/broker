import { useState, useEffect } from "react";

import InvoiceHeader from "../components/invoice/InvoiceHeader";
import EntityInfo from "../components/invoice/Entityinfo";
import { DropdownControllerProvider } from "../components/ui/dropdown-controller";

import Findpro from "../components/invoice/Findpro";
import RoutingAndRating from "../components/invoice/RoutingAndRating";
import CallLog from "../components/invoice/CallLog";
import Billing from "../components/invoice/Billing";
import WeightTable from "../components/invoice/WeightTable";

import { PaginationProvider, usePagination } from "../context/PaginationContext";

import PaginationGlobalControls from "../components/common/PaginationGlobalControls"
// ---- Inner component ----
const InvoiceContent = () => {

  const [invoiceData, setInvoiceData] = useState({});

  const {
  records,
  setCurrentPage,
  currentPage,
  currentRecordIndex,
  activeFilters,
  setActiveFilters,
  loadInitialRecords
} = usePagination();

useEffect(() => {
  if (!records?.length) return;
  setInvoiceData(records[currentRecordIndex]);
}, [records, currentRecordIndex]);


const onContextAction = async (action, field, value) => {

  console.log("FILTER ACTION:", {
    action,
    field,
    value
  });


  if (!field && action !== "removeAll") return;

  // REMOVE ALL FILTERS
  if (action === "removeAll") {
    setCurrentPage(1);
setActiveFilters({});
    return;
  }

  // REMOVE ONE FILTER
  if (action === "remove") {
  setCurrentPage(1);
  setActiveFilters({});   // 🔥 clear all filters
  return;
}

  // SORT
  if (action === "asc") {
    await loadInitialRecords(1, activeFilters, field, "ASC");
    return;
  }

  if (action === "desc") {
    await loadInitialRecords(1, activeFilters, field, "DESC");
    return;
  }

  // ADD FILTER
 setCurrentPage(1);

setActiveFilters(prev => ({
  ...prev,
  [field]: { value, action }
}));
};

  return (
    <DropdownControllerProvider>
      <form className="w-full" onSubmit={(e) => e.preventDefault()}>

        <InvoiceHeader
          invoiceData={invoiceData}
          onInvoiceLoad={(data) => setInvoiceData(data)}
          onContextAction={(action, field, value) =>
            onContextAction(action, field, value)
          }
        />

        <div className="flex flex-row items-start space-x-2 gap-2 px-5 pt-2">

         <EntityInfo
  invoiceData={invoiceData}
  onContextAction={onContextAction}
/>
          <Findpro
            invoiceData={invoiceData}
            onContextAction={onContextAction}
          />
          <RoutingAndRating invoiceData={invoiceData} />
          <Billing invoiceData={invoiceData} />
          <CallLog
            invoiceData={invoiceData}
            onContextAction={onContextAction}
          />

        </div>

  <WeightTable onContextAction={onContextAction} />
       
      </form>
    </DropdownControllerProvider>
  );
};

const Invoice = () => {
  return (
    <>
      <PaginationProvider>
  <InvoiceContent />
  <PaginationGlobalControls />
</PaginationProvider>
    </>
  );
};

export default Invoice;
