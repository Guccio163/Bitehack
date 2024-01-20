import TOKEN from '../secret';
import { DOMMessage, DOMMessageResponse } from '../types';

let activeTabId:number;
let startTime:Date;
let domain:string;
// const sendInfo = (message: DOMMessage, callback: (response: DOMMessageResponse) => void): void => {
//     chrome.tabs && chrome.tabs.query({
//         active: true,
//         currentWindow: true
//     }, tabs => {
//         chrome.tabs.sendMessage(
//             tabs[0].id || 0,
//             message, callback)
//     });
// }

function getDomain(tabId:number) {
    // Get the current URL of the tab
    chrome.tabs.get(tabId, (tab) => {
        if (!chrome.runtime.lastError && tab) {
            const currentUrl = tab.url!;
            domain = new URL(currentUrl).hostname;
            console.log(`Domain: ${domain}`);
            // Save the domain or perform other actions with it
        }
    });
}

function sendTimeSpent(startTime:Date) {
    const endTime = new Date();
    console.log(`Start: `, startTime);
    console.log(`End: `, endTime);
    // Store or process timeSpent as needed
}

// chrome.tabs.onRemoved.addListener(() => {
//     console.log("Tab closed")
//     // sendInfo({ greeting: "tab-closed" }, (res) => {
//     //     console.log(res)
//     // })
// })

// chrome.tabs.onCreated.addListener(() => {
//     console.log("Tab created")
//     // sendInfo({ greeting: "tab-created" }, (res) => {
//     //     console.log(res)
//     // })
// })

chrome.tabs.onUpdated.addListener((tabId) => {
    console.log("Tab updated")
    const prevDomain = domain
    getDomain(tabId)
    if (prevDomain != domain) {
        sendTimeSpent(startTime)
        startTime = new Date()
    }
    // sendInfo({ greeting: "tab-updated" }, (res) => {
    //     console.log(res)
    // })

})

chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log("Tab activated")

    if (activeTabId !== undefined) {
        sendTimeSpent(startTime);
        getDomain(activeTabId)
    }

    activeTabId = activeInfo.tabId;
    startTime = new Date();

    // const prev = chrome.storage.local.get("data")
    // console.log(prev, new Date())
    // const data = {
    //     session: TOKEN,
    //     domain: window.location.hostname,
    //     start: new Date()
    // }
    // chrome.storage.local.set(data)


    // sendInfo({ greeting: "tab-activated" }, (res) => {
    //     console.log(res)
    // })
})
