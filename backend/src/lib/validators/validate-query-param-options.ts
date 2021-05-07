import * as yup from "yup";

export const defaultQueryParamOptions = yup.object().shape({
  limit: yup.number().integer().positive(),
  offset: yup.number().integer().positive(),
  orderBy: yup.string().lowercase().equals(["asc", "desc"]),
});
