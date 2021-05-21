import styles from "../../styles/auth/auth.module.css";
import Head from "next/head";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { Button } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";

import { Formik } from "formik";
import { useLogin } from "../../hooks/http/auth/useLogin";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";

const Register = () => {
  const router = useRouter();
  const { login, isLoading, errors } = useLogin();

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className={styles.container}>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={async (values) => {
            const success = await login(values);
            if (success) {
              router.push("/channels");
            }
          }}
        >
          {({ handleChange, values, handleSubmit }) => (
            <form noValidate onSubmit={handleSubmit} className={styles.form}>
              <h1 className={styles.callToAction}>Log In!</h1>
              <Input
                onChange={handleChange}
                value={values.email}
                full
                placeholder="Email"
                type="email"
                name="email"
              />
              {errors?.email && (
                <ErrorMessage error={errors.email.toLocaleLowerCase()} />
              )}
              <Input
                onChange={handleChange}
                value={values.password}
                full
                placeholder="Password"
                type="password"
                name="password"
              />
              {/* {errors?.password && <h1>{errors.password.toLowerCase()}</h1>} */}
              {errors?.password && (
                <ErrorMessage error={errors.password.toLocaleLowerCase()} />
              )}
              <div className={styles.bottom}>
                <NextLink href="/auth/register">
                  <a>Create a new account</a>
                </NextLink>
                <Button isLoading={isLoading} type="submit">
                  Login
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Register;
