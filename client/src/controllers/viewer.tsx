import PanelGroup from '../views/PanelGroup';

const Viewer = () => {
  return (
    <div
      style={{ padding: '10px', backgroundColor: 'midnightblue', height: '100vh', width: '100%' }}
    >
      <PanelGroup columns={2} rows={2} />
    </div>
  );
};

export default Viewer;
