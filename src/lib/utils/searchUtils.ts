
export const generateLink = (pathname: string, searchQuery: string, selectedGenres: string[] = []): string => {
  const queryParams = new URLSearchParams();
  if (searchQuery) {
    queryParams.set('q', searchQuery);
  }
  if (selectedGenres && selectedGenres.length > 0) {
    queryParams.set('genres', selectedGenres.join(','));
  }
  return `${pathname}?${queryParams.toString()}`;
};
