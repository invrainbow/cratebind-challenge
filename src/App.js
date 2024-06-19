import { useState } from "react";
import "./App.css";

const fetchRepoLanguages = async (languagesUrl) => {
  const resp = await fetch(languagesUrl);
  const languages = await resp.json();

  return Object.keys(languages).sort();
};

function App() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repos, setRepos] = useState(null);

  const onSearch = (e) => {
    e.preventDefault();

    async function run() {
      setError(null);
      setLoading(true);
      setRepos(null);

      try {
        const resp = await fetch(
          `https://api.github.com/users/${username}/repos`
        );
        if (resp.status !== 200) {
          throw new Error("Unable to find Github account.");
        }

        const data = await resp.json();
        const repos = await Promise.all(
          data
            .filter((it) => !it.fork)
            .map(async (it) => ({
              name: it.name,
              languages: await fetchRepoLanguages(it.languages_url),
              description: it.description,
            }))
        );
        setRepos(repos);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    }
    run();
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
        <button type="submit" disabled={!username}>
          Get repos
        </button>
      </form>

      {loading && "Loading..."}

      {error && <div>Error: {error}</div>}

      {repos &&
        (repos.length === 0 ? (
          <div>This user has no public repos.</div>
        ) : (
          <table cellpadding="5" cellspacing="0" border="1">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Languages used</th>
            </tr>
            {repos.map((it) => (
              <tr>
                <td>{it.name}</td>
                <td>
                  {it.description ? it.description : <em>No description.</em>}
                </td>
                <td>{it.languages.join(", ")}</td>
              </tr>
            ))}
          </table>
        ))}

      {!repos && !loading && (
        <div>Search for a username above to get started!</div>
      )}
    </div>
  );
}

export default App;
