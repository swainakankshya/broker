import axios from "axios";

export const getCustomerTags = async () => {
  const res = await axios.get(
    `/api/customers/tags`
  );
  return res.data;
};

export const getCustomerList = async () => {
  const res = await axios.get(
    `/api/customers/list`
  );
  return res.data;
};
export const getCompanyDropdown = async () => {
  const res = await axios.get(
    `/api/customers/dropdown/companyname`
  );
  return res.data;
};