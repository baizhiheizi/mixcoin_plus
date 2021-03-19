import { useMixin, useMixinBot } from 'apps/shared';
import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from 'react-router-dom';
import { Icon, NavBar } from 'zarm';
import LoaderComponent from './components/LoaderComponent/LoaderComponent';
const HomePage = React.lazy(() => import('./pages/HomePage/HomePage'));

export default function Routes() {
  return (
    <Router>
      <NavbarComponent />
      <Suspense fallback={<LoaderComponent />}>
        <Switch>
          <Route path='/' exact>
            <HomePage />
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
}

function NavbarComponent() {
  const history = useHistory();
  const mixinBot = useMixinBot();
  const { immersive } = useMixin();

  if (immersive) {
    return (
      <NavBar
        className='bg-white dark:bg-gray-900 dark:text-gray-50'
        title={mixinBot.name}
        left={<Icon type='arrow-left' onClick={() => history.goBack()} />}
      />
    );
  } else {
    return null;
  }
}
