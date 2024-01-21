import React from 'react';
import './App.css';
// import { DOMMessage, DOMMessageResponse } from './types';

function App() {
  const [title, setTitle] = React.useState('');
  const [headlines, setHeadlines] = React.useState<string[]>([]);
  const [titles, setTitles] = React.useState<string[]>([]);



  // React.useEffect(() => {
  //   chrome.tabs && chrome.tabs.query({
  //     active: true,
  //     currentWindow: true
  //   }, tabs => {

  //     chrome.tabs.sendMessage(
  //       tabs[0].id || 0,
  //       { greeting: "hi" } as DOMMessage,
  //       (response: DOMMessageResponse) => {
  //         if (!chrome.runtime.lastError) {
  //           if (response) {
  //             // setTitle(response.title);
  //             setTitles([response.domain])
  //             // setHeadlines(response.headlines);
  //             console.log("After", response)
  //           } else {
  //             console.log("No response given")
  //           }
  //         } else {
  //           console.log("Chrome runtime error detected!")
  //         }
  //       });
  //   });
  // }, []);



  return (
    <div className="App">
      <h1>Sites you've visited:</h1>
      {title}
      <ul>
        {titles.map((title, index) => (<li key={index}>{title}</li>))}
      </ul>
    </div>
  );
}

export default App;
