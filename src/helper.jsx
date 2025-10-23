export async function getHoldById(id) {
  const url = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/hold.json`;
  const response = await fetch(url);
  const hold = await response.json();
  hold.id = id;

  return hold;
}

export async function getKlubById(kid) {
  const kluburl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/klubber.json`;
  const klubresponse = await fetch(kluburl);
  const klub = await klubresponse.json();
  klub.id = kid;

  return klub;
}
