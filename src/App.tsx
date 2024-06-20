import React, { useState } from "react";
import { Repo, fetchPinnedReposWithLanguages } from "./api";
import "./App.css";

// show top 10 repos
const PINNED_REPOS_COUNT = 10;

function App() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repos, setRepos] = useState<Repo[] | null>(null);

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setLoading(true);
    setRepos(null);

    try {
      const newRepos = await fetchPinnedReposWithLanguages(
        username,
        PINNED_REPOS_COUNT
      );
      setRepos(newRepos);
    } catch (err: unknown) {
      setError((err as Error).toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <form onSubmit={onSearch} className="form">
        <input
          type="text"
          value={username}
          placeholder="Github username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit" disabled={!username || loading}>
          Get repos
        </button>
      </form>

      {loading && "Loading..."}

      {error && <div>{error}</div>}

      {repos &&
        (repos.length === 0 ? (
          <div>This user has no public repos.</div>
        ) : (
          <table cellPadding={5} cellSpacing={0} border={1}>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Stars</th>
              <th>Languages used</th>
            </tr>
            {repos.map((it) => (
              <tr>
                <td>
                  <a href={it.url} target="_blank" rel="noreferrer">
                    {it.name}
                  </a>
                </td>
                <td>{it.description || <em>No description.</em>}</td>
                <td>{it.stars}</td>
                <td>{it.languages.join(", ")}</td>
              </tr>
            ))}
          </table>
        ))}

      {!repos && !loading && !error && (
        <div>Search for a username above to get started!</div>
      )}
    </div>
  );
}

export default App;
