import {createGate} from 'effector-react';
import {attach, createEffect, createStore, forward} from 'effector';
import {$repo, RepoMeta} from '../issues/issues.store';
import {Comment, ErrorMessage, getComments, getIssue, Issue} from '../../api';
import {AxiosError} from 'axios';
import {$error} from '../errors.store';

export interface IssueRouteParams {
  id: string;
}

type OnGetIssueParams = RepoMeta & IssueRouteParams;

export const issueGate = createGate<IssueRouteParams>('issue gate');

const onGetIssue = createEffect<OnGetIssueParams, Issue, ErrorMessage>({
  async handler ({org, repo, id}: OnGetIssueParams) {
    try {
      return getIssue(org, repo, Number(id));
    } catch (err) {
      throw (err as AxiosError<ErrorMessage>).response!.data;
    }
  }
});

const fxGetIssue = attach({
  effect: onGetIssue,
  mapParams: (params: IssueRouteParams, states) => ({...states, ...params}),
  source: $repo,
});

const fxGetIssueComments = createEffect(({comments_url}: Issue) => {
  return getComments(comments_url);
});

export const $issue = createStore<Issue | null>(null)
  .on(onGetIssue.doneData, (_, payload) => payload)
  .reset(issueGate.close);

export const $comments = createStore<Comment[]>([])
  .on(fxGetIssueComments.doneData, (state, payload) => payload)
  .reset(issueGate.close);

$error.on(onGetIssue.failData, (state, payload) => payload);

forward({
  from: issueGate.open,
  to: fxGetIssue,
});

forward({
  from: onGetIssue.doneData,
  to: fxGetIssueComments,
});
