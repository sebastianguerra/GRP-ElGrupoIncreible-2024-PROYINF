import { useExampleStore } from '@models/example_store';

const Home = () => {
  const store: ExampleStore = useExampleStore();
  return (
    <div>
      <h1>Hello, World! {store.number}</h1>
      <button onClick={store.addOne}>Add One</button>
    </div>
  );
};

export default Home;
