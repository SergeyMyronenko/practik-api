// https://unsplash.com/documentation#search-photos

import axios from 'axios';

function getPhotos(query, page) {
  axios.defaults.baseURL = 'https://api.unsplash.com';
  axios.defaults.headers.common['Authorization'] =
    'Client-ID LxvKVGJqiSe6NcEVZOaLXC-f2JIIWZaq_o0WrF8mwJc';

  return axios.get('/search/photos', {
    params: {
      query,
      page,
      per_page: 12,
      orientation: 'portrait',
    },
  });
}
