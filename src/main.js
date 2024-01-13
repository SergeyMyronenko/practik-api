// https://unsplash.com/documentation#search-photos

import axios from 'axios';

const formEl = document.querySelector(".js-search-form");
const listEl = document.querySelector(".js-gallery");
const page = 1;

formEl.addEventListener("submit", onSubmit)

async function onSubmit(event) {
  event.preventDefault();
  const query = event.target.elements["user-search-query"].value.trim();

  if (!query) {
    return alert("Error enter any symbols")
  }


  try {
    const {data: {results, total}} = await getPhotos(query, page)
    listEl.innerHTML = createMarkup(results);
    alert(`We found ${total} photos`)
 
  } catch (error) {
    console.log("Error");
  }
  


}

function createMarkup(arr=[]) {
  return arr.map(photo => `<li class='gallery__item'>
  <img src='${photo.urls.small}' alt='${photo.alt_description}' class='gallery-img' />
</li>`).join("")
}

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

