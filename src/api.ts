// fetch at most 10 pages of repos
const MAX_REPOS_PAGES = 10;

interface GithubApiRepo {
  name: string;
  html_url: string;
  languages_url: string;
  description: string;
  stargazers_count: number;
  fork: boolean;
}

export const fetchAllUserRepos = async (username: string) => {
  const repos: GithubApiRepo[] = [];

  // the API's sort param doesn't appear to support # stars, so we
  // have to iterate over pages of repos to grab all repos, then
  // manually sort by stars.

  for (let page = 1; page <= MAX_REPOS_PAGES; page++) {
    const url = `https://api.github.com/users/${username}/repos?per_page=100&page=${page}`;
    const resp = await fetch(url);

    if (resp.status !== 200) {
      throw new Error("Unable to find Github account.");
    }

    const data = (await resp.json()) as GithubApiRepo[];
    if (data.length === 0) break;

    repos.push(...data);
  }

  return repos;
};

export const fetchRepoLanguages = async (languagesUrl: string) => {
  const resp = await fetch(languagesUrl);
  const data = (await resp.json()) as Record<string, number>;
  return Object.keys(data).sort();
};

export interface Repo {
  name: string;
  url: string;
  languages: string[];
  description: string;
  stars: number;
}

export const fetchPinnedReposWithLanguages = async (
  username: string,
  limit: number
): Promise<Repo[]> => {
  const rawRepos = (await fetchAllUserRepos(username))
    .filter((it) => !it.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, limit);

  return await Promise.all(
    rawRepos.map(async (it) => ({
      name: it.name,
      url: it.html_url,
      languages: await fetchRepoLanguages(it.languages_url),
      description: it.description,
      stars: it.stargazers_count,
    }))
  );
};
