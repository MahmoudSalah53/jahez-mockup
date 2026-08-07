"use client";

import { SearchBox } from "@/components/SearchBox";

export function SearchForm({ initialQuery = "" }: { initialQuery?: string }) {
  return <SearchBox initialQuery={initialQuery} inputId="search-input" variant="page" />;
}
