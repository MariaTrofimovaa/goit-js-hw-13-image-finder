export default class ApiService {
  constructor({ page = 1 }) {
    this.requestUrl = 'https://pixabay.com/api/';
    this.key = '21692069-20428e2069b68a036394e4dd0';
    this.searchQuery = '';
    this.page = page;
  }

  fetchItems() {
    const url = `${this.requestUrl}?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${this.key}`;
    console.log(url);
    return fetch(url).then(res => {
      if (res.ok) {
        return res.json();
      }
      return Promise.reject('Something went wrong');
    });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  set query(input) {
    this.searchQuery = input;
  }
}
