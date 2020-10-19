import { RepoMeta } from "./features/repository.store";

export const isMissmatchRepo = (state: RepoMeta, route: RepoMeta) =>
  state.name !== route.name && state.org !== route.org;