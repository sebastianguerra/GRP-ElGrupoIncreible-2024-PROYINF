import ContextsProvider from './models/contexts_provider';
import RouterBuilder from './controllers/routes_builder';

const App = () => {
  return (
    <ContextsProvider>
      <RouterBuilder />
    </ContextsProvider>
  );
};

export default App;
