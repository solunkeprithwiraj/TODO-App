import { Octokit } from "octokit";

export class GithubClientFactory {
  create(appToken: string) {
    return new Octokit({ auth: appToken });
  }
}
