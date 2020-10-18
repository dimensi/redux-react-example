import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {useTypedSelector} from '../../store';
import {changePage} from './issues.store';

export function useWatchPage() {
  const routerHistory = useHistory();
  const dispatch = useDispatch();
  const page = useTypedSelector((state) => state.issues.page);

  useEffect(() => {
    const parsedPage = new URLSearchParams(routerHistory.location.search).get(
      'page',
    );
    const routerPage = parsedPage ? Number(parsedPage) : 1;
    if (page !== routerPage) {
      dispatch(changePage(routerPage));
    }
  }, [page, routerHistory.location.search, dispatch]);
}
