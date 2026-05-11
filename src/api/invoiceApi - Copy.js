import axios from "axios";

export const getShipperDropdown = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/dropdown/shipper`
  );
  return res.data;
};

export const getHLDropdown = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/dropdown/hl`
  );
  return res.data;
};

export const getCountryDropdown = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/dropdown/country`
  );
  return res.data;
};

export const getSpecialInstructionDropdown = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/dropdown/specialinstructions`
  );
  return res.data;
};

export const searchInvoiceByOrderNo = async (orderNo) => {
  const res = await axios.get(
    `/api/invoice/search/invoice/${orderNo}`
  );
  return res.data;
};

export const getPagedInvoices = async (
  page = 1,
  limit = 100,
  filters = {},
  sortField = null,
  sortOrder = null
) => {

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/list/paged`,
    {
      params: {
        page,
        limit,
        filters: JSON.stringify(filters),
        sortField,
        sortOrder
      }
    }
  );

  return res.data;
};
export const getShipperZipDropdown = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/dropdown/szip`
  );
  return res.data;
};

export const getConsigneeZipDropdown = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/dropdown/czip`
  );
  return res.data;
};

export const getSZipDropdown = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/dropdown/szip`
  );
  return res.data;
};

export const getCustomerZipDropdown = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/dropdown/zip`
  );
  return res.data;
};

export const searchInvoiceByPro = async (proNo) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/byPro/${proNo}`
  );
  return res.data;
};
export const getTermsDropdown = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/dropdown/terms`
  );
  return res.data;
};

export const getOpHoldDropdown = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/dropdown/ophold`
  );
  return res.data;
};

export const getDriverCollectDropdown = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/dropdown/drivercollect`
  );
  return res.data;
};
export const getCallerDropdown = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/dropdown/caller`
  );
  return res.data;
};
export const getDriverKeyDropdown = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/dropdown/driverkey`
  );
  return res.data;
};
export const getCallLogDetails = async (orderNo, filters = null) => {

  let url = `${import.meta.env.VITE_API_URL}/api/invoice/calllog/${orderNo}`;

  if (filters && Object.keys(filters).length > 0) {
    url += `?filters=${encodeURIComponent(JSON.stringify(filters))}`;
  }

  const res = await axios.get(url);

  return res.data;
};
export const getWeightDetails = async (orderNo) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/lineitem/${orderNo}`
  );
  return res.data;
};
export const getFullInvoice = async (orderNo) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/full/${orderNo}`
  );
  return res.data;
};
export const getConsigneeDropdown = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/dropdown/consignee`
  );
  return res.data;
};
export const getCompanyDropdown = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/customers/dropdown/companyname`
  );
  return res.data;
};

export const getKeysetInvoices = async (lastId = 0, limit = 100) => {

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/invoice/list/keyset`,
    {
      params: { lastId, limit }
    }
  );

  return res.data;
};
