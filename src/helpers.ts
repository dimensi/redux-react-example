import { RepoMeta } from "./features/repo.store";

export const isMissmatchRepo = (state: RepoMeta, route: RepoMeta) =>
  state.repo !== route.repo && state.org !== route.org;