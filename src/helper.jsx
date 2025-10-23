export default async function getHoldById(id, kid) {
  const url = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/hold.json`;
  const response = await fetch(url);
  const hold = await response.json();
  hold.id = id;

  const kampurl = `${import.meta.env.VITE_FIREBASE_DATABASE_URL}/kampe.json`;
  const kampResponse = await fetch(kampurl);
  const kamp = await kampResponse.json();
  kamp.id = kid;

  const hjemmeholdNavn = hold?.[kamp?.hjemmehold]?.navn ?? "Hjemme";
  const udeholdNavn = hold?.[kamp?.udehold]?.navn ?? "Ude";

  return hold, hjemmeholdNavn, udeholdNavn, kamp;
}
