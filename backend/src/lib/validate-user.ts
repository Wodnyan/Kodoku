import * as yup from "yup";

const registerSchema = yup.object().shape({
  username: yup.string().min(2).max(30).required(),
  email: yup.string().email().max(254).required(),
  password: yup.string().min(8).max(100).required(),
});

const loginSchema = yup.object().shape({
  email: yup.string().email().max(254).required(),
  password: yup.string().min(8).max(100).required(),
});

interface Register {
  username: string;
  email: string;
  password: string;
}

interface Login {
  email: string;
  password: string;
}

export const validateLogin = async (body: Login) => {
  return await loginSchema.validate(body, { abortEarly: false });
};

export const validateRegister = async (body: Register) => {
  return await registerSchema.validate(body, { abortEarly: false });
};
