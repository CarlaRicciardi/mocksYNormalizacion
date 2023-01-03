const express = require('express');
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const generateFakeProducts = require('./utils/fakeProductGenerator');

const { engine } = require('express-handlebars');
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));

const ContenedorProd = require('./classContainer/contenedor');
const ContenedorMsgs = require('./classContainer/contenedorMsgs');

const containerProd = new ContenedorProd('productsTable');
const containerMsgs = new ContenedorMsgs('msgsTable2');

//handlebars settings
app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
  })
);

//FRONT END
app.get('/', async (req, res) => {
  const products = await containerProd.getAll();
  if (products) {
    res.render('main', { products });
  }
});

app.get('/api/productos-test', (req, res) => {
  const Fakeproducts = generateFakeProducts(5);
  res.render('fakeProducts', { Fakeproducts });
});

//BACK END

//WEBSOCKET PARA TABLA DE PRODUCTOS
//1) conexion server
io.on('connection', async (socket) => {
  console.log('usuario conectado');
  socket.emit('msgs', await containerMsgs.getAll());
  socket.emit('products', await containerProd.getAll());
  socket.emit('prod-test', generateFakeProducts() )

  //3) atrapamos el sendProd que hace el front cuando llena el form
  socket.on('newProd', async (data) => {
    await containerProd.save(data);
    const updateList = await containerProd.getAll();
    io.sockets.emit('products', updateList); //se la envio a todos los sockets
  });

  socket.on('newMsg', async (data) => {
    await containerMsgs.save(data);
    const msgsList = containerMsgs.getAll();
    io.sockets.emit('msgs', msgsList);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor http escuchando en el puerto http://localhost:${PORT}`);
});
