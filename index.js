import express, { json, urlencoded } from 'express';
const app = express();
import cors from 'cors';
require('dotenv').config();
import { clerkMiddleware } from '@clerk/express';
import clerkweb from './utils/clerkwebhook'; 
import { connect } from 'mongoose';

const uri = process.env.MONGO_URL; 
const PORT = process.env.PORT || 5000;

main().then(() => {
  console.log('done');
}).catch((err) => {
  console.log(err);
});

async function main() {
  await connect(uri); 
}

app.use(cors());
app.use(json());
app.use(clerkMiddleware());
app.use(urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});

app.get('/', (req, res) => {
  res.send('working');
});

app.use('/webhooks', clerkweb); 
