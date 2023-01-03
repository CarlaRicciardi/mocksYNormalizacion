const faker = require('faker');
faker.locale = 'es';

function generateFakeProducts(n) {
  let fakeProducts = [];
  for (let index = 0; index < n; index++) {
    const fakeProduct = {
      fakeTitle: faker.commerce.product(),
      fakePrice: faker.commerce.price(10, 10000),
      fakeThumbnail: faker.image.abstract(200, 200, true),
    };
    fakeProducts.push(fakeProduct);
    console.log(fakeProduct);
  }
  return fakeProducts;
}

module.exports = generateFakeProducts;
