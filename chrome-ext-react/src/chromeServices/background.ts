import "regenerator-runtime/runtime.js";
import { APIData, LimitationRecord } from '../types';
import { getLimitedDomains, sendData } from '../backendConnection'
import { DOMMessage } from "../types";

let activeTabId: number;
let startTime: Date;
let domain: string;
let limitedList: LimitationRecord[] = [];

async function sendTime(givenDomain: string) {
    // Function sends time stamps with given domain name to backend
    const endTime = new Date();
    const data: APIData = {
        site_url: givenDomain,
        start_date: startTime,
        end_date: endTime
    }
    await sendData(data)
    return
}

const verifyIfAllowed = async (givenDomain: string) => {
    // Verifies whether given domain should be restricted
    const data = await getLimitedDomains();
    limitedList = data;
    // Check if the domain matches the restriction requirements
    limitedList.forEach((el: LimitationRecord) => {
        if (el.name == givenDomain && el.data.daily_usage * 60 <= el.data.time) {
            // alert the user
            chrome.tabs && chrome.tabs.query({
                active: true,
                currentWindow: true
            }, tabs => {
                chrome.tabs.sendMessage(
                    tabs[0].id!,
                    { message: "alert" } as DOMMessage,
                    (res: DOMMessage) => {
                        // redirect user to google search page
                        chrome.tabs.update(activeTabId, { url: "https://www.google.com" });
                    });
            });
        }
    });
}

// Helpful boolean variable to prevent multiple invoking of onUpdated handler 
// (still manages to not work as intended)
let isUpdateProcessing = false

chrome.tabs.onUpdated.addListener((tabId) => {
    const prevDomain = domain
    if (!isUpdateProcessing) {
        isUpdateProcessing = true
        chrome.tabs.get(tabId, (tab) => {
            if (!chrome.runtime.lastError && tab) {
                const currentUrl = tab.url!;
                domain = new URL(currentUrl).hostname;
                // Check whether the domain name changed
                if (prevDomain != domain) {
                    // Verify if the user should be restricted
                    verifyIfAllowed(domain).then(() => {
                        // update the database with the timestamp
                        sendTime(prevDomain).then(() => {
                            startTime = new Date()
                            isUpdateProcessing = false
                        })
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
    if (activeTabId !== undefined) {
        // On new active tab save the timestamp
        chrome.tabs.get(activeTabId, (tab) => {
            if (!chrome.runtime.lastError && tab) {
                const currentUrl = tab.url!;
                domain = new URL(currentUrl).hostname;
                sendTime(domain).then(() => {
                    // Then check whether new domain should be restricted
                    activeTabId = activeInfo.tabId;
                    chrome.tabs.get(activeTabId, (tab) => {
                        if (!chrome.runtime.lastError && tab) {
                            const currentUrl = tab.url!;
                            domain = new URL(currentUrl).hostname;
                            verifyIfAllowed(domain).then(() => {
                                // Start the timestamp if the user is allowed
                                startTime = new Date();
                            })
                        }
                    });
                })
            }
        });
    } else {
        // Otherwise reset the timestamp
        activeTabId = activeInfo.tabId;
        startTime = new Date();
    }
})


chrome.webNavigation.onCompleted.addListener(function (details) {
    // Check if the new URL matches the restricted site
    domain = new URL(details.url).hostname
    verifyIfAllowed(domain)
});


// Fetch current data - loaded on extension initialization
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    startTime = new Date()
    if (tabs.length > 0) {
        activeTabId = tabs[0].id!;
        chrome.tabs.get(activeTabId, (tab) => {
            if (!chrome.runtime.lastError && tab) {
                const currentUrl = tab.url!;
                domain = new URL(currentUrl).hostname;
                // verifyIfAllowed(domain)
            } else {
                console.error("Problem with chrome.runtime")
            }
        });
    } else {
        console.error('Unable to retrieve current tab ID');
    }
});

