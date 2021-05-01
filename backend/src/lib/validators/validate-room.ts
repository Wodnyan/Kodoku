import * as yup from "yup";

export const createRoomSchema = yup.object().shape({
  name: yup.string().max(100).required(),
});
