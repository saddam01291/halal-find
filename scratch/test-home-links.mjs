import * as https from 'http';

https.get('http://localhost:3000/', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const links = data.match(/\/restaurant\/[^"']+/g);
    console.log(links ? links.slice(0, 5) : 'No links found');
  });
});
