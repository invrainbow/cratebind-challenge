// fetch at most 10 pages of repos
const MAX_REPOS_PAGES = 10;

export const fetchRepoLanguages = async (languagesUrl) => {
  const resp = await fetch(languagesUrl);
  const data = await resp.json();
  return Object.keys(data).sort();
};

export const fetchAllUserRepos = async (username) => {
  const repos = [];

  // the API's sort param doesn't appear to support # stars, so we
  // have to iterate over pages of repos to grab all repos, then
  // manually sort by stars.

  for (let page = 1; page < MAX_REPOS_PAGES; page++) {
    const url = `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`;
    const resp = await fetch(url);

    if (resp.status !== 200) {
      throw new Error("Unable to find Github account.");
    }

    const data = await resp.json();
    if (data.length === 0) break;

    repos.push(...data);
  }

  return repos;
};
