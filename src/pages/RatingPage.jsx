import { useState } from "react";
import RatingListe from "../components/RatingListe";

export default function RatingPage() {
    const [searchTerm, setSearchTerm] = useState("");
  return (
    <section className="page">
      <h1>Rating Page</h1>

      <input
        type="text"
        placeholder="🔍 Søg i posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ flex: 1, padding: "10px" }}
      />
      <RatingListe />
    </section>
  );
}
