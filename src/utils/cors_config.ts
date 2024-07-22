export const corsConfig = {
  origin: true,
  allowedHeaders: [ 
    'Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 
    'Origin', 'X-Requested-With', 'Authorization'
  ],
  credentials: true
}