// Type for messages sent between content.js and background.js
export type DOMMessage = {
    message:string;
}

// Type for limitation record sent to backend
export type APIData = {
    site_url:string;
    start_date:Date;
    end_date:Date;
}

export type LimitationRecord = {
    name:string;        // limited domain name
    data:LimitationData;
}

export type LimitationData = {
    count:number;       // how much user opened the website - for additional purposes in the future
    daily_usage:number; // daily usage limit in MINUTES
    time:number;        // current time on specific domain in SECONDS
}