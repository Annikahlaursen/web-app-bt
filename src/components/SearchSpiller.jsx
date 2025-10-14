import { useState } from "react";
import RatingBoks from "./RatingBoks";

export default function SearchSpiller() {
  const [searchQuery, setSearchQuery] = useState(""); // set the initial state to an empty string

  // Filter posts based on the search query
  const filteredPosts = posts.filter((post) =>
    post.caption.toLowerCase().includes(searchQuery)
  );
  return (
    <>
      <label>
        Search by caption{" "}
        <input
          aria-label="Search by caption"
          defaultValue={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value.toLowerCase())}
          placeholder="Søg spiller"
          type="search"
          name="searchQuery"
        />
      </label>
      <div className="grid">
        {filteredPosts.map((post) => (
          <RatingBoks key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
