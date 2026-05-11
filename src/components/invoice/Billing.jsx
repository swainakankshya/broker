import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

import {
  getTermsDropdown,
  getOpHoldDropdown,
  getDriverCollectDropdown,
  getDriverKeyDropdown 
} from "../../api/invoiceApi";

import { getCallerDropdown } from "../../api/invoiceApi";

import CheckIcon from "../icon/CheckIcon";

// PillDropdown Component
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

const Billing = ({ invoiceData }) => {
  const [formState, setFormState] = useState({
    servc: "DEL",
    freight: "",
    discount: "",
    accessorial: "",
    insurance: "",
    fsc: "",
fsc1: "",
fsc2: "",
fuelSurchargeKey: "",
fuelSurchargeAmount: "",
    total: "",
    balance: "",
    terms: "NET 30",
    statement: "0",
    dwellTime: "0",
    // Box 3 Fields
    opHold: "",
    dl: "",
    hazmat: false,
    printHold: false,
    audited: false,
    closed: true,
    post: false,
    remoteEdit: false,
    // Box 4 Fields (New)
    driverCollect: false,
    driverCollectVal: "",
    cod: "",
    codCheck: false,
    codAmount: "0.00",
    codFeeCol: false,
    codFeeAmount: "0.00",
    codPayTo: "0",
    //Box 5 fields
    deleveredVal: "0.00",
    insuredAmt: "0.00",
  });

  const updateField = (key, value) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

const [termsOptions, setTermsOptions] = useState([]);
const [opHoldOptions, setOpHoldOptions] = useState([]);
const [driverCollectOptions, setDriverCollectOptions] = useState([]);
const [fscOptions, setFscOptions] = useState([]);
const [driverKeyOptions, setDriverKeyOptions] = useState([]);

  useEffect(() => {
  if (!invoiceData) return;

  setFormState(prev => ({
    ...prev,

    freight: invoiceData.Freight ?? "",
    discount: invoiceData.Discount ?? "",
    insurance: invoiceData.Insurance ?? "",
    fsc: invoiceData.Caller ?? "", 
    total: invoiceData.Total ?? "",
    balance: invoiceData.Balance ?? "",
    terms: invoiceData.Terms ?? "",
    statement: invoiceData.Statement ?? "",
    fuelSurchargeKey: invoiceData.FuelSurchargeKey ?? "",
fuelSurchargeAmount: invoiceData.FuelSurchargeAmount ?? "",
dl: invoiceData.DriverKey ?? "",

    // ✅ Checkbox values (-1 = true, 0 = false)
    driverCollect: invoiceData.DriverCollect === -1,
    codCheck: invoiceData.COD === -1,
    codFeeCol: invoiceData.CODFee === -1,

    // Dropdown / numeric values
    opHold: invoiceData.OpHold ?? "",
    driverCollectVal: invoiceData.DriverCollect ?? "",

    codAmount: invoiceData.COD ?? "0.00",
    codFeeAmount: invoiceData.CODFee ?? "0.00",
    codPayTo: invoiceData.CODPayTo ?? "",

    deleveredVal: invoiceData.DeclaredValue ?? "0.00",
    insuredAmt: invoiceData.InsuredValue ?? "0.00",

  }));
}, [invoiceData]);


useEffect(() => {
  getTermsDropdown().then(data => {
    setTermsOptions(data);
  });

  getOpHoldDropdown().then(data => {
    setOpHoldOptions(data);
  });

  getDriverCollectDropdown().then(data => {
    setDriverCollectOptions(data);
  });
}, []);

useEffect(() => {
  getCallerDropdown().then(data => {
    
    setFscOptions(data);
  });
}, []);

useEffect(() => {
  getDriverKeyDropdown().then(setDriverKeyOptions);
}, []);

  return (
    <section className="billing-section">
      <div className="fn-header">
        <h6>Billing</h6>
      </div>
 
      <div className="billing space-y-2 p-2">
        {/* Box 1: Main Fields */}
        <div className="bl-box1 space-y-1">
          {[
            ["Freight:", "freight", "Value"],
            ["Discount:", "discount", "Value"],
            ["Accessorial:", "accessorial", "Enter Value"],
            ["Insurance / DV:", "insurance", "Enter Value"],
          ].map(([label, key, placeholder]) => (
            <div className="bill-row" key={key}>
              <label>{label}</label>
              <input
                type="text"
                className="eninp-n"
                placeholder={placeholder}
                value={formState[key]}
                onChange={(e) => updateField(key, e.target.value)}
              />
            </div>
          ))}

          {/* FSC Section */}
          <div className="bill-row-n">
            <label>FSC:</label>
            <div className="cs-row space-x-1">
              <PillDropdown
  id="fsc"
  value={formState.fsc}
  options={fscOptions}
  onSelect={(val) => updateField("fsc", val)}
/>
              <input
  type="text"
  className="eninp-n"
  placeholder="Fuel Key"
  value={formState.fuelSurchargeKey}
  onChange={(e) => updateField("fuelSurchargeKey", e.target.value)}
/>

<input
  type="text"
  className="eninp-n"
  placeholder="Fuel Amount"
  value={formState.fuelSurchargeAmount}
  onChange={(e) => updateField("fuelSurchargeAmount", e.target.value)}
/>
            </div>
          </div>

          {/* Total & Balance */}
          {[
            ["Total", "total", "$0.00"],
            ["Balance", "balance", "$0.00"],
          ].map(([label, key, placeholder]) => (
            <div className="bill-row mt-2" key={key}>
              <label>{label}:</label>
              <input
                type="text"
                className="eninp-n"
                placeholder={placeholder}
                value={formState[key]}
                onChange={(e) => updateField(key, e.target.value)}
              />
            </div>
          ))}
        </div>

        {/* Box 2: Terms, Statement, Dwell Time */}
        <div className="bl-box2 pt-2 space-y-1">
          <div className="bill-row">
            <label>Terms:</label>
            <PillDropdown
              id="terms"
              width="w-full"
              value={formState.terms}
              options={termsOptions}
              onSelect={(val) => updateField("terms", val)}
            />
          </div>

          {[
            ["Statement:", "statement", "0"],
            ["Dwell Time:", "dwellTime", "0"],
          ].map(([label, key, placeholder]) => (
            <div className="bill-row" key={key}>
              <label>{label}</label>
              <input
                type="text"
                className="eninp-n"
                placeholder={placeholder}
                value={formState[key]}
                onChange={(e) => updateField(key, e.target.value)}
              />
            </div>
          ))}
            {/* Hazmat Checkbox */}
          <div className="checkbox-wrapper-33">
            <label className="checkbox cursor-pointer">
              <input
                type="checkbox"
                className="checkbox__trigger visuallyhidden"
                checked={formState.hazmat} 
                onChange={(e) => updateField("hazmat", e.target.checked)}
              />
              <span className="checkbox__symbol">
                <CheckIcon className="icon-checkbox" stroke="#ffffff" />
              </span>
              <p className="checkbox__textwrapper text-[12px]">Hazmat</p>
            </label>
          </div>
        </div>

        {/* Box 3: Holds and Status */}
        <div className="bl-box3 pt-2">
          <div className="bill-row items-center mb-2">
            <label className="min-w-[50px]">Op Hold:</label>
              <PillDropdown
                id="opHold"
                width="w-full"
                value={formState.opHold}
                options={opHoldOptions}
                onSelect={(val) => updateField("opHold", val)}
              />
          </div>
            <div className="bill-row items-center">
              <label className="ml-1 mr-1 font-medium text-[12px]">DL:</label>
              <PillDropdown
                id="dl"
                width="w-full"
                value={formState.dl}
                options={driverKeyOptions}
                onSelect={(val) => updateField("dl", val)}
              />
            </div>

          <div className="cs-row space-x-4 pt-1">
            {[
              { id: "printHold", label: "Print Hold" },
              { id: "audited", label: "Audited" },
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
                  <p className="checkbox__textwrapper text-[12px]">
                    {cb.label}
                  </p>
                </label>
              </div>
            ))}
          </div>

          <div className="checkbox-wrapper-33 pt-1">
            <label className="checkbox cursor-pointer">
              <input
                type="checkbox"
                className="checkbox__trigger visuallyhidden"
                checked={formState.closed}
                onChange={(e) => updateField("closed", e.target.checked)}
              />
              <span className="checkbox__symbol">
                <CheckIcon className="icon-checkbox" stroke="#ffffff" />
              </span>
              <p className="checkbox__textwrapper text-[12px] font-bold">
                Closed:
              </p>
            </label>
          </div>

          <div className="cs-row justify-between pt-1">
            <div className="checkbox-wrapper-33">
              <label className="checkbox cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox__trigger visuallyhidden"
                  checked={formState.post}
                  onChange={(e) => updateField("post", e.target.checked)}
                />
                <span className="checkbox__symbol">
                  <CheckIcon className="icon-checkbox" stroke="#ffffff" />
                </span>
                <p className="checkbox__textwrapper text-[12px] font-bold">
                  Post:
                </p>
              </label>
            </div>
            <span className="text-[12px] text-gray-600 mr-2">0</span>
          </div>

          <div className="cs-row justify-between pt-1 items-center">
            <div className="checkbox-wrapper-33">
              <label className="checkbox cursor-pointer">
                <input
                  type="checkbox"
                  className="checkbox__trigger visuallyhidden"
                  checked={formState.remoteEdit}
                  onChange={(e) => updateField("remoteEdit", e.target.checked)}
                />
                <span className="checkbox__symbol">
                  <CheckIcon className="icon-checkbox" stroke="#ffffff" />
                </span>
                <p className="checkbox__textwrapper text-[12px] font-bold">
                  Remote Edit:
                </p>
              </label>
            </div>
            <button
              type="button"
              className="btn-n"
              onClick={() => console.log("Reset clicked")}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Box 4: COD and Driver Collect */}
        <div className="bl-box4 space-y-1">
          {/* Driver Collect Row */}
          <div className="bill-col">
            <label className="min-w-[85px] text-[12px]">Driver Collect</label>
            <div className="cs-row space-x-1 w-full items-center">
              <div className="checkbox-wrapper-33">
                <label className="checkbox cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox__trigger visuallyhidden"
                    checked={formState.driverCollect}
                    onChange={(e) =>
                      updateField("driverCollect", e.target.checked)
                    }
                  />
                  <span className="checkbox__symbol">
                    <CheckIcon className="icon-checkbox" stroke="#ffffff" />
                  </span>
                </label>
              </div>
              
              <PillDropdown
                id="driverCollectVal"
                width="w-full"
                value={formState.driverCollectVal}
                options={driverCollectOptions} 
                onSelect={(val) => updateField("driverCollectVal", val)}
              />
            </div>
          </div>

          {/* COD Row */}
          <div className="bill-col">
            <label className="min-w-[85px] text-[12px]">COD</label>
            <div className="cs-row space-x-1 w-full items-center">
              <PillDropdown
                id="cod"
                width="w-[70px]"
                value={formState.cod}
                options={["CHK", "CASH"]}
                onSelect={(val) => updateField("cod", val)}
              />
              <div className="checkbox-wrapper-33">
                <label className="checkbox cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox__trigger visuallyhidden"
                    checked={formState.codCheck}
                    onChange={(e) => updateField("codCheck", e.target.checked)}
                  />
                  <span className="checkbox__symbol">
                    <CheckIcon className="icon-checkbox" stroke="#ffffff" />
                  </span>
                </label>
              </div>
              <input
                type="text"
                className="eninp-n text-right font-bold"
                value={`$${formState.codAmount}`}
                onChange={(e) =>
                  updateField("codAmount", e.target.value.replace("$", ""))
                }
              />
            </div>
          </div>

          {/* COD Fee Row */}
          <div className="bill-col">
            <label className="min-w-[85px] text-[12px]">COD Fee/Col</label>
            <div className="cs-row space-x-1 w-full items-center">
              <div className="checkbox-wrapper-33">
                <label className="checkbox cursor-pointer">
                  <input
                    type="checkbox"
                    className="checkbox__trigger visuallyhidden"
                    checked={formState.codFeeCol}
                    onChange={(e) => updateField("codFeeCol", e.target.checked)}
                  />
                  <span className="checkbox__symbol">
                    <CheckIcon className="icon-checkbox" stroke="#ffffff" />
                  </span>
                </label>
              </div>
              <input
                type="text"
                className="eninp-n text-right font-bold"
                value={`$${formState.codFeeAmount}`}
                onChange={(e) =>
                  updateField("codFeeAmount", e.target.value.replace("$", ""))
                }
              />
            </div>
          </div>

          {/* COD Pay To Row */}
          <div className="bill-col">
            <label className="min-w-[85px] text-[12px]">COD Pay To:</label>
            <input
              type="text"
              className="eninp-n w-full"
              value={formState.codPayTo}
              onChange={(e) => updateField("codPayTo", e.target.value)}
            />
          </div>
        </div>
        <div className="bl-box5">
          {/* Declared and insured AMT */}
          {[
            ["Declared Val", "deleveredVal", "0.00"],
            ["Insured Amt", "insuredAmt", "0.00"],
          ].map(([label, key, placeholder]) => (
            <div className="bill-row mt-2" key={key}>
              <label>{label}</label>
              <input
                type="text"
                className="eninp-n"
                placeholder={placeholder}
                value={formState[key]}
                onChange={(e) => updateField(key, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="cs-row">
          <button className="btn-n">Addendum</button>
          <span className="ml-2 text-gray-700">
  {invoiceData?.OrderNo}
</span>
        </div>
        <div className="cs-row space-x-2">
          <button className="btn-n w-full">Rate</button>
          <button className="btn-n w-full">Search</button>
         
        </div>
      </div>
    </section>
  );
};

export default Billing;
