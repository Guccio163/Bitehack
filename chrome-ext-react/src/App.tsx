import React from 'react';
import './App.css';
import { DOMMessage, DOMMessageResponse } from './types';

function App() {
  const [title, setTitle] = React.useState('');
  const [headlines, setHeadlines] = React.useState<string[]>([]);
  const [titles, setTitles] = React.useState<string[]>([]);



  React.useEffect(() => {
    /**
     * We can't use "chrome.runtime.sendMessage" for sending messages from React.
     * For sending messages from React we need to specify which tab to send it to.
     */
    chrome.tabs && chrome.tabs.query({
      active: true,
      currentWindow: true
    }, tabs => {
      /**
       * Sends a single message to the content script(s) in the specified tab,
       * with an optional callback to run when a response is sent back.
       *
       * The runtime.onMessage event is fired in each content script running
       * in the specified tab for the current extension.
       */
      chrome.tabs.sendMessage(
        tabs[0].id || 0,
        { greeting: "hi" } as DOMMessage,
        (response: DOMMessageResponse) => {
          if (!chrome.runtime.lastError) {
            if (response) {
              // setTitle(response.title);
              setTitles([response.domain])
              // setHeadlines(response.headlines);
              console.log("After", response)
            } else {
              console.log("No response given")
            }
          } else {
            console.log("Chrome runtime error detected!")
          }
        });
    });
  }, []);



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
