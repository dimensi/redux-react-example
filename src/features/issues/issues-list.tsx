import React from 'react';
import {Link, useParams} from 'react-router-dom';
import {Issue} from '../../api';
import {RepoMeta} from '../repository.store';

export function IssuesList({issues}: {issues: Issue[]}) {
  return (
    <>
      {issues.map((issue) => (
        <IssueItem issue={issue} key={issue.id} />
      ))}
    </>
  );
}

function IssueItem({issue: {number, title, user, labels}}: {issue: Issue}) {
  const params = useParams<RepoMeta>();
  return (
    <article style={{marginBottom: 24}}>
      <header style={{display: 'flex', alignItems: 'center'}}>
        <Link to={`/${params.org}/${params.name}/issues/${number}`}>
          <strong>
            #{number}: {title}
          </strong>
        </Link>
        <figure>
          <img src={user.avatar_url} width={40} />
          <figcaption>by {user.login}</figcaption>
        </figure>
      </header>
      <div>
        {labels.map((label) => (
          <span key={label.id}>{label.name}</span>
        ))}
      </div>
    </article>
  );
}
