import React, { useState } from "react";
import axios from 'axios'

import CloseIcon from '@mui/icons-material/Close';

interface Props{
    userId:string,
    state:boolean,
    onHideForm: () => void
}

export default function BlockSiteForm({userId, state, onHideForm} : Props) {

    const [urlInput, setUrlInput] = useState('');

    const handleInputChange = (event) => {
        setUrlInput(event.target.value);
    };

    const handleOnSubmit = async (event) => {
        event.preventDefault();
        if (urlInput != '') {
            try {
                const jsonData = {
                    "site_url": urlInput,
                    "daily_usage": 0
                };
    
                const response = await axios.post('/blocksite/', jsonData);
                onHideForm();
            } catch (error) {
                console.error('Error in blocked site post:', error);
            }
        }
    }

    return (
        <div className={`block-site-form ${state ? 'block-site-form-active' : ''}`}>
            <CloseIcon style={{position:"absolute", top: "1em", right:"1em", cursor:"pointer"}} onClick={onHideForm}/>
            <h2 style={{fontSize:"2em", fontWeight:"bold", padding:"0 0 2.2em 0", margin:"0"}}>Zablokuj stronę</h2>
            <form onSubmit={handleOnSubmit}>
                <div style={{width: "100%", display:"flex", alignItems:"center"}}>
                    <label style={{padding:"0 1.5em 0 0", fontSize:"1em"}}>Adres:</label>
                    <input type="text" name="url-input" value={urlInput} onChange={handleInputChange} placeholder="Adres strony"
                        style={{}}/>
                </div>
                <input type="submit" value="submit" style={{
                    margin: "30px 0 0 0",
                    fontSize:"1.2em",
                    padding:"0.3em 0.5em"
                }}/>
            </form>
        </div>
    )
}