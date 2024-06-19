import { useState } from "react";
import { fetchPinnedReposWithLanguages } from "./api";
import "./App.css";

// show top 10 repos
const PINNED_REPOS_COUNT = 10;

function App() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repos, setRepos] = useState(null);

  const onSearch = async (e) => {
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
    } catch (err) {
      setError(err.toString());
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
          <table cellpadding="5" cellspacing="0" border="1">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Stars</th>
              <th>Languages used</th>
            </tr>
            {repos.map((it) => (
              <tr>
                <td>
                  <a href={it.url} target="_blank">
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
