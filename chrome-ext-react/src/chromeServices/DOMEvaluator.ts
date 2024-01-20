import { DOMMessage, DOMMessageResponse } from '../types';

// tHIS NEEDS TO BE DELETED IN THE FUTURE!!!


// Function called when a new message is received
const messagesFromReactAppListener = (
    msg: DOMMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: DOMMessageResponse) => void) => {

    // console.log(msg, sender, sendResponse)

    // console.log(sender.tab ?
    //     "from a content script:" + sender.tab.url :
    //     "from the extension");
    // if (msg.greeting === "hi")
    //     sendResponse({ title: "bye", headlines: [], domain: "" });


    // console.log('[content.js]. Message received', msg);
    const domain = window.location.hostname
    var res: DOMMessageResponse = {
        // title: document.title,
        // headlines,
        domain: domain,
        time: new Date().toISOString(),
        code: -1, // to be set
    };
    console.log("PLEASE DO NOT USE ME IM NOT REQUIRED")
    switch (msg.greeting) {
        case "hi":
            console.log("Hi")
            // var headlines = Array.from(document.getElementsByTagName<"h1">("h1"))
            // .map(h1 => h1.innerText);

            // console.log(window.location)
            // headlines.push(domain)
            // Prepare the response object with information about the site
            res.code = 3
            break;
        case "tab-closed":
            console.log("Tab closed")
            res.code = 2
            break;
        case "tab-created":
            console.log("Tab created")
            res.code = 0
            break;
        case "tab-updated":
            console.log("Tab updated")
            res.code = 1
            break;
        case "tab-activated":
            console.log("Tab activated")
            res.code = 4
            break;
    }
    // chrome.storage.local.set({ domain: res }).then(() => {
    //     console.log("Storage updated", domain)
    // })
    console.log(res)
    
    sendResponse(res);
    // console.log("Generated:", msg, sender)


}

/**
* Fired when a message is sent from either an extension process or a content script.
*/
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);


// chrome.tabs.onRemoved.addListener(() => {
//     console.log("TAB CLOSED")
// })

// chrome.tabs.onCreated.addListener(() => {
//     console.log("Tab created")
// })
// chrome.tabs.onUpdated.addListener(() => {
//     console.log("Tab updated")
// })