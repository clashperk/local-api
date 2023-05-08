import express from 'express';
import proxy from 'express-http-proxy';
import cors from 'cors';
import url from 'node:url';
import { config } from 'dotenv';
import morgan from 'morgan';
config();

const app = express();

const keys = process.env.KEYS?.split(',') ?? [];
let keyIndex = 0;

const getKey = () => {
  const key = keys[keyIndex];
  keyIndex = keyIndex + 1 >= keys.length ? 0 : keyIndex + 1;
  return key;
}

app.use(cors());
app.use(morgan('dev'));

app.use(proxy('https://api.clashofclans.com', {
  filter(req, res) {
    return req.method == 'GET';
  },
  proxyReqPathResolver(req) {
    return url.parse(req.url).path!;
  },
  proxyReqOptDecorator(proxyReqOpts) {
    proxyReqOpts.headers!['Authorization'] = `Bearer ${getKey()}`;
    return proxyReqOpts;
  },
}));

app.listen(process.env.PORT, () => {
  console.log(`API Proxy Listening on http://localhost:${process.env.PORT}`);
});