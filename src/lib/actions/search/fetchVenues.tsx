export const fetchVenues = async (query: string, page: number, size: number) => {
    const keyword = encodeURIComponent(JSON.stringify([query]));
    const sort = encodeURIComponent(JSON.stringify(['string']));
  
    const response = await fetch(`http://beatbuddy.world/search?keyword=${keyword}&page=${page}&size=${size}&sort=${sort}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Access: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJtZW1iZXJJZCI6MSwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJ1c2VybmFtZSI6IktBS0FPXzM2MTEzNjY5NjMiLCJyb2xlIjoiVVNFUiIsImlhdCI6MTcyMDg4MjUzOCwiZXhwIjoxNzIwODg5NzM4fQ.s471P0zSm44yLSueHq8EqSkfVIc3IOC69HI37oGHM7o'
      },
    });
  
    return response.json();
  };
  