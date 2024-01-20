import React, { useContext } from "react";
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

export default function SettingsPage() {
  const navi = useNavigate();
  
  const { addictionList } = useContext(addictionsContext);

  return (
    <div style={{width:"100vw",height:"100vh" ,backgroundColor:"white"}}>
      <Button onClick={() => navi(-1)}>DDUPA</Button>
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
