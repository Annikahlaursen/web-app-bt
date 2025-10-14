import { useState } from "react";
import RatingListe from "../components/RatingListe";

export default function RatingPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // const filteredPosts = posts.filter((post) => {
  //   const matchesSearch =
  //     post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     post.body.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesUser =
  //     selectedUserId === "" || post.userId.toString() === selectedUserId;

  //   return matchesSearch && matchesUser;
  // });

  function generateFirebaseId() {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "-S";
    for (let i = 0; i < 18; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  console.log(generateFirebaseId()); // Example: "-Mabc1234567890xyzABC"

  return (
    <section className="page">
      <h1>Rating</h1>
      <div>
        <input
          type="text"
          placeholder="Søg i rating"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: "10px" }}
        />
      </div>
      <RatingListe />
    </section>
  );
}
