export type DOMMessage = {
    greeting:string;
}

// Code 0 - tab start, Code 1 - tab update, code 2 - tab close, code 3 - hi / hello, code 4 - tab activated
export type DOMMessageResponse = {
    // title: string;
    // headlines: string[];
    domain:string;
    time:string;
    code:number;
}