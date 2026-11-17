import dotenv from 'dotenv';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import { serverConfig } from './src/server/config.ts';
import { store } from './src/server/store.ts';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  const getCartSessionId = (req: express.Request): string => {
    const headerId = req.header('x-cart-session');
    if (headerId && headerId.trim().length >= 8) {
      return headerId.trim();
    }
    return 'guest-default-session';
  };

  const getAuthToken = (req: express.Request): string | undefined => {
    const auth = req.header('authorization');
    if (auth && auth.startsWith('Bearer ')) {
      return auth.slice(7).trim();
    }
    return undefined;
  };

  // Health
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'Electro Tecno API' });
  });

  // Catalog
  app.get('/api/products', (req, res) => {
    try {
      const category = typeof req.query.category === 'string' ? req.query.category : undefined;
      const condition = typeof req.query.condition === 'string' ? req.query.condition : undefined;
      const sale = req.query.sale === 'true';
      const q = typeof req.query.q === 'string' ? req.query.q : undefined;
      const products = store.listProducts({ category, condition, sale, q });
      res.json({ products });
    } catch {
      res.status(500).json({ error: 'No se pudo obtener el catálogo de productos.' });
    }
  });

  app.get('/api/products/:id', (req, res) => {
    const product = store.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    return res.json({ product });
  });

  // Auth
  app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body ?? {};
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Ingresá tu nombre completo.' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'Ingresá un correo electrónico válido.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    try {
      const result = store.registerUser(name, email, password);
      return res.status(201).json(result);
    } catch (err) {
      if (err instanceof Error && err.message === 'EMAIL_EXISTS') {
        return res.status(409).json({ error: 'Ya existe una cuenta registrada con ese correo.' });
      }
      return res.status(500).json({ error: 'No se pudo completar el registro.' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Completá correo electrónico y contraseña.' });
    }

    try {
      const result = store.loginUser(String(email), String(password));
      return res.json(result);
    } catch (err) {
      if (err instanceof Error && err.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
      }
      return res.status(500).json({ error: 'Error al iniciar sesión.' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    const token = getAuthToken(req);
    if (token) {
      store.logoutSession(token);
    }
    res.json({ ok: true });
  });

  app.get('/api/auth/me', (req, res) => {
    const user = store.getUserByToken(getAuthToken(req));
    if (!user) {
      return res.status(401).json({ error: 'Sesión no válida o expirada.' });
    }
    return res.json({ user });
  });

  // Cart
  app.get('/api/cart', (req, res) => {
    const sessionId = getCartSessionId(req);
    res.json(store.getCart(sessionId));
  });

  app.post('/api/cart', (req, res) => {
    const sessionId = getCartSessionId(req);
    const { productId, quantity } = req.body ?? {};
    if (!productId || typeof productId !== 'string') {
      return res.status(400).json({ error: 'Producto inválido.' });
    }

    try {
      const cart = store.addToCart(sessionId, productId, Number(quantity || 1));
      return res.status(201).json(cart);
    } catch (err) {
      if (err instanceof Error && err.message === 'PRODUCT_NOT_FOUND') {
        return res.status(404).json({ error: 'Producto no encontrado.' });
      }
      if (err instanceof Error && err.message === 'OUT_OF_STOCK') {
        return res.status(409).json({ error: 'Sin stock disponible en este momento.' });
      }
      return res.status(500).json({ error: 'No se pudo actualizar el carrito.' });
    }
  });

  app.patch('/api/cart/:productId', (req, res) => {
    const sessionId = getCartSessionId(req);
    const { quantity } = req.body ?? {};
    if (typeof quantity !== 'number' || Number.isNaN(quantity)) {
      return res.status(400).json({ error: 'Cantidad inválida.' });
    }

    try {
      const cart = store.updateCartQuantity(sessionId, req.params.productId, quantity);
      return res.json(cart);
    } catch {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito.' });
    }
  });

  app.delete('/api/cart/:productId', (req, res) => {
    const sessionId = getCartSessionId(req);
    const cart = store.removeFromCart(sessionId, req.params.productId);
    res.json(cart);
  });

  // Orders
  app.get('/api/orders', (req, res) => {
    const user = store.getUserByToken(getAuthToken(req));
    if (!user) {
      return res.status(401).json({ error: 'Iniciá sesión para ver tus pedidos.' });
    }
    return res.json({ orders: store.listOrdersForUser(user.id) });
  });

  app.post('/api/orders', (req, res) => {
    const sessionId = getCartSessionId(req);
    const user = store.getUserByToken(getAuthToken(req));
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      city,
      postalCode,
      paymentMethod,
    } = req.body ?? {};

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !shippingAddress ||
      !city ||
      !postalCode
    ) {
      return res.status(400).json({ error: 'Completá todos los datos de envío para confirmar.' });
    }

    try {
      const order = store.createOrder(sessionId, {
        userId: user?.id,
        customerName: String(customerName),
        customerEmail: String(customerEmail),
        customerPhone: String(customerPhone),
        shippingAddress: String(shippingAddress),
        city: String(city),
        postalCode: String(postalCode),
        paymentMethod: paymentMethod || 'Transferencia',
      });
      return res.status(201).json({ order, cart: store.getCart(sessionId) });
    } catch (err) {
      if (err instanceof Error && err.message === 'EMPTY_CART') {
        return res.status(400).json({ error: 'El carrito está vacío.' });
      }
      return res.status(500).json({ error: 'No se pudo procesar el pedido.' });
    }
  });

  // Servicio Técnico
  app.post('/api/repairs', (req, res) => {
    const { customerName, customerEmail, customerPhone, deviceModel, issueType, description } =
      req.body ?? {};

    if (!customerName || !customerEmail || !customerPhone || !deviceModel || !issueType) {
      return res
        .status(400)
        .json({ error: 'Completá tus datos y el modelo del equipo para generar el turno.' });
    }

    const repair = store.createRepairRequest({
      customerName: String(customerName),
      customerEmail: String(customerEmail),
      customerPhone: String(customerPhone),
      deviceModel: String(deviceModel),
      issueType: String(issueType),
      description: String(description || ''),
    });

    return res.status(201).json({ repair });
  });

  // Contacto
  app.post('/api/contact', (req, res) => {
    const { name, email, phone, subject, message } = req.body ?? {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Completá nombre, correo electrónico y mensaje.' });
    }

    const contact = store.createContactMessage({
      name: String(name),
      email: String(email),
      phone: phone ? String(phone) : undefined,
      subject: String(subject || 'Consulta general'),
      message: String(message),
    });

    return res.status(201).json({ contact });
  });

  // Vite dev middleware or production static build
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build not found');
      }
    });
  }

  app.listen(serverConfig.port, '0.0.0.0', () => {
    console.log(`Electro Tecno server listening on http://0.0.0.0:${serverConfig.port}`);
  });
}

startServer();
