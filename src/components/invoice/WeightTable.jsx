import React, { useEffect, useState } from "react";
import { usePagination } from "../../context/PaginationContext";
import { getWeightDetails } from "../../api/invoiceApi";
import FilterContextWrapper from "./FilterContextWrapper";
const WeightTable = ({ onContextAction }) => {
  const { records, currentRecordIndex } = usePagination();

  const [weightData, setWeightData] = useState([]);
 
  const [footerData, setFooterData] = useState([]);
  const currentRecord = records?.[currentRecordIndex];


  useEffect(() => {
  if (
    records?.length > 0 &&
    currentRecord?.OrderNo
  ) {
    loadWeight(currentRecord.OrderNo);
  }
}, [records, currentRecordIndex]);

  const loadWeight = async (orderNo) => {
    try {
      const data = await getWeightDetails(orderNo);

      if (data && data.length > 0) {

  // 🔹 Remove PKG = -1 rows only for main table
  const filteredRows = data.filter(row => Number(row.Accessorial) === 0);

  const mapped = filteredRows.map((row, index) => ({
    id: index + 1,
    units: row.Units,
    type: row.PKG,
    description: row.Description,
    stated: row.StatedWeight,
    actual: row.ActualWeight,
    dimensional: row.DIMWeight,
    weightCode: row.WeightCode,
    class: row.ClassKey,
    mult: "",
    rate: row.Rate,
    charges: row.Charges,
    inventoryItem: row.InventoryItem,
  }));

  setWeightData(mapped);

  // 🔹 Footer remains SAME
  const footer = data
    .filter(row => row.Accessorial === -1)
    .map(row => ({
      pkg: row.PKG,
      insurance: row.Insurance ?? 0
    }));

  setFooterData(footer);

      } else {
        setWeightData([]);
        setFooterData([]);
      }

    } catch (error) {
      console.error("Weight load error:", error);
      setWeightData([]);
      setFooterData([]);
    }
  }; 

  return (
    <section className="weight-section pb-[40px]">
      <div className="table-card">
        <table className="wt-table">
          <thead>
            <tr className="wt-head-top">
              <th rowSpan="2" className="col-units">Units</th>
              <th rowSpan="2" className="col-type">Type</th>
              <th rowSpan="2" className="col-desc">H Description</th>
              <th colSpan="4" className="weight-group text-center">WEIGHT</th>
              <th rowSpan="2">Class</th>
              <th rowSpan="2">Mult</th>
              <th rowSpan="2">Rate</th>
              <th rowSpan="2">Charges</th>
              <th rowSpan="2">Inventory Item</th>
            </tr>

            <tr className="wt-head-sub">
              <th className="weight-col">Stated</th>
              <th className="weight-col">Actual</th>
              <th className="weight-col">Dimensional</th>
              <th className="weight-col">Weight Code</th>
            </tr>
          </thead>

          <tbody>
            {weightData.length === 0 ? (
              <tr>
                <td colSpan="12" style={{ textAlign: "center" }}>
                  No Weight Data Found
                </td>
              </tr>
            ) : (
              weightData.map((row) => (
                <tr key={row.id}>
                  <td>{row.units}</td>
                  <td>{row.type}</td>
                <td className="desc-cell">

  <FilterContextWrapper
    onAction={(action, text) =>
      onContextAction(
        action,
        "Description",
        text || row.description
      )
    }
  >
    {row.description}
  </FilterContextWrapper>

</td>
                  <td className="weight-cell">{row.stated}</td>
                  <td className="weight-cell">{row.actual}</td>
                  <td className="weight-cell">{row.dimensional}</td>
                  <td className="weight-cell">{row.weightCode}</td>
                  <td>{row.class}</td>
                  <td>{row.mult}</td>
                  <td>{row.rate}</td>
                  <td>{row.charges}</td>
                  <td>{row.inventoryItem}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* <div className="wt-container">
        <div className="wt-section wt-border">
          <label className="wt-label">Accessorials</label>
          <input
            type="text"
            readOnly
            className="wt-input"
            value={accessorial}
          />
        </div>

        <div className="wt-section">
          <label className="wt-label">Insurance</label>
          <input
            type="text"
            readOnly
            className="wt-input"
            value={insurance}
          />
        </div>
      </div> */}
       {/* Footer Table */}
<div className="mt-0 w-full border-t mt-2 border-slate-200 bg-slate-50">
      <table className="w-full border-separate border-spacing-0">
        <tbody>
          {/* Header Row */}
          <tr className="bg-slate-100">
            <th className="px-4 py-3 text-left text-[14px] font-semibold text-slate-600 border-b border-slate-200">
              Accessorials
            </th>
            <th className="px-4 py-3 text-left text-[14px] font-semibold border-l text-slate-600 border-b border-slate-200">
              Insurance
            </th>
          </tr>
 
          {/* Dynamic Rows using .map() */}

          {footerData.length === 0 ? (
  <tr>
    <td colSpan="2" className="text-center py-3 text-slate-500">
      No Data
    </td>
  </tr>
) : (
  footerData.map((item, index) => (
    <tr key={index}>
      <td className="px-4 py-3 text-[12px] text-slate-700 border-b border-slate-200">
        {item.pkg}
      </td>
      <td className="px-4 py-3 text-[12px] text-slate-700 border-l border-b border-slate-200">
        {item.insurance}
      </td>
    </tr>
  ))
)}
          
        </tbody>
      </table>
    </div>
    </section>
  );
};


export default React.memo(WeightTable);