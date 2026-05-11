import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useMemo } from "react";
import { getCallLogDetails } from "../../api/invoiceApi";
import { usePagination } from "../../context/PaginationContext";
import FilterContextWrapper from "./FilterContextWrapper";

const TABS = [
  { label: "All", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Shipment", value: "shipment" },
];

const CallLog = ({ invoiceData, onContextAction }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [noteFilter, setNoteFilter] = useState("");
  const [logs, setLogs] = useState([]);

useEffect(() => {

  if (!invoiceData?.OrderNo) {
    setLogs([]);
    return;
  }

  // NO FILTER → normal load
  if (!noteFilter) {
    getCallLogDetails(invoiceData.OrderNo)
      .then(setLogs)
      .catch(() => setLogs([]));
    return;
  }

  // FILTER APPLIED
  const filters = {
    notes: {
      action: "filterText",
      value: noteFilter
    }
  };

  getCallLogDetails(invoiceData.OrderNo, filters)
    .then(setLogs)
    .catch(() => setLogs([]));

}, [invoiceData?.OrderNo, noteFilter]);

  return (
    <section className="cl-card">
      <div className="cl-header">
        <h6 className="cl-title">CALL / NOTES LOG</h6>

        <div className="cl-actions">
          <div className="cl-tabs-group">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`cl-tab-btn ${
                  activeTab === tab.value ? "active" : "inactive"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button type="button" className="cl-btn-new">
            <FontAwesomeIcon icon={faPlus} size="xs" />
            <span>NEW</span>
          </button>
        </div>
      </div>

      <div className="cl-table-wrapper">
        <table className="cl-table">
          <thead className="cl-thead">
            <tr className="cl-th-row">
              <th className="cl-th w-32">Date / Cont</th>
              <th className="cl-th">Notes</th>
            </tr>
          </thead>

          <tbody className="cl-body">
  {logs.length === 0 ? (
    <tr>
      <td className="mt-2 block text-gray-500" colSpan="2" style={{ textAlign: "center" }}>
        No Call Log Found
      </td>
    </tr>
  ) : (
    logs.map((log, index) => (
      <tr key={index} className="cl-tr">
        <td className="cl-td-meta">
          <div className="meta-date">
            {log.Date ? new Date(log.Date).toLocaleString() : "-"}
          </div>

          <div className="meta-user">
            {log.cont || "-"}
          </div>
        </td>

     <FilterContextWrapper
  onAction={(action, text) => {

    // FILTER TEXT (typing)
    if (action === "filterText") {
      onContextAction(action, "notes", text);
    }

    // FILTER BY SELECTION
    if (action === "filterBy") {
      onContextAction(action, "notes", log.notes);
    }

    // EXCLUDE
    if (action === "exclude") {
      onContextAction(action, "notes", log.notes);
    }

    // REMOVE
    if (action === "remove") {
      onContextAction(action, "notes", "");
    }

  }}
>
  <td className="cl-td-note">
    {log.notes || "-"}
  </td>
</FilterContextWrapper>
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>
    </section>
  );
};

export default CallLog;