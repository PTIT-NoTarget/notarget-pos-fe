import axios from "axios";

export const getAutoComplete = (
  tableName: string,
  keyName: string,
  value: string
) => {
  return axios.get(
    `${process.env.REACT_APP_API_URL}/api/v1/custom/auto-complete`,
    {
      params: {
        table_name: tableName,
        key_name: keyName,
        value: value,
      },
    }
  );
};
