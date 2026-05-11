import axios from "axios";

export const getProByNumber = async (proNo) => {
  const res = await axios.get(
    `/api/pro/${proNo}`
  );
  return res.data;
};

export const getTempDropdown = async () => {
  const res = await axios.get(
    `/api/pro/dropdown/temp`
  );
  return res.data;
};
