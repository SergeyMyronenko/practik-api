// https://unsplash.com/documentation#search-photos

import axios from 'axios';
import { Spinner } from 'spin.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const formEl = document.querySelector('.js-search-form');
const listEl = document.querySelector('.js-gallery');
const target = document.querySelector('.js-backdrop');
let page = 1;
let query;

const opts = {
  lines: 14, // The number of lines to draw
  length: 41, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1, // Rounds per second
  rotate: 24, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#f01919', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 2000000000, // The z-index (defaults to 2e9)
  className: 'spinner', // The CSS class to assign to the spinner
  position: 'absolute', // Element positioning
};

const options = {
  root: null,
  rootMargin: '100px',
  threshold: 1.0,
};

const callback = function (entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      loadMoreData();
    }
  });
};

const observer = new IntersectionObserver(callback, options);
const spinner = new Spinner(opts);

formEl.addEventListener('submit', onSubmit);

async function onSubmit(event) {
  event.preventDefault();
  query = event.target.elements['user-search-query'].value.trim();
  spinnerPlay();
  if (!query) {
    spinnerStop();
    listEl.innerHTML = '';
    return iziToast.info({
      position: 'topRight',
      message: 'Error enter any symbols',
    });
  }

  try {
    const {
      data: { results, total, total_pages },
    } = await getPhotos(query, page);
    listEl.innerHTML = createMarkup(results);
    iziToast.success({
      position: 'topRight',
      message: `We found ${total} photos`,
    });
    hasMorePhotos(total_pages);
  } catch (error) {
    console.log('Error');
  } finally {
    spinnerStop();
  }
  event.target.reset();
}

function spinnerPlay() {
  spinner.spin(target);
  target.classList.remove('is-hidden');
}
function spinnerStop() {
  spinner.stop();
  target.classList.add('is-hidden');
}

function createMarkup(arr = []) {
  return arr
    .map(
      photo => `<li class='gallery__item'>
  <img src='${photo.urls.small}' alt='${photo.alt_description}' class='gallery-img' />
</li>`
    )
    .join('');
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

async function loadMoreData() {
  console.log('LOAD');
  page += 1;
  spinnerPlay();

  try {
    const {
      data: { results, total_pages },
    } = await getPhotos(query, page);
    listEl.insertAdjacentHTML('beforeend', createMarkup(results));
    hasMorePhotos(total_pages);
  } catch (error) {
    console.log(error);
  } finally {
    spinnerStop();
  }
}

function hasMorePhotos(totalPages) {
  if (page < totalPages) {
    const item = document.querySelector('.gallery__item:last-child');
    observer.observe(item);
  } else {
    iziToast.info({
      position: 'topRight',
      message: `We're sorry, but you've reached the end of search results.`,
    });
  }
}
