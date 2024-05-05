class SearchEngine {
  #_products = new Map();

  addProducts(key, ...products) {
    const hasData = this.#_products.has(key);

    if (!hasData) {
      this.#_products.set(key, products);
      return;
    }

    const data = this.#_products.get(key);
    this.#_products.set(key, data?.concat(products) || []);
  }

  get products() {
    const p = [];
    this.#_products.forEach((v) => p.concat(v || []));
    return p;
  }

  search(key, filterFn, sortFilter = undefined) {
    const exists = this.#_products.has(key);
    if (!exists) return [];

    const data = this.#_products.get(key) || [];
    let filteredData = data.filter((p) => filterFn(p));
    if (!sortFilter) return filteredData;

    // filteredData = filteredData.sort((a, b) => {
    //   if (sortFilter.value === 'asc')
    //     return a[sortFilter.key] - b[sortFilter.key];
    //   else return a[sortFilter.key] - b[sortFilter.key];
    // });

    return [];
  }
}

const products = new SearchEngine();

products.addProducts(
  'glasses',
  { name: 'Glass 1', rating: 4.5, year: 2020 },
  { name: 'Glass 2', rating: 3.5, year: 2022 },
  { name: 'Glass 3', rating: 2.5, year: 2017 }
);

console.log(products.products);
console.log(products.search('glasses', (p) => p.rating > 3));
