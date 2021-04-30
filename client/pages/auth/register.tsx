import styles from "../../styles/auth/auth.module.css";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";

import { Formik } from "formik";
import { useRegister } from "../../hooks/http/auth/useRegister";

const Register = () => {
  const router = useRouter();
  const { register, isLoading, errors } = useRegister();

  return (
    <div className={styles.container}>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
        }}
        onSubmit={async (values) => {
          const success = await register(values);
          if (success) {
            router.push("/channels");
          }
        }}
      >
        {({ handleChange, values, handleSubmit }) => (
          <form noValidate onSubmit={handleSubmit} className={styles.form}>
            <h1 className={styles.callToAction}>Create an account</h1>
            <Input
              onChange={handleChange}
              value={values.username}
              full
              placeholder="Username"
              type="text"
              name="username"
            />
            {errors?.username && <h1>{errors.username.toLocaleLowerCase()}</h1>}
            <Input
              onChange={handleChange}
              value={values.email}
              full
              placeholder="Email"
              type="email"
              name="email"
            />
            {errors?.email && <h1>{errors.email.toLocaleLowerCase()}</h1>}
            <Input
              onChange={handleChange}
              value={values.password}
              full
              placeholder="Password"
              type="password"
              name="password"
            />
            {errors?.password && <h1>{errors.password.toLowerCase()}</h1>}
            <div className={styles.bottom}>
              <NextLink href="/auth/login">
                <a>Already have an account</a>
              </NextLink>
              <Button isLoading={isLoading} type="submit">
                Sign Up
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default Register;