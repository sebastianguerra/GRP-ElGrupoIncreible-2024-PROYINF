import { useState } from 'react';
import PanelGroup from '../views/PanelGroup';

const Viewer = () => {
  const [columns, setColumns] = useState(2);
  const [rows, setRows] = useState(2);

  return (
    <div
      style={{ padding: '10px', backgroundColor: 'midnightblue', height: '100vh', width: '100%' }}
    >
      <input
        type="number"
        value={columns}
        onChange={(e) => {
          setColumns(parseInt(e.target.value, 10));
        }}
      />
      <input
        type="number"
        value={rows}
        onChange={(e) => {
          setRows(parseInt(e.target.value, 10));
        }}
      />
      <div style={{ height: '100vh', width: '100%' }}>
        <PanelGroup columns={columns} rows={rows} />
      </div>
    </div>
  );
};

export default Viewer;
