import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import debounce from 'lodash.debounce';

export const useDebouncedSearch = ({ url, limit }: { url: string, limit: any }) => {

  const { push, query } = useRouter()

  const [searchTerm, setSearchTerm] = useState(query.search)

  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      if (searchTerm.trim().length === 0) {
        push(`/admin/${url}?page=1&limit=20`);
      } else {
        push(`/admin/${url}?search=${searchTerm}`);
      }
    }, 500),
    [limit]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    debouncedSearch(searchTerm);
  }

  return { searchTerm, setSearchTerm, handleSearch };
}