import { useState, useEffect } from "react";
import { usePagination } from "../../context/PaginationContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getCustomerList } from "../../api/customerApi";
import { getCountryDropdown } from "../../api/invoiceApi";
import FilterContextWrapper from "./FilterContextWrapper";
import PillDropdownWithContext from "../ui/PillDropdownWithContext";
import PillDropdown from "../ui/PillDropdown";
import { getConsigneeDropdown } from "../../api/invoiceApi";
import { getCompanyDropdown } from "../../api/invoiceApi";
import {
  getCustomerZipDropdown,
  getShipperZipDropdown,
  getConsigneeZipDropdown
} from "../../api/invoiceApi";

import CheckIcon from "../icon/CheckIcon";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

import {
  getShipperDropdown,
  getHLDropdown
} from "../../api/invoiceApi";

const Entityinfo = ({ invoiceData, onContextAction }) => {

  const [consigneeOptions, setConsigneeOptions] = useState([]);

  const entityFieldMap = {
    cust1: "CompanyName",
    cust2: "CompanyName",

    atShipper: "Shipper",
    atZip: "CZip",

    sZip: "SZip",
    cZip: "CZip",

    fax: "Fax",
    callerPhone: "CallerPhone",
    CState: "CState",
    SState: "SState",
    tag: "Tag",
    phone: "Phone",
    phone2: "Phone2",
    cont: "Caller",
    PurchaseOrderNumber: "PO",
    pickupDate: "PuDate",

    shipperCity: "SCity",
    consigneeCity: "CCity",

    add1: "SAdd",
    add2: "CAddress",

    invoiceNo: "InvoiceNumber",
    orderNo: "OrderNo",
    batchNo: "BatchNumber"
  };

  // dropdown options
  const [shipperOptions, setShipperOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);
  const [shipperDropdown, setShipperDropdown] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);

  // Customer table ZIP (for "At" section)
  const [customerZipOptions, setCustomerZipOptions] = useState([]);
  const [shipperZipOptions, setShipperZipOptions] = useState([]);
  const [consigneeZipOptions, setConsigneeZipOptions] = useState([]);
  const [invoiceSZipOptions, setInvoiceSZipOptions] = useState([]);

  // InvoiceTable ZIPs

  useEffect(() => {

    getShipperDropdown().then(setShipperDropdown);

    // CUSTOMER ZIP for “At → ZIP”
    getCustomerZipDropdown().then(setCustomerZipOptions);
    getConsigneeDropdown().then(setConsigneeOptions);
    // InvoiceTable ZIPs
    getShipperZipDropdown().then(setInvoiceSZipOptions);
    getConsigneeZipDropdown().then(setConsigneeZipOptions);

  }, []);


  useEffect(() => {
    getShipperDropdown().then((data) => {
      setShipperOptions(data.map(d => d.Shipper ?? d));
    });
  }, []);

  useEffect(() => {
    getCountryDropdown().then((data) => {
      setCountryOptions(data.map(d => d.Country));
      setTagOptions(data.map(d => d.Tag));
    });
  }, []);

  useEffect(() => {
  getCompanyDropdown().then(setCompanyOptions);
}, []);

  // Grouped State for better optimization
  const [formState, setFormState] = useState({
    whs1: "WHSE",
    whs2: "WHSE",

    cust1: "",
    cust2: "",

    add1: "",
    add2: "",

    cons1: "",
    cons2: "",

    atShipper: "",
    atZip: "",
    SAdd: "",
    CAdd: "",

    ilState: "",
    ilCountry: "",

    shipper: "",

    SState: "",
    sZip: "",

    CState: "",
    cZip: "",
    hlCountry: "",

    mCountryId: "",

    caller: "",
    callerPhone: "",

    pickupDate: null,
    selectDate: null,
    fromDate: null,
    toDate: null,
    time: "",

    phone: "",
    phone2: "",
    fax: "",

    shipperCity: "",
    consigneeCity: "",

    miles: 0

  });

  useEffect(() => {
    if (!invoiceData) return;

    setFormState((prev) => ({
      ...prev,

      // Customer
      cust1: invoiceData.CompanyName || "",
      cust2: invoiceData.CompanyName || "",
      add1: invoiceData.Address || "",
      add2: invoiceData.Address || "",
      cons1: invoiceData.Consignee || "",
      cons2: invoiceData.Consignee || "",

      atShipper: invoiceData.IL || "",
      atZip: invoiceData.Zip || "",

      SAdd: invoiceData.SAdd || "",
      CAdd: invoiceData.CAdd || "",
      // =================
      caller: invoiceData.Caller || "",
      callerPhone: invoiceData.CallerPhone || "",
      notesToDispatch: invoiceData.DispatchNotes || "",

      mCountryId: invoiceData.CountryID || "",
      // IL
      ilCountry: invoiceData.Country || "",

      // HL
      hlTag: invoiceData.HLTag || "",
      hlCountry: invoiceData.Country || "",

      // =================
      // CONTACT
      // =================
      phone: invoiceData.Phone || "",
      phone2: invoiceData.Phone2 || "",
      fax: invoiceData.Fax || "",

      // =================
      // CSZ
      // =================
      shipperCity: invoiceData.SCity || "",
      consigneeCity: invoiceData.CCity || "",

      shipper: invoiceData.Shipper || "",

      SState: invoiceData.SState || "",
      sZip: invoiceData.SZip || "",

      CState: invoiceData.CState || "",
      cZip: invoiceData.CZip || "",


      pickupDate: invoiceData.PuDate
        ? new Date(invoiceData.PuDate)
        : null,

      selectDate: invoiceData.SelectDate
        ? new Date(invoiceData.SelectDate)
        : null,

      fromDate: invoiceData.FromDate
        ? new Date(invoiceData.FromDate)
        : null,

      toDate: invoiceData.ConfirmedDate
        ? new Date(invoiceData.ConfirmedDate)
        : null,

      time: invoiceData.VerbalPODTime || "",


      // =================
      // OTHER
      // =================
      miles: invoiceData.Miles || 0,
    }));
  }, [invoiceData]);


  const updateField = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomerList().then(setCustomers);
  }, []);

  const zipOptions = customers.map(c => c.Zip).filter(Boolean);

  const stateOptions = customers.map(c => c.State).filter(Boolean);


  return (
    <section className="entity-section">
      <div className="en-header">
        <h6>Entity Information</h6>
      </div>
      <div className="en-wrap">
        <div className="vertical-bar">
          <div className="vertical-text">BILL</div>
          <div className="vertical-text">SHIPPER</div>
          <div className="vertical-text">CONSIGNEE</div>
        </div>
        <div className="entity">
          <div className="en-box-wrap">
            {/* BOX 1 */}
            <div className="en-box1">
              <div className="en-input-wrap cs-row space-x-[3px] justify-between">
                <div className="en-input-col cs-col">
                  <label>Caller</label>

                  <input
                    className="eninp"
                    value={formState.caller}
                    readOnly
                  />

                </div>
                <div className="en-input-col cs-col">
                  <label>Caller Phone</label>
                  <FilterContextWrapper
                    onAction={(action, text) =>
                      onContextAction(action, entityFieldMap.callerPhone, text || formState.callerPhone)
                    }
                  >
                    <input
                      className="eninp"
                      value={formState.callerPhone}
                      readOnly
                    />
                  </FilterContextWrapper>
                </div>
                <div className="en-input-col cs-col">
                  <label>Order type</label>
                  <PillDropdown
                    id="order-type"
                    value={formState.whs1}
                    options={["WHSE", "SFS", "NFS"]}
                    onSelect={(val) => updateField("whs1", val)}
                  />
                </div>
                <div className="en-input-col cs-col">
                  <label>Quote#</label>
                  <PillDropdown
                    id="quote"
                    className="mt-[2px]"
                    value={formState.whs2}
                    options={["WHSE", "SFS", "NFS"]}
                    onSelect={(val) => updateField("whs2", val)}
                  />
                </div>
              </div>

              <div className="en-input-wrap en-input-col cs-row space-x-[4px]">
                <label className="mr-3">Cust :</label>

                <PillDropdownWithContext
                  id="cust1"
                  value={formState.cust1}
                  options={companyOptions}
                  onSelect={(val) => updateField("cust1", val)}
                  displayLimit="120px"
                  fieldName="CompanyName"
                  onContextAction={onContextAction}
                />
                <FilterContextWrapper
                  onAction={(action, text) =>
                    onContextAction(action, "CompanyName", text || formState.cust1)
                  }
                >
                  <input
                    type="text"
                    className="eninp w-full"
                    value={formState.cust1}
                    readOnly
                  />
                </FilterContextWrapper>
              </div>


              <div className="en-input-wrap en-input-col cs-row space-x-[4px]">
                <label className="mr-5">Bill :</label>

                <FilterContextWrapper
                  onAction={(action, text) =>
                    onContextAction(action, "CompanyName", text || formState.cust2)
                  }
                >
                  <div style={{ width: "100%" }}>
                    <PillDropdown
                      id="cust2"
                      value={formState.cust2}
                      options={companyOptions}
                      onSelect={(val) => updateField("cust2", val)}
                      displayLimit="150px"
                    />
                  </div>
                </FilterContextWrapper>

                <FilterContextWrapper
                  onAction={(action, text) =>
                    onContextAction(action, "CompanyName", text || formState.cust2)
                  }
                >
                  <input
                    type="text"
                    className="eninp w-full"
                    value={formState.cust2}
                    readOnly
                  />
                </FilterContextWrapper>
              </div>


              <div className="cs-row space-x-5 gap-5">
                {["Prepaid", "Collect", "3rd Party"].map((text) => (
                  <div className="checkbox-wrapper-33" key={text}>
                    <label className="checkbox">
                      <input type="checkbox" className="checkbox__trigger visuallyhidden" />
                      <span className="checkbox__symbol">
                        <CheckIcon size={28} className="icon-checkbox" stroke="#ffffff" />
                      </span>
                      <p className="checkbox__textwrapper">{text}</p>
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="separator"></div>
            {/* BOX 2 */}
            <div className="en-box2">
              <div className="en-input-wrap en-input-col cs-row space-x-[4px]">
                <label className="cs-label mr-5">At :</label>
                <PillDropdownWithContext
                  id="shipper"
                  value={formState.shipper}
                  options={shipperDropdown}
                  onSelect={(v) => updateField("shipper", v)}
                  displayLimit="100px"
                  fieldName="Shipper"
                  onContextAction={onContextAction}
                />
                <FilterContextWrapper
                  onAction={(action, text) =>
                    onContextAction(action, entityFieldMap.atZip, text || formState.atZip)
                  }
                >
                  <PillDropdown
                    id="atZip"
                    value={formState.atZip}
                    options={customerZipOptions}
                    onSelect={(v) => updateField("atZip", v)}
                  />
                </FilterContextWrapper>
              </div>

              <div className="en-input-wrap en-input-col cs-row items-center space-x-[4px]">
                <label className="mr-5 cs-label">Add :</label>
                <FilterContextWrapper onAction={(action, text) =>
                  onContextAction(action, "SAdd", text || formState.SAdd)
                }>
                  <p className="font-semibold cursor-pointer">
                    {formState.SAdd}
                  </p>
                </FilterContextWrapper>

              </div>

              <div className="en-input-wrap en-input-col cs-row items-center space-x-[4px]">
                <label className="mr-5 cs-label">CSZ :</label>
                <FilterContextWrapper onAction={(action, text) =>
                  onContextAction(action, entityFieldMap.shipperCity, text || formState.shipperCity)
                }>
                  <p className="cursor-pointer">{formState.shipperCity}</p>
                </FilterContextWrapper>
                <div className="checkbox-wrapper-33 ml-auto">
                  <label className="checkbox">
                    <input type="checkbox" className="checkbox__trigger visuallyhidden" />
                    <span className="checkbox__symbol">
                      <CheckIcon size={28} className="icon-checkbox" stroke="#ffffff" />
                    </span>
                    <p className="checkbox__textwrapper">BL</p>
                  </label>
                </div>
              </div>

              <div className="en-input-wrap en-input-col cs-row space-x-[4px]">
                <FilterContextWrapper
                  onAction={(action, text) =>
                    onContextAction(action, entityFieldMap.SState, text || formState.SState)
                  }
                >
                  <input
                    type="text"
                    className="eninp max-w-[100px] "
                    value={formState.SState}
                    readOnly
                  />
                </FilterContextWrapper>
                <PillDropdownWithContext
                  id="sZip"
                  value={formState.sZip}
                  options={invoiceSZipOptions}
                  onSelect={(v) => updateField("sZip", v)}
                  displayLimit="60px"
                  fieldName="SZip"
                  onContextAction={onContextAction}
                />
                <FilterContextWrapper
  onAction={(action, text) =>
    onContextAction(
      action,
      "Country",
      text || formState.ilCountry
    )
  }
>
  <div className="w-full">
    <PillDropdown
    id="ilCountry"
      value={formState.ilCountry}
      options={countryOptions}
      onSelect={(v) => updateField("ilCountry", v)}
    />
  </div>
</FilterContextWrapper>
              </div>
              <div className="en-input-wrap cs-row space-x-[4px] justify-between h-light2">
                <div className="en-input-col cs-col">
                  <label>Cont</label>
                  <FilterContextWrapper
                    onAction={(action, text) =>
                      onContextAction(action, entityFieldMap.phone, text || formState.phone)
                    }
                  >
                    <input
                      className="eninp"
                      value={formState.phone}
                      readOnly
                    />
                  </FilterContextWrapper>

                </div>

                <div className="en-input-col cs-col">
                  <label>Phone</label>
                  <FilterContextWrapper
                    onAction={(action, text) =>
                      onContextAction(action, entityFieldMap.phone2, text || formState.phone2)
                    }
                  >
                    <input
                      className="eninp"
                      value={formState.phone2}
                      readOnly
                    />
                  </FilterContextWrapper>
                </div>

                <div className="en-input-col cs-col">
                  <label>Fx</label>
                  <FilterContextWrapper
                    onAction={(action, text) =>
                      onContextAction(action, entityFieldMap.fax, text || formState.fax)
                    }
                  >
                    <input
                      className="eninp"
                      value={formState.fax}
                      readOnly
                    />
                  </FilterContextWrapper>

                </div>
              </div>

              <div className="flex justify-between space-x-2 items-center w-full">
                <div>
                  <label className="text-[12px] font-medium mr-4 whitespace-nowrap">PU Date</label>
                  <DatePicker
                    selected={formState.pickupDate}
                    readOnly
                    onChange={(date) => updateField("pickupDate", date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="DD / MM / YYYY"
                    className="eninp w-full flex-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  />
                </div>
                <div className="checkbox-wrapper-33">
                  <label className="checkbox">
                    <input type="checkbox" className="checkbox__trigger visuallyhidden" />
                    <span className="checkbox__symbol">
                      <CheckIcon size={28} className="icon-checkbox" stroke="#ffffff" />
                    </span>
                    <p className="checkbox__textwrapper">Ready</p>
                  </label>
                </div>
              </div>

              <div className="en-input-wrap cs-row space-x-[4px] justify-between h-light2 mt-2">
                <div className="en-input-col cs-col">
                  <label>Close</label>
                  <input type="text" className="eninp" placeholder="Close" />
                </div>
                <div className="en-input-col cs-col">
                  <label>M</label>
                  <input
                    className="eninp"
                    value={formState.mCountryId}
                    readOnly
                  />
                </div>
                <div className="en-input-col cs-col">
                  <label>EML</label>
                  <input type="text" className="eninp" placeholder="EML" />
                </div>
              </div>

              <div className="en-input-row space-x-2 cs-row">

                <label className="mr-2 text-[12px]">ETA:</label>
                <input type="text" className="eninp bg-blue-300/10" />
              </div>
            </div>
            <div className="separator"></div>
            {/* BOX 3 */}
            <div className="en-box3">
              <div className="en-input-wrap en-input-col cs-row space-x-[4px]">
                <label className="cs-label mr-5">Cons :</label>
                <FilterContextWrapper
                  onAction={(action, text) =>
                    onContextAction(
                      action,
                      "Consignee",
                      text || formState.cons1
                    )
                  }
                >
                  <div>
                    <PillDropdown
                    id="cons1"
                      value={formState.cons1}
                      options={consigneeOptions}
                      onSelect={(val) => updateField("cons1", val)}
                      displayLimit="120px"
                    />
                  </div>
                </FilterContextWrapper>
                <PillDropdown
                  id="cons2"
                  value={formState.cons2}
                  options={consigneeOptions}
                  onSelect={(val) => updateField("cons2", val)}
                  displayLimit="120px"
                />
              </div>
              <div className="en-input-wrap en-input-col cs-row items-center space-x-[4px]">
                <label className="mr-5 cs-label">Add :</label>

                <FilterContextWrapper
                  onAction={(action, text) =>
                    onContextAction(action, "CAddress", text || formState.CAdd)
                  }
                >
                  <p className="font-semibold cursor-pointer">
                    {formState.CAdd}
                  </p>
                </FilterContextWrapper>
              </div>
              <div className="en-input-wrap en-input-col cs-row space-x-[4px]">
                <FilterContextWrapper
                  onAction={(action, text) =>
                    onContextAction(action, entityFieldMap.CState, text || formState.CState)
                  }
                >
                  <input
                    type="text"
                    className="eninp max-w-[100px]"
                    value={formState.CState}
                    readOnly
                  />
                </FilterContextWrapper>
                <PillDropdownWithContext
                  id="cZip"
                  value={formState.cZip}
                  options={consigneeZipOptions}
                  onSelect={(v) => updateField("cZip", v)}
                  displayLimit="60px"
                  fieldName="CZip"
                  onContextAction={onContextAction}
                />
                <FilterContextWrapper
  onAction={(action, text) =>
    onContextAction(
      action,
      "Country",
      text || formState.hlCountry
    )
  }
>
  <div className="w-full max-w-full">
    <PillDropdown
    id="hlCountry"
      value={formState.hlCountry}
      options={countryOptions}
      onSelect={(v) =>
        setFormState(p => ({ ...p, hlCountry: v }))
      }
    />
  </div>
</FilterContextWrapper>
              </div>

              <div className="en-input-wrap en-input-col cs-row items-center space-x-[4px]">
                <label className="mr-5 cs-label">CSZ :</label>
                <FilterContextWrapper
                  onAction={(action, text) =>
                    onContextAction(action, entityFieldMap.consigneeCity, text || formState.consigneeCity)
                  }
                >
                  <p className="cursor-pointer">{formState.consigneeCity}</p>
                </FilterContextWrapper>
                <div className="checkbox-wrapper-33 ml-auto">
                  <label className="checkbox">
                    <input type="checkbox" className="checkbox__trigger visuallyhidden" />
                    <span className="checkbox__symbol">
                      <CheckIcon size={28} className="icon-checkbox" stroke="#ffffff" />
                    </span>
                    <p className="checkbox__textwrapper">BL</p>
                  </label>
                </div>
              </div>


              <div className="en-input-wrap en-input-col cs-row items-center space-x-[4px]">
                <div className="checkbox-wrapper-33 mr-auto">
                  <label className="checkbox">
                    <input type="checkbox" className="checkbox__trigger visuallyhidden" />
                    <span className="checkbox__symbol">
                      <CheckIcon size={28} className="icon-checkbox" stroke="#ffffff" />
                    </span>
                    <p className="checkbox__textwrapper text-[13px]">Appointment</p>
                  </label>
                </div>
              </div>

              <div className="cs-row space-x-2 h-light">
                <div className="flex flex-col items-start">
                  <label className="text-[12px] font-medium mr-4 whitespace-nowrap">Date:</label>
                  <DatePicker className="bg-white rounded-[6px] p-1"
                    selected={formState.selectDate}
                    readOnly
                  />

                </div>
                <div className="en-input-col cs-col">
                  <label>From</label>
                  <input
                    className="eninp"
                    value={formState.fromDate?.toLocaleDateString() || ""}
                    readOnly
                  />
                </div>
                <div className="en-input-col cs-col">
                  <label>To</label>
                  <input
                    className="eninp"
                    value={formState.toDate?.toLocaleDateString() || ""}
                    readOnly
                  />
                </div>
              </div>

              <label className="text-[12px] text-gray-500 my-2 font-medium mr-4 whitespace-nowrap">
                Required By :
              </label>

              <div className="cs-row space-x-2 h-light">
                <div className="flex flex-col items-start">
                  <label className="text-[12px] font-medium mr-4 whitespace-nowrap">Date:</label>
                  <DatePicker className="bg-white rounded-[6px] p-1"
                    selected={formState.selectDate}
                    readOnly
                  />
                </div>
                <div className="en-input-col cs-col">
                  <label>Time</label>
                  <input
                    className="eninp"
                    value={formState.time}
                    readOnly
                  />
                </div>
              </div>

              <div className="en-input-row mt-2 cs-row">
                <label className="mr-5">MILES:</label>
                <input
                  className="eninp bg-blue-400/10"
                  value={formState.miles}
                  readOnly
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-row flex-wrap py-2 space-y-1 gap-1 p-1 space-x-1 justify-center bg-white/50 rounded-t-[5px] w-full">
              {["Line Items", "Inventory", "Stops", "View HAZ", "View Rates"].map((btnText) => (
                <button
                  key={btnText}
                  className="rec-btn w-full max-w-[82px] text-[11px] whitespace-nowrap py-2 px-1"
                >
                  {btnText}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Entityinfo;