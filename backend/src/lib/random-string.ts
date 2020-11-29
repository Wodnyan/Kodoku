import { randomBytes } from "crypto";

const randomString = () => randomBytes(5).toString("hex");

export default randomString;
