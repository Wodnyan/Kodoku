import * as yup from "yup";

const memberSchema = yup.object().shape({
  inviteCode: yup.string().required(),
  userId: yup.number().required(),
});
