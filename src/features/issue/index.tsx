import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Link, useParams} from 'react-router-dom';
import {Comment} from '../../api';
import {Md} from '../../components/md';
import {useTypedSelector} from '../../store';
import {
  clearIssueState,
  getCommentsThunk,
  getIssueThunk,
  IssueRouteParams,
} from './issue.store';

export function Issue() {
  const {id}: IssueRouteParams = useParams();
  const dispatch = useDispatch();
  const {issue, comments} = useTypedSelector((state) => state.issue);
  const repoMeta = useTypedSelector((state) => state.repo);

  useEffect(() => {
    if (repoMeta.repo === '' && repoMeta.org === '') return;

    if (!issue || issue.number !== Number(id)) {
      dispatch(getIssueThunk(id));
    }
  }, [id, repoMeta, dispatch, issue]);

  useEffect(() => () => {
    dispatch(clearIssueState())
  }, [dispatch])

  useEffect(() => {
    if (issue?.comments_url) {
      dispatch(getCommentsThunk(issue.comments_url));
    }
  }, [issue, dispatch]);

  if (!issue) {
    return <div>loading</div>;
  }

  return (
    <main>
      <Link to="../">back to</Link>
      <header>
        <h1>{issue.title}</h1>
        <p>written by {issue.user.login}</p>
      </header>
      <hr />
      <Md md={issue.body} />
      <hr />
      <CommentsList comments={comments} />
    </main>
  );
}

export function CommentsList({comments}: {comments: Comment[]}) {
  if (!comments.length) return null;
  return (
    <div>
      <h2>comments:</h2>
      {comments.map((item) => (
        <div key={item.id}>
          <strong>{item.user.login}</strong>
          <time dateTime={item.created_at}>{item.created_at}</time>
          <Md md={item.body} />
        </div>
      ))}
    </div>
  );
}
