export default function shortenString(str: string, amount: number) {
  const shortened = str.substr(0, amount);
  return `${shortened}...`;
}
