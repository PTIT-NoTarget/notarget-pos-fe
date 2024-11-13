import api from "@/services/interceptors/interceptors";

export const CustomService = {
  getAutoComplete(tableName: string, keyName: string, value: string) {
    return api.get("custom/auto-complete", {
      params: {
        table_name: tableName,
        key_name: keyName,
        value: value,
      },
    });
  },
};
