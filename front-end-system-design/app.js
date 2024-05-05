import express from 'express';
import path from 'path';

const app = express();

app.use(express.static('public'));

app.use((_, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self';" + "script-src 'self' 'nonce-someRandomKey'"
  );
  next();
});

app.use((_, res) =>
  res.sendFile(path.resolve(path.join(import.meta.dirname, 'index.html')))
);

app.listen(3001, () => console.log(`Server running on http://localhost:3001`));
