import { DOMMessage } from '../types';

// Function called when a new message is received
const messagesFromReactAppListener = (
    msg: DOMMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: DOMMessage) => void) => {

    var res:DOMMessage = {
        message:""
    }
    switch (msg.message) {
        case "alert":
            alert("Your time has expired! Try to be a better version of yourself :)")
            res.message = "done"
            break;
        case "get-domain":
            res.message = window.location.hostname
            break;
    }
    sendResponse(res);
}

chrome.runtime.onMessage.addListener(messagesFromReactAppListener);