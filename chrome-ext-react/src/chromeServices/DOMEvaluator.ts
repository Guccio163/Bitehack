import { DOMMessage } from '../types';

// Function called when a new message is received
const messagesFromReactAppListener = (
    msg: DOMMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: DOMMessage) => void) => {


    switch (msg.message) {
        case "alert":
            alert("Your time has expired! Try to be a better version of yourself :)")
    }
    const res:DOMMessage = {
        message: "done"
    }
    sendResponse(res);
}

/**
* Fired when a message is sent from either an extension process or a content script.
*/
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);