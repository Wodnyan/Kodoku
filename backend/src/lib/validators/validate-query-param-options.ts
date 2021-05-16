import * as yup from "yup";

export const defaultQueryParamOptions = yup.object().shape({
  limit: yup.number().integer().nullable().notRequired(),
  offset: yup.number().integer().nullable().notRequired(),
  orderBy: yup.string().lowercase().equals(["asc", "desc"]).notRequired(),
});
