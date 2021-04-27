import { Button } from "../components/Button/Button";

export default function Home() {
  return (
    <div>
      <Button>Welcome</Button>
      <Button full isLoading>
        Foobar
      </Button>
    </div>
  );
}
