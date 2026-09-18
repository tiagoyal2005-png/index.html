import { createFileRoute, redirect } from "@tanstack/react-router";

type SearchSearch = { q?: string | undefined };

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchSearch => ({
    q: typeof search["q"] === "string" && search["q"] ? search["q"] : undefined,
  }),
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/shop", search: { q: search.q } });
  },
});
