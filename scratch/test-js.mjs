const place = { name: undefined, id: '123' };
try {
  const url = `/restaurant/${place.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${place.id}`;
  console.log(url);
} catch (e) {
  console.log(e.message);
}

const place2 = { name: "Test / 123", id: '123' };
try {
  const url = `/restaurant/${place2.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${place2.id}`;
  console.log(url);
} catch (e) {
  console.log(e.message);
}
