import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { usePagination } from "../../context/PaginationContext";
import { getCustomerTags } from "../../api/customerApi";
import { getFullInvoice } from "../../api/invoiceApi";
import { showAlert } from "../../utils/alertService";
import FilterContextWrapper from "./FilterContextWrapper";
import CheckIcon from "../icon/CheckIcon";
import { getSpecialInstructionDropdown } from "../../api/invoiceApi";
import {
  faCaretDown,
  faDatabase,
  faPrint,
  faSearch,
  faFile,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";


const InvoiceHeader = ({
  invoiceData = {},
  onInvoiceLoad,
  onContextAction
}) => {

  // ===== PAGINATION CONTEXT =====
  const {
  setRecords,
  totalRecords,
  setCurrentRecordIndex
} = usePagination();

  const [orderNo, setOrderNo] = useState("");
  const [orderError, setOrderError] = useState("");
  const [customerTags, setCustomerTags] = useState([]);
 const [batchInput, setBatchInput] = useState("");
  const [fs1, setFs1] = useState("");
  const [fs2, setFs2] = useState("");

  const [specialOptions, setSpecialOptions] = useState([]);
  const [specialInstruction, setSpecialInstruction] = useState("");

  useEffect(() => {
    if (!invoiceData || !invoiceData.OrderNo) return;

    setOrderNo(invoiceData.OrderNo);
    setBatchInput(invoiceData.Batch || "");
    setFs1(invoiceData.Tag || "");
    setFs2(invoiceData.Tag || "");

    setSpecialInstruction(invoiceData.Special || "");

  }, [invoiceData]);

  useEffect(() => {
    const loadTags = async () => {
      const data = await getCustomerTags();
      setCustomerTags(data);
    };

    loadTags();
  }, []);


 const handleOrderSearch = async () => {
  setOrderError("");

  if (!orderNo || orderNo.trim() === "") {
    setOrderError("Please enter a valid Order Number");
    return;
  }

  try {
    const invoice = await getFullInvoice(orderNo);

    // Replace pagination data with searched invoice
    setRecords([invoice]);
    setCurrentRecordIndex(0);

    showAlert({
      icon: "success",
      title: "Order Found",
      text: `Order ${orderNo} loaded successfully`,
      timer: 2000,
    });

  } catch (err) {
    setOrderError(`Order ${orderNo} was not found`);
  }
};

  useEffect(() => {
    getSpecialInstructionDropdown().then((data) => {
      
      setSpecialOptions(data);
    });
  }, []);


  return (
    <header className="invoice-header">
      <div className="header-container">
        <div className="header-wrap cs-row">
          {/* Order */}
          <div className="hd-field-grp od-grp fs-grp">
            <label className="label-m label-bold flex items-end">
              Order#
              <button
                type="button"
                className="btn-sm ms-4"
                onClick={handleOrderSearch}
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </label>
            <FilterContextWrapper
              onAction={(action, text) =>
                onContextAction(
                  action,
                  "InvoiceNumber",
                  text || orderNo
                )
              }
            >
              <div className="relative">
                <div
                  className={`input-pill pill-sm mt-[6px] ${orderError ? "border border-red-500" : ""
                    }`}
                >
                  <FontAwesomeIcon
                    className="dbi"
                    icon={faDatabase}
                  />
                  <input
                    className="inp"
                    placeholder="Order No"
                    value={orderNo}
                    onChange={(e) => {
                      setOrderNo(e.target.value);
                      if (orderError) setOrderError("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleOrderSearch();
                      }
                    }}
                  />
                </div>

                {/*  ERROR TOOLTIP */}
                {orderError && (
                  <div className="absolute left-0 mt-1 bg-red-500 text-white text-[12px] px-3 py-1 rounded-[6px] shadow-md whitespace-nowrap z-50">
                    {orderError}
                  </div>
                )}
              </div>
            </FilterContextWrapper>
          </div>

          {/* Batch */}
          <div className="hd-field-grp od-grp">
            <label className="label-m label-smb flex items-end">
              Batch
              <button className="btn-sm ml-5 nw-btn">NEW</button>
              <button className="btn-sm ml-auto">
                <FontAwesomeIcon icon={faPrint} />
              </button>
            </label>

            <div className="input-pill pill-md mt-[6px] flex items-center">
              <FilterContextWrapper
                onAction={(action, text) =>
                  onContextAction(action, "BatchNumber", text || invoiceData.Batch)
                }
              >
        <input
  type="text"
  className="inp"
  value={batchInput}
  placeholder="Batch No"
  onChange={(e) => setBatchInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onContextAction("find", "BatchNumber", batchInput);
    }
  }}
/>
              </FilterContextWrapper>

            </div>
          </div>

          {/* Source */}
          <div className="sq-btn">
            Sorce <span>GUI</span>
          </div>

          {/* FAC */}
          <div className="hd-field-grp cs-row od-grp">
            <label className="label-m label-smb mr-3">FAC</label>

            <div className="cs-row flex-col justify-between h-[61px]">
              {/* Dropdown 1 */}
              <FilterContextWrapper
                onAction={(action, text) =>
                  onContextAction(action, "TagValue", text || fs1)
                }
              >
                <div className="input-pill w-[115px] py-1 h-[29px] pr-1 pill-md flex items-center justify-between">
                  <span className="font-medium">{fs1}</span>

                  <DropdownMenu id="header-fac-1">
                    <DropdownMenuTrigger>
                      <button type="button" className="btn-dw">
                        <FontAwesomeIcon icon={faCaretDown} />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuSeparator />
                      {customerTags.map((tag, i) => (
                        <DropdownMenuItem
                          key={i}
                          onSelect={() => setFs1(tag.Tag)}
                        >
                          {tag.Tag}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </FilterContextWrapper>

              {/* Dropdown 2 */}
              <FilterContextWrapper
                onAction={(action, text) =>
                  onContextAction(action, "TagValue", text || fs2)
                }
              >
                <div className="input-pill w-[115px] py-1 pr-1 pill-md mt-[2px] h-[29px]  flex items-center justify-between">
                  <span className="font-medium">{fs2}</span>

                  <DropdownMenu id="header-fac-2">
                    <DropdownMenuTrigger>
                      <button type="button" className="btn-dw">
                        <FontAwesomeIcon icon={faCaretDown} />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuSeparator />

                      {customerTags.map((tag, i) => (
                        <DropdownMenuItem
                          key={i}
                          onSelect={() => setFs2(tag.Tag)}
                        >
                          {tag.Tag}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </FilterContextWrapper>
            </div>
          </div>

        
          {/* Special */}
          <div className="hd-field-grp od-grp flex flex-col justify-between h-[61px]">
            <label className="label-m label-smb text-[15px] flex items-center">
              Special
              <button className="btn-sm nw-btn2 ml-auto">View</button>
            </label>

            <div className="input-pill py-1 pr-1 pill-md mt-[4px] w-[220px] flex items-center justify-between">

              {/* selected value */}
              <span className="font-medium truncate">
                {specialInstruction || "-"}
              </span>

              {/* dropdown */}
              <DropdownMenu id="header-special-dd">
                <DropdownMenuTrigger>
                  <button type="button" className="btn-dw px-1">
                    <FontAwesomeIcon icon={faCaretDown} />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuSeparator />

                  {specialOptions.map((opt, i) => (
                    <DropdownMenuItem
                      key={i}
                      onSelect={() => setSpecialInstruction(opt)}
                    >
                      {opt}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

            </div>
          </div>

          <div className="cs-row flex-col flex justify-between h-[62px]">
            {/* Routing Sheet Button */}
            <button className="rec-btn mb-2 whitespace-nowrap">
              Routing Sheet
            </button>
            {/* Cancelled Checkbox */}
            <div className="cs-row">
              <div className="checkbox-wrapper-33">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    className="checkbox__trigger visuallyhidden"
                    checked={invoiceData.IsCancelled === true}
                    readOnly
                  />
                  <span className="checkbox__symbol">
                    <CheckIcon
                      size={28}
                      className="icon-checkbox"
                      stroke="#ffffff"
                    />
                  </span>

                  <p className="checkbox__textwrapper">Cancelled</p>
                </label>
              </div>
            </div>
          </div>

          {/* print/invoice */}
          <button className="sq-btn2">
            PRINT <span>INVOICE</span>
          </button>
          {/* print/invoice */}
          <button className="sq-btn2">
            INSTANT <span>D/R</span>
          </button>
          <div className="cs-row flex-col">
            {/* Trace */}
            <button className="rec-btn mb-2 py-2">TRACE</button>
            {/* DUPE */}
            <button className="rec-btn py-2">DUPE</button>
          </div>
          {/* card */}
          <div className="audit-card">
            <div className="audit-row">
              <span className="audit-label">Entered</span>
              <span className="audit-user">{invoiceData.EnteredBy}</span>
              <span className="audit-date">{invoiceData.EnteredDate}</span>
            </div>

            <div className="audit-row">
              <span className="audit-label">Billed</span>
              <span className="audit-user">{invoiceData.BilledBy}</span>
              <span className="audit-date">{invoiceData.BilledDate}</span>
            </div>

            <div className="audit-row">
              <span className="audit-label">Changed</span>
              <span className="audit-user">{invoiceData.ChangedBy}</span>
              <span className="audit-date">{invoiceData.ChangedDate}</span>
            </div>
          </div>

          {/* btn warp */}
          <div className="cs-row flex-col w-[35px]">
            <button className="rec-btn mb-[8px] py-[8px]">
              <FontAwesomeIcon icon={faFile} />
            </button>
            <button className="rec-btn py-[8px]">
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default InvoiceHeader;
