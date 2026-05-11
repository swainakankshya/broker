import React, { useState, useEffect } from "react";
import {
  faCaretDown,
  faFileLines,
  faFloppyDisk,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CheckIcon from "../icon/CheckIcon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

const TABS = [
  "Transit",
  "Images/AP",
  "Labels",
  "EDI",
  "Refs",
  "BL",
  "P&L",
  "Comm",
  "W&I",
];

const PillDropdown = ({ id, value, options, onSelect, width = "w-full" }) => (
  <div
    className={`input-pill ${width} py-1 pr-1 flex items-center justify-between`}
  >
    <span className="font-medium">{value}</span>
    <DropdownMenu id={id}>
      <DropdownMenuTrigger asChild>
        <button type="button" className="btn-dw">
          <FontAwesomeIcon icon={faCaretDown} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        {options.map((opt) => (
          <DropdownMenuItem key={opt} onSelect={() => onSelect(opt)}>
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

const SqrDropdown = ({ id, value, options, onSelect, width = "w-full" }) => (
  <div
    className={`input-sqr ${width} h-full border-l pl-2 flex items-center justify-between border-blue-200`}
  >
    <span className="text-[12px] truncate">{value}</span>
    <DropdownMenu id={id}>
      <DropdownMenuTrigger asChild>
        <button type="button" className="btn-dw rounded-[0px]">
          <FontAwesomeIcon icon={faCaretDown} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        {options.map((opt) => (
          <DropdownMenuItem key={opt} onSelect={() => onSelect(opt)}>
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
);

export default function RoutingAndRating({ invoiceData }) {
  const [activeTab, setActiveTab] = useState("Transit");
  const [formState, setFormState] = useState({
    fromSC: "GFS",
    toSC: "SFS",
    mode: "LTL",
    bus: "VICTORIA",
    legtype: "Line",
    vend: "Megallosy",
    status: "Opened",
    location: "Lone",
    ref: "R1",
    hotLoad: false,
    o: false,
    pConfirm: false,
    vendorName: "",
  VendorPhone: "",
  vendorNote: "",
  vendorRating: "",
    specialInstructions: "",
  notesToDispatch: "",
  });

  const updateField = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
  if (invoiceData) {
    setFormState(prev => ({
      ...prev,
      vendorName: invoiceData.Vendor || "",
      vendorPhone: invoiceData.VendorPhone || "",
      vendorNote: invoiceData.Note || "",
      vendorRating: invoiceData.Rating || "",
      specialInstructions: invoiceData.Special || "",
     notesToDispatch: invoiceData.DispatchNotes || "",
    }));
  }
}, [invoiceData]);

  return (
    <section className="routing-wrap">
      <div className="routing-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`routing-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="routing-content">
        {activeTab === "Transit" && (
          <>
            <div className="cs-row space-x-2 w-full mb-3">
              {[
                {
                  label: "From SC",
                  id: "fromSC",
                  options: ["GFS", "SFS", "NFS"],
                },
                { label: "To SC", id: "toSC", options: ["SFS", "GFS", "NFS"] },
                { label: "Mode", id: "mode", options: ["LTL", "TNL", "FNL"] },
                {
                  label: "Line of Bus",
                  id: "bus",
                  options: ["VICTORIA", "VT2", "VT3"],
                },
              ].map((item) => (
                <div className="cs-col" key={item.id}>
                  <label className="pb-1 text-[12px]">{item.label}</label>
                  <PillDropdown
                    id={item.id}
                    width="w-[100px]"
                    value={formState[item.id]}
                    options={item.options}
                    onSelect={(val) => updateField(item.id, val)}
                  />
                </div>
              ))}

              <div className="cs-col ml-3 space-y-1">
                {[
                  { label: "Hot Load", id: "hotLoad" },
                  { label: "O", id: "o" },
                ].map((cb) => (
                  <div className="checkbox-wrapper-33" key={cb.id}>
                    <label className="checkbox cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox__trigger visuallyhidden"
                        checked={formState[cb.id]}
                        onChange={(e) => updateField(cb.id, e.target.checked)}
                      />
                      <span className="checkbox__symbol">
                        <CheckIcon className="icon-checkbox" stroke="#ffffff" />
                      </span>
                      <p className="checkbox__textwrapper">{cb.label}</p>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="rt-tbl-wrapper">
              <table className="rt-table">
                <thead className="rt-head">
                  <tr className="text-[13px]">
                    <th className="pl-4 py-1 text-left whitespace-nowrap">Leg Type</th>
                    <th className="px-2 py-1 text-left">Vend</th>
                    <th className="px-2 py-1 text-left">Status</th>
                    <th className="px-2 py-1 text-left">Booking</th>
                    <th className="px-2 py-1 text-left">Cost Pay %</th>
                    <th className="px-2 py-1 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="rt-body">
                  <tr className="border-b text-[13px]">
                    <td className="px-2 py-1">
                      <PillDropdown
                        id="legtype"
                        value={formState.legtype}
                        options={["Line", "Line2"]}
                        onSelect={(val) => updateField("legtype", val)}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <PillDropdown
                        id="vend"
                        value={formState.vend}
                        options={["Megallos", "Mega"]}
                        onSelect={(val) => updateField("vend", val)}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <PillDropdown
                        id="tbl-status"
                        value={formState.status}
                        options={["Opened", "Closed"]}
                        onSelect={(val) => updateField("status", val)}
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="text"
                        className="eninp-n w-full text-right"
                      />
                    </td>
                    <td className="px-2 py-1 flex gap-2 items-center">
                      <input
                        type="text"
                        className="eninp-n w-[50px] text-right"
                        value="0.00"
                        readOnly
                      />
                      <input
                        type="text"
                        className="eninp-n w-[50px] text-right"
                        value="0.00"
                        readOnly
                      />
                    </td>
                    <td>
                      <div className="cs-row pl-2 space-x-2 justify-left">
                        <button
                          className="act-btn bg-gray-100 text-red-600"
                          title="Delete"
                        >
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                        <button
                          className="act-btn bg-gray-100 text-emerald-600"
                          title="Save"
                        >
                          <FontAwesomeIcon icon={faFloppyDisk} />
                        </button>
                        <button
                          className="act-btn bg-gray-100 text-blue-600"
                          title="View"
                        >
                          <FontAwesomeIcon icon={faFileLines} />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="vendor-block">
              <div className="v-box cs-row">
                <div className="v-row vr1">
                 <label>Vendor: </label>
<input
  type="text"
  className="eninp3"
  value={formState.vendorName}
  readOnly
/>
                  <input type="text" className="eninp3" placeholder="Value" />
                  <input type="text" className="eninp3" placeholder="Value" />
                </div>
              </div>
              <div className="v-box cs-row">
                <div className="v-row vr2">
                  <label>Phone: </label>
<input
  type="text"
  className="eninp3"
  value={formState.vendorPhone}
  readOnly
/>
                  <label className="v-lbl">Settlement: </label>
                  <input type="text" className="eninp3" placeholder="Value" />
                  <label className="v-lbl">Booking: </label>
                  <input type="text" className="eninp3" placeholder="Value" />
                </div>
              </div>
              <div className="v-box cs-row">
                <div className="v-row vr3">
                  <label>Master: </label>
                  <input type="text" className="eninp3" placeholder="Value" />
                  <label className="v-lbl">ACK: </label>
                  <input type="text" className="eninp3" placeholder="Value" />
                  <input type="text" className="eninp3" placeholder="Value" />
                </div>
              </div>
              <div className="v-box cs-row">
                <div className="v-row vr4">
                 <label>Note: </label>
<input
  type="text"
  className="eninp3"
  value={formState.vendorNote}
  readOnly
/>
                </div>
              </div>
              <div className="v-box cs-row">
                <div className="v-row vr5">
                  <label>Location: </label>
                  <SqrDropdown
                    id="location"
                    value={formState.location}
                    options={["Lone", "Lone2"]}
                    onSelect={(val) => updateField("location", val)}
                  />
                  <label className="v-lbl">A/P Ref: </label>
                  <SqrDropdown
                    id="ref"
                    value={formState.ref}
                    options={["R1", "R2"]}
                    onSelect={(val) => updateField("ref", val)}
                  />
                </div>
              </div>
              <div className="v-box cs-row">
                <div className="v-row vr6">
                  <label>Rating: </label>
<input
  type="text"
  className="eninp3"
  value={formState.vendorRating}
  readOnly
/>
                  <label className="v-lbl">Required: </label>
                  <input type="text" className="eninp3" />
                </div>
              </div>
              <div className="v-box cs-row">
                <div className="v-row vr7">
                  <label>E </label>
                  <input type="text" className="eninp3" placeholder="Value" />
                  <input type="text" className="eninp3" placeholder="Value" />
                  <label className="v-lbl">C </label>
                  <input type="text" className="eninp3" />
                  <input type="text" className="eninp3" />
                  <label className="v-lbl">Rating: </label>
                  <input type="text" className="eninp3" />
                </div>
              </div>
              <div className="cs-row py-2 justify-between">
                <strong className="text-center block text-gray-700">
                  CURRENT LEG
                </strong>
                <div className="checkbox-wrapper-33">
                  <label className="checkbox cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox__trigger visuallyhidden"
                      checked={formState.pConfirm}
                      onChange={(e) =>
                        updateField("pConfirm", e.target.checked)
                      }
                    />
                    <span className="checkbox__symbol">
                      <CheckIcon className="icon-checkbox" stroke="#ffffff" />
                    </span>
                    <p className="checkbox__textwrapper text-[12px]">
                      PConfirm
                    </p>
                  </label>
                </div>
              </div>
              <div className="v-box2 cs-row">
                <div className="v-row vr8">
                  <input type="text" className="eninp3" />
                  <input type="text" className="eninp3" />
                  <input type="text" className="eninp3" />
                  <label>Verbal Pod </label>
                  <input type="text" className="eninp3" />
                  <input type="text" className="eninp3" />
                  <input type="text" className="eninp3" />
                </div>
              </div>
              <div className="dispatch-container mt-2">
                <div className="dispatch-column">
                  <div className="dispatch-header">Special Instructions</div>
                  <textarea
                    name="specialInstructions"
                    className="dispatch-textarea"
                    value={formState.specialInstructions || ""}
                    onChange={(e) =>
                      updateField("specialInstructions", e.target.value)
                    }
                  />
                </div>
                <div className="dispatch-column border-left">
                  <div className="dispatch-header">Notes To Dispatch</div>
                  <textarea
                    name="notesToDispatch"
                    className="dispatch-textarea"
                    value={formState.notesToDispatch || ""}
                    onChange={(e) =>
                      updateField("notesToDispatch", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab !== "Transit" && (
          <div className="p-4">{activeTab} content</div>
        )}
      </div>
    </section>
  );
}
