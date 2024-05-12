import RouterBuilder from './controllers/routes_builder';
import ContextsProvider from './models/contexts_provider';

const App = () => {
  return (
    <ContextsProvider>
      <RouterBuilder />
    </ContextsProvider>
  );
};

export default App;
