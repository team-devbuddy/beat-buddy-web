export const getRandomColor = (prevColor: string, colors: string[]): string => {
  let newColor = colors[Math.floor(Math.random() * colors.length)];
  while (newColor === prevColor) {
    newColor = colors[Math.floor(Math.random() * colors.length)];
  }
  return newColor;
};

export const generateColors = (genres: string[], colors: string[]): string[] => {
  let prevColor = '';
  return genres.map(() => {
    const newColor = getRandomColor(prevColor, colors);
    prevColor = newColor;
    return newColor;
  });
};

export const toggleGenre = (
  genre: string,
  selectedGenres: string[],
  setSelectedGenres: React.Dispatch<React.SetStateAction<string[]>>,
) => {
  setSelectedGenres((prevSelected) =>
    prevSelected.includes(genre) ? prevSelected.filter((g) => g !== genre) : [...prevSelected, genre],
  );
};

export const generateLink = (pathname: string, searchQuery: string): string => {
  const queryParams = new URLSearchParams();
  if (searchQuery) {
    queryParams.set('q', searchQuery);
  }
  return `${pathname}?${queryParams.toString()}`;
};
