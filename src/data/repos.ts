import repoJson from "./repos.json";
import linkJson from "./linkstatus.json";
import { LinkStatusSchema, RepoSchema, type LinkStatus, type Repo } from "./types";

// Both files are rewritten by `npm run refresh` (see .github/workflows/refresh.yml).
export const repos: Repo[] = RepoSchema.array().parse(repoJson);
export const linkStatus: LinkStatus = LinkStatusSchema.parse(linkJson);
