export async function getHoldById(hid) {
  const url = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/hold.json`;
  const response = await fetch(url);
  const hold = await response.json();
  hold.id = hid;

  return hold;
}

export async function getKlubById(kid) {
  const kluburl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/klubber.json`;
  const klubresponse = await fetch(kluburl);
  const klub = await klubresponse.json();
  klub.id = kid;

  return klub;
}

export function formatDate(date) {
  const options = { month: "short", day: "numeric" };
  return new Date(date).toLocaleDateString("da-DK", options);
}

export function formatDateYear(dateYear) {
  const optionsYear = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateYear).toLocaleDateString("da-DK", optionsYear);
}

export function normalizeUsers(usersData = {}, clubsData = {}) {
  const usersArray = Object.keys(usersData || {}).map((key) => ({
    id: key,
    ...usersData[key],
    rating: Number(usersData[key]?.rating) || 0,
  }));

  // deterministic sort: rating desc, så navn som tie-breaker
  usersArray.sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    const nameA = `${a.fornavn ?? ""} ${a.efternavn ?? ""}`.trim();
    const nameB = `${b.fornavn ?? ""} ${b.efternavn ?? ""}`.trim();
    return nameA.localeCompare(nameB);
  });

  usersArray.forEach((user, index) => {
    user.placering = index + 1;
    user.clubName = clubsData?.[user.kid]?.navn ?? user.clubName;
  });

  return usersArray;
}
