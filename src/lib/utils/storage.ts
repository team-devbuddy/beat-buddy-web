export const getLocalStorageItem = (key: string, defaultValue: string = ''): string => {
  if (typeof window === 'undefined') return defaultValue;
  return localStorage.getItem(key) || defaultValue;
};

export const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, value);
};

export const removeSearchTerm = (term: string, key: string = 'recentSearches'): void => {
  let recentSearches = JSON.parse(getLocalStorageItem(key, '[]'));
  recentSearches = recentSearches.filter((search: string) => search !== term);
  setLocalStorageItem(key, JSON.stringify(recentSearches));
};

export const addSearchTerm = (term: string, key: string = 'recentSearches', limit: number = 7): void => {
  if (!term.trim()) return;
  let recentSearches = JSON.parse(getLocalStorageItem(key, '[]'));
  recentSearches = [term, ...recentSearches.filter((search: string) => search !== term)];
  if (recentSearches.length > limit) {
    recentSearches = recentSearches.slice(0, limit);
  }
  setLocalStorageItem(key, JSON.stringify(recentSearches));
};
