import imgTpl from '../templates/img-template.hbs';
import ApiService from '../js/apiService.js';
import debounce from 'lodash.debounce';
import * as basicLightbox from 'basiclightbox';
import '../../node_modules/basiclightbox/dist/basicLightbox.min.css';
import LoadMoreBtn from '../js/load-more-btn.js';

import { alert, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const apiService = new ApiService({});
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.searchForm.addEventListener('submit', renderMarkup);
refs.gallery.addEventListener('click', openModal);
loadMoreBtn.refs.button.addEventListener('click', changePage);

function renderMarkup(e) {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  loadMoreBtn.show();
  let inputValue = e.currentTarget.elements.query.value;
  if (!inputValue) return;

  apiService.query = inputValue;
  apiService.resetPage();

  apiService
    .fetchItems()
    .then(data => {
      loadMoreBtn.enable();
      makeMarkup(data);
      if (this.page > 1) {
        window.scrollTo({
          top: 1000,
          behavior: 'smooth',
        });
      }
    })
    .catch(err => {
      renderError(err);
      loadMoreBtn.hide();
    });
}

function makeMarkup(data) {
  if (data.hits.length) {
    refs.gallery.innerHTML = imgTpl(data.hits);
  } else {
    loadMoreBtn.hide();
    alert({
      text: 'Not found',
    });
  }
}

function renderError() {
  error({
    text: 'Something went wrong',
  });
}

function changePage() {
  loadMoreBtn.enable();
  apiService.incrementPage();
  apiService.fetchItems().then(makeMarkup).catch(renderError);
}

function openModal(e) {
  // console.log(e);
  if (e.target.nodeName === 'IMG') {
    console.log(e.target);
    const instance = basicLightbox.create(
      `
		<img width="1200" height="800" src="${e.target.dataset.action}">
	`,
    );

    instance.show();
  }
}
