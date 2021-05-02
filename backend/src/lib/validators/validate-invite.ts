import * as yup from "yup";

export const inviteSchema = yup.object().shape({
  inviteCode: yup.string().max(10).required(),
});
