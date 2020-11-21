import * as yup from "yup";

const schema = yup.object().shape({
  username: yup.string().min(2).max(30).required(),
  email: yup.string().email().max(254).required(),
  password: yup.string().min(8).max(100).required(),
});

interface Params {
  username: string;
  email: string;
  password: string;
}

const validateRequestBody = async (body: Params) => {
  return await schema.validate(body, { abortEarly: false });
};
export default validateRequestBody;
