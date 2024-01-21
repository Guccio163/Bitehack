import React from 'react';
import './App.css';
import { LimitationRecord } from './types';
import { getLimitedDomains } from './backendConnection';

function App() {
  const [limitationRecords, setLimitationRecords] = React.useState<LimitationRecord[]>([]);

  React.useEffect(() => {
    getLimitedDomains().then((data:LimitationRecord[]) => {
      setLimitationRecords(data)
    })
  }, []);

  return (
    <div className="App">
      <h1>Restricted sites:</h1>
      <ul>
        {limitationRecords.map((record:LimitationRecord, index) => (<li key={index}>{record.name}</li>))}
      </ul>
    </div>
  );
}

export default App;
