const { options } = require('./options/mysql.js');
const knex = require('knex')(options);

knex.schema
  .createTable('productsTable', (table) => {
    table.increments('id'), table.string('title'), table.decimal('price'), table.string('thumbnail');
  })
  .then(() => {
    console.log('tabla creada');
  })
  .catch((err) => {
    console.log(err);
    throw new Error(err);
  })
  .finally(() => {
    knex.destroy();
  });

knex('productsTable')
  .insert([
    { title: 'banana', price: 20, thumbnail: 'https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_banana-256.png' },
    { title: 'anana', price: 100, thumbnail: 'https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_abacaxi-256.png' },
    { title: 'uvas', price: 90, thumbnail: 'https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_uvas-256.png' },
    { title: 'frutilla', price: 150, thumbnail: 'https://cdn3.iconfinder.com/data/icons/fruits-52/150/icon_fruit_morango-256.png' },
  ])
  .then(() => {
    console.log('pude insertar varias frutas');
  })
  .catch((e) => {
    console.log(e);
  })
  .finally(() => {
    knex.destroy();
  });
