import { Container } from "@/components/shared/Container";

export default function Loading() {
  return (
    <div className="animate-pulse py-24">
      <Container>
        <div className="mx-auto h-4 w-32 rounded bg-border" />
        <div className="mx-auto mt-4 h-10 w-2/3 max-w-lg rounded bg-border" />
        <div className="mx-auto mt-6 h-4 w-1/2 max-w-md rounded bg-border" />
      </Container>
    </div>
  );
}
