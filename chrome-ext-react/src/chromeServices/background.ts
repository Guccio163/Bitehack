import "regenerator-runtime/runtime.js";
import { APIData } from '../types';
import { sendData } from '../backendConnection'

let activeTabId: number;
let startTime: Date;
let domain: string;
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

async function prepareDataToSend(tabId: number, start: Date) {
    return chrome.tabs.get(tabId, async (tab) => {
        if (!chrome.runtime.lastError && tab) {
            const currentUrl = tab.url!;
            domain = new URL(currentUrl).hostname;
            const endTime = new Date();
            // console.log(`Start: `, startTime);
            // console.log(`End: `, endTime);
            const data: APIData = {
                site_url: domain,
                start_date: start,
                end_date: endTime
            }
            console.log("sendData: ", data)
            await sendData(data)
            // console.log(`Domain: ${domain}`);
            // Save the domain or perform other actions with it
        }
    });
}

async function sendTime(givenDomain: string) {
    // console.log("sendTime: ", domain)
    const endTime = new Date();
    // console.log(`Start: `, startTime);
    // console.log(`End: `, endTime);
    const data: APIData = {
        site_url: givenDomain,
        start_date: startTime,
        end_date: endTime
    }
    // console.log("sendData: ", data)
    await sendData(data)
    return
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

let isUpdateProcessing = false

chrome.tabs.onUpdated.addListener((tabId) => {
    // console.log("Tab updated")


    // HANDLE UNDEFINED!!!!
    const prevDomain = domain
    // console.log(isUpdateProcessing)
    if (!isUpdateProcessing) {
        isUpdateProcessing = true
        chrome.tabs.get(tabId, (tab) => {
            if (!chrome.runtime.lastError && tab) {
                const currentUrl = tab.url!;
                domain = new URL(currentUrl).hostname;
                // console.log(prevDomain, domain, prevDomain != domain)
                if (prevDomain != domain) {
                    sendTime(prevDomain).then(() => {
                        startTime = new Date()
                        isUpdateProcessing = false
                    })
                } else {
                    isUpdateProcessing = false
                }
                // Save the domain or perform other actions with it
            } else {
                isUpdateProcessing = false
            }
        });
    }
    // getDomain(tabId)
    // if (prevDomain != domain) {
    //     sendTime(prevDomain).then(() => startTime = new Date())
    // }
    // sendInfo({ greeting: "tab-updated" }, (res) => {
    //     console.log(res)
    // })

})

chrome.tabs.onActivated.addListener((activeInfo) => {
    // console.log("Tab activated")

    if (activeTabId !== undefined) {
        prepareDataToSend(activeTabId, startTime).then(() => {
            // console.log("Overwriting startTime")
            activeTabId = activeInfo.tabId;
            startTime = new Date();
        })
    } else {
        activeTabId = activeInfo.tabId;
        startTime = new Date();
    }
})


// get current tab data
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
        activeTabId = tabs[0].id!;
        console.log('Current Tab ID:', activeTabId);
    } else {
        console.error('Unable to retrieve current tab ID');
    }
});