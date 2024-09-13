import ContextsProviders from './contexts/contexts_provider';
import RouterBuilder from './controllers/routes_builder';

const App = () => {
  return (
    <ContextsProviders>
      <RouterBuilder />
    </ContextsProviders>
  );
};

export default App;
