import React, { useContext, useState } from "react";
import List from "@mui/material/List";
import {
  Button,
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import { addictionsContext } from "../contexts/AddictionsContext";
import ListItem from "../components/ListItem";
import BlockSiteForm from "../components/BlockSiteForm";
import AddIcon from '@mui/icons-material/Add';

export default function SettingsPage() {
  const navi = useNavigate();
  
  const [formState, setFormState] = useState(false);
  const { addictionList } = useContext(addictionsContext);

  const addBlockedSite = () => {
    if (!formState)
      setFormState(true);
  }

  const hideBlockSiteForms = () => {
    setFormState(false);
  }

  return (
    <div style={{width:"100vw",height:"100vh"}}>
      <BlockSiteForm userId="0" state={formState} onHideForm={hideBlockSiteForms}/>
      <div style={{width:"100%", height:"10%", display:"flex", alignItems:"center"}}>
        <div style={{width: "40px", height: "40px", padding:"0 0 0 20px"}}>
          <button onClick={addBlockedSite} style={{padding:"0.3em 0.3em 0.1em 0.3em"}}>
            <AddIcon style={{fontSize:"28", fontWeight:"bold"}}/>
          </button>
        </div>
        <div style={{width: "10%", padding: "0 0 0 42%"}}>
          <button onClick={() => navi(-1)}>DDUPA</button>
        </div>
      </div>
      <List
        sx={{ width: "100vw", bgcolor: "background.paper", alignSelf:"center" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Nested List Items
          </ListSubheader>
        }
      >
        {addictionList
          ? addictionList.map((item) => (
              <ListItem addction={item}/>
            ))
          : null}
      </List>
    </div>
  );
}
