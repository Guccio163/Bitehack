import "regenerator-runtime/runtime.js";
import { APIData, LimitationRecord } from '../types';
import { getLimitedDomains, sendData } from '../backendConnection'
import { DOMMessage } from "../types";

let activeTabId: number;
let startTime: Date;
let domain: string;
let limitedList: LimitationRecord[] = [];

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
}

const verifyIfAllowed = (givenDomain: string) => {
    // get restricted websites - Suboptimal, but it should work :)
    getLimitedDomains().then((data: LimitationRecord[]) => {
        limitedList = data
        // Check if the hostname is in the restricted domains list
        limitedList.forEach((el: LimitationRecord) => {
            // console.log(el.name, givenDomain, el.name == givenDomain, el.data.daily_usage, el.data.time)
            if (el.name == givenDomain && el.data.daily_usage <= el.data.time) {
            // if (el.name == givenDomain && el.data.daily_usage * 60 <= el.data.time) {
                // alert the user
                chrome.tabs && chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, tabs => {
                    chrome.tabs.sendMessage(
                        tabs[0].id || 0,
                        { message: "alert" } as DOMMessage,
                        (response: DOMMessage) => {
                            console.log(response)
                        });
                });
            }
        });
    })
}

// maybe developed later...

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
                    verifyIfAllowed(domain)
                    sendTime(prevDomain).then(() => {
                        startTime = new Date()
                        isUpdateProcessing = false
                    })
                } else {
                    isUpdateProcessing = false
                }
            } else {
                isUpdateProcessing = false
            }
        });
    }
})

chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log("Tab activated")

    if (activeTabId !== undefined) {
        chrome.tabs.get(activeTabId, (tab) => {
            if (!chrome.runtime.lastError && tab) {
                const currentUrl = tab.url!;
                domain = new URL(currentUrl).hostname;
                verifyIfAllowed(domain)
                sendTime(domain).then(() => {
                    activeTabId = activeInfo.tabId;
                    startTime = new Date();
                })
            }
        });
    } else {
        activeTabId = activeInfo.tabId;
        startTime = new Date();
    }
})


chrome.webNavigation.onCompleted.addListener(function (details) {
    // Check if the URL matches the restricted site
    domain = new URL(details.url).hostname
    verifyIfAllowed(domain)
});


// get current tab data
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    startTime = new Date()
    if (tabs.length > 0) {
        activeTabId = tabs[0].id!;
        chrome.tabs.get(activeTabId, (tab) => {
            if (!chrome.runtime.lastError && tab) {
                const currentUrl = tab.url!;
                domain = new URL(currentUrl).hostname;
                verifyIfAllowed(domain)
            } else {
                console.error("Problem with chrome.runtime")
            }
        });
        // console.log('Current Tab ID:', activeTabId);
    } else {
        console.error('Unable to retrieve current tab ID');
    }
});

