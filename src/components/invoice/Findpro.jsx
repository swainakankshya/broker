import { useState, useEffect, useRef  } from "react";
import { getCustomerTags } from "../../api/customerApi";
import { getTempDropdown } from "../../api/proApi";
import { usePagination } from "../../context/PaginationContext";
import { searchInvoiceByPro, getFullInvoice } from "../../api/invoiceApi";
import FilterContextWrapper from "./FilterContextWrapper";

import {
  faSearch,
  faCaretDown,
  faAnglesLeft,
  faAngleLeft,
  faAngleRight,
  faAnglesRight,
  faSave,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropdownControllerProvider } from "../ui/dropdown-controller";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

export default function Findpro({ invoiceData, onContextAction }) {
  const {
  records,
  totalRecords,
  setRecords,
  setCurrentRecordIndex,
  currentRecordIndex,

    handleRecordPrev,
    handleRecordNext,

    handleFirstInvoice,
    handleLastInvoice
  } = usePagination();

  // 1. Optimized State Management
  const [formState, setFormState] = useState({
    query: "",
    type: "TS",
    temp: "TMP",
    tariff: "",
    servc: "DEL",
    from: "ORD",
    from2: "A",
    to: "ORD",
    to2: "A",
    equip: "P",
    equip2: "Q",
  });

  const [proData, setProData] = useState({});
const inputRef = useRef(null);
  const [tempOptions, setTempOptions] = useState([]);


  const [tariffOptions, setTariffOptions] = useState([]);
  const [searchError, setSearchError] = useState("");
  const [searchSuccess, setSearchSuccess] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  // Helper to update specific state keys
  const updateField = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };


  // 3. Reusable Dropdown Component (to reduce repetition)
  const PillDropdown = ({ id, value, options, onSelect, width = "w-full" }) => (
    <div className={`input-pill ${width} py-1 pr-1 flex items-center justify-between`}>
      <span className="font-medium">{value}</span>
      <DropdownMenu id={id}>
        <DropdownMenuTrigger asChild>
          <button type="button" className="btn-dw">
            <FontAwesomeIcon icon={faCaretDown} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator />
          {(options || []).map((opt) => (
            <DropdownMenuItem key={opt} onSelect={() => onSelect(opt)}>
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const fieldMap = {
    "PRO:": "ProNumber",
    "HAWB:": "HAWB",
    "MAWB:": "MAWB",
    "Ref:": "Reference",
    "Ref1:": "Ref1",
    "Ref2:": "Ref2",
    "Ref3:": "Ref3",
    "Ref4:": "Ref4",
    "Ref5:": "Ref5",
    "P.O.#:": "PO",
    "Carrier Pro:": "CarrierPro",
    "Booking #:": "Booking",
    "Unit #:": "Unit",
  };

const handleProSearch = async () => {

  setSearchError("");
  setSearchSuccess(false);

  if (!formState.query || formState.query.trim() === "") {
    setSearchError("Please enter a PRO number");
    inputRef.current?.focus();
    return;
  }

  try {

    setIsSearching(true);

    // 1️⃣ Get invoice number by PRO
    const result = await searchInvoiceByPro(formState.query);

    const invoiceNumber = result.InvoiceNumber;

    // 2️⃣ Get full invoice data
    const fullInvoice = await getFullInvoice(invoiceNumber);

    // 3️⃣ Replace pagination records
    setRecords([fullInvoice]);
    setCurrentRecordIndex(0);

    setSearchSuccess(true);
    updateField("query", "");

    setTimeout(() => {
      setSearchSuccess(false);
    }, 1500);

  } catch (err) {
    setSearchError("PRO not found in database");
    inputRef.current?.focus();
    inputRef.current?.select();
  } finally {
    setIsSearching(false);
  }
};
  useEffect(() => {
    getTempDropdown().then(setTempOptions);
  }, []);

  useEffect(() => {
    getCustomerTags().then((data) => {
      setTariffOptions(data.map(d => d.Tag));
    });
  }, []);

  useEffect(() => {
  if (!records || records.length === 0) {
    setProData({});
    return;
  }

  const current = records[currentRecordIndex];
  setProData(current || {});
}, [records, currentRecordIndex]);


  return (
    <DropdownControllerProvider>
      <section className="findpro-section">
        <div className="fn-header">
          <h6>Find PRO#</h6>
        </div>

        <div className="findpro">


          {/* Search */}
        <div className="search-field relative mb-1">

  <input
    ref={inputRef}
    type="search"
    className={`search-field__input
      ${searchError ? "border border-red-500" : ""}
      ${searchSuccess ? "ring-2 ring-green-400" : ""}
    `}
    placeholder="Search PRO"
    value={formState.query}
    onChange={(e) => {
      updateField("query", e.target.value);
      if (searchError) setSearchError("");
    }}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleProSearch();
      }
    }}
  />

  {/* Clear Button */}
  {formState.query && (
    <button
      type="button"
      className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      onClick={() => updateField("query", "")}
    >
      ×
    </button>
  )}

  <button
    type="button"
    className="search-field__btn"
    onClick={handleProSearch}
    disabled={!formState.query.trim()}
  >
    <FontAwesomeIcon icon={faSearch} />
  </button>

  {searchError && (
    <div className="absolute left-0 mt-2 z-50 top-[30px]">
      <div className="bg-red-500 text-white text-[12px] px-3 py-1 rounded-[6px] shadow-md">
        {searchError}
      </div>
      <div className="w-2 h-2 bg-red-500 rotate-45 absolute -top-1 left-4"></div>
    </div>
  )}

</div>
          { }
          {[
            ["PRO:", "Enter PRO"],
            ["HAWB:", "Enter HAWB"],
            ["MAWB:", "Enter MAWB"],
            ["Ref:", "Reference"],
            ["Ref1:", "Reference 1"],
            ["Ref2:", "Reference 2"],
            ["Ref3:", "Reference 3"],
            ["Ref4:", "Reference 4"],
            ["Ref5:", "Reference 5"],
            ["P.O.#:", "PO#"],
            ["Carrier Pro:", "CarrierPro"],
            ["Booking #:", "Booking"],
            ["Unit #:", "Unit"],
          ].map(([label, placeholder]) => (
            <div className="find-row" key={label}>
              <label>{label}</label>

              <FilterContextWrapper
                onAction={(action, text) =>
                  onContextAction(
                    action,
                    fieldMap[label],
                    text !== undefined && text !== null && text !== ""
                      ? text
                      : proData[fieldMap[label]]
                  )
                }
              >
                <input
                  type="text"
                  className="eninp-n"
                  value={proData[fieldMap[label]] || ""}
                  readOnly
                />
              </FilterContextWrapper>

            </div>
          ))}

          {/* Miles / Type */}
          <div className="find-row">
            <label>Miles/ Type:</label>
            <div className="flex gap-2 w-full">
              <input
                type="text"
                className="eninp-n"
                value={proData.Miles ?? ""}
                readOnly
              />
              <PillDropdown
                id="type"
                width="w-[60px]"
                value={proData.MilesType || formState.type}
                options={["TS", "SS", "NF"]}
                onSelect={(val) => updateField("type", val)}
              />
            </div>
          </div>

          <div className="find-row">
            <label>Predd:</label>
            <input
              type="text"
              className="eninp-n"
              value={proData.PredComm ?? ""}
              readOnly
            />
          </div>

          {/* Temp */}
          <div className="find-row">
            <label>Temp (KFF):</label>
            <div className="flex gap-2 w-full">
              <PillDropdown
                id="temp"
                width="pill-md"
                value={proData.Temp ?? formState.Temp}
                options={tempOptions}
                onSelect={(val) => updateField("Temp", val)}
              />
            </div>
          </div>

          <div className="find-row">
            <label>Manisfest/ LH:</label>
            <div className="flex gap-1 w-full">
              <input type="text" className="eninp-n" />
              <input type="text" className="eninp-n" />
            </div>
          </div>

          <strong className="text-center block text-gray-700 mt-2 mb-1 border-b border-[#a9cff9] pb-2">
            ROUTING / RATING
          </strong>

          <div className="find-btm">
            <div className="find-row-n">
              <label>Tariff:</label>
              <PillDropdown
                id="tariff"
                value={proData.Tag || formState.Tag}
                options={tariffOptions}
                onSelect={(val) => updateField("Tag", val)}
              />
            </div>
            <div className="find-row-n">
              <label>Service:</label>
              <div className="cs-row space-x-0">
                <PillDropdown
                  id="servc"
                  value={formState.servc}
                  options={["DEL", "SEL", "AEL"]}
                  onSelect={(val) => updateField("servc", val)}
                />
                <input type="text" className="eninp-n" />
              </div>
            </div>

            {/* From */}
            <div className="find-row-n">
              <label className="min-w-[50px]">From:</label>
              <div className="cs-row items-stretch space-x-1 w-full">
                <PillDropdown
                  id="from"
                  width="w-[110px]"
                  value={formState.from}
                  options={["ORD", "ODL", "ODL2"]}
                  onSelect={(val) => updateField("from", val)}
                />
                <PillDropdown
                  id="from2"
                  width="w-[70px]"
                  value={formState.from2}
                  options={["A", "B", "C"]}
                  onSelect={(val) => updateField("from2", val)}
                />
                <button type="button" className="search__btn w-[36px] flex items-center justify-center">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </div>

            {/* To */}
            <div className="find-row-n">
              <label className="min-w-[50px]">To:</label>
              <div className="cs-row items-stretch space-x-1 w-full">
                <PillDropdown
                  id="to"
                  width="w-[110px]"
                  value={formState.to}
                  options={["ORD", "NYC"]}
                  onSelect={(val) => updateField("to", val)}
                />
                <PillDropdown
                  id="to2"
                  width="w-[70px]"
                  value={formState.to2}
                  options={["A", "B"]}
                  onSelect={(val) => updateField("to2", val)}
                />
                <button type="button" className="search__btn w-[36px] flex items-center justify-center">
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
            </div>

            {/* Equip */}
            <div className="find-row-n">
              <label className="min-w-[50px]">Equip:</label>
              <div className="cs-row items-stretch space-x-1 w-full">
                <PillDropdown
                  id="equip"
                  value={formState.equip}
                  options={["P", "V", "R"]}
                  onSelect={(val) => updateField("equip", val)}
                />
                <PillDropdown
                  id="equip2"
                  width="w-[95px]"
                  value={formState.equip2}
                  options={["Q", "V", "R"]}
                  onSelect={(val) => updateField("equip2", val)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col  bg-gray-100 border-t border-[#a9cff9] w-full">

         <div className="flex flex-row items-center gap-1 px-2 py-3">

{/* FIRST RECORD */}
<button
  type="button"
  onClick={handleFirstInvoice}
  disabled={currentRecordIndex === 0}
  className={`rec-btn w-full max-w-[72px] text-[11px] py-2 ${
    currentRecordIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
  }`}
>
  <FontAwesomeIcon icon={faAnglesLeft} />
</button>

{/* PREVIOUS RECORD */}
<button
  type="button"
  onClick={handleRecordPrev}
  disabled={currentRecordIndex === 0}
  className={`rec-btn w-full max-w-[72px] text-[11px] py-2 ${
    currentRecordIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
  }`}
>
  <FontAwesomeIcon icon={faAngleLeft} />
</button>

{/* SAVE */}
<button className="rec-btn max-w-[70px] text-[9px] py-2">
  <FontAwesomeIcon icon={faSave} />
</button>

{/* NEXT RECORD */}
<button
  type="button"
  onClick={handleRecordNext}
  disabled={currentRecordIndex === records.length - 1}
  className={`rec-btn w-full max-w-[72px] text-[11px] py-2 ${
    currentRecordIndex === records.length - 1
      ? "opacity-50 cursor-not-allowed"
      : ""
  }`}
>
  <FontAwesomeIcon icon={faAngleRight} />
</button>

{/* LAST RECORD */}
<button
  type="button"
  onClick={handleLastInvoice}
  disabled={currentRecordIndex === records.length - 1}
  className={`rec-btn w-full max-w-[72px] text-[11px] py-2 ${
    currentRecordIndex === records.length - 1
      ? "opacity-50 cursor-not-allowed"
      : ""
  }`}
>
  <FontAwesomeIcon icon={faAnglesRight} />
</button>

</div>

          <div className="px-3 text-sm font-semibold min-w-[70px] text-center">
  {records.length === 0
    ? "0 / 0"
    : `${currentRecordIndex + 1} / ${records.length}`}
</div>
        </div>
      </section>
    </DropdownControllerProvider>
  );
}