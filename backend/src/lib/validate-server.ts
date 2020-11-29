import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().min(2).max(100).required(),
  ownerId: yup.number().positive().integer().required(),
  icon: yup.string().url().max(2083),
});

interface Params {
  name: string;
  ownerId: number;
  icon?: string;
}

const validateServer = async (body: Params) => {
  return await schema.validate(body, { abortEarly: false });
};
export default validateServer;
