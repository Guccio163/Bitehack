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
import AddIcon from "@mui/icons-material/Add";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";

export default function SettingsPage() {
  const navi = useNavigate();

  const [formState, setFormState] = useState(false);
  const { addictionList } = useContext(addictionsContext);

  const addBlockedSite = () => {
    if (!formState) setFormState(true);
  };

  const hideBlockSiteForms = () => {
    setFormState(false);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <BlockSiteForm
        userId="0"
        state={formState}
        onHideForm={hideBlockSiteForms}
      />
      <div
        style={{
          width: "100%",
          height: "10%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
          }}
        >
          <button onClick={() => navi(-1)}>
            <HomeRoundedIcon />
          </button>
        </div>
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
          }}
        >
          <button onClick={addBlockedSite}>
            <AddIcon style={{ fontSize: "25", fontWeight: "bold" }} />
          </button>
        </div>
      </div>
      <List
        sx={{
          width: "100vw",
          bgcolor: "background.paper",
          alignSelf: "center",
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            <h2>Blocked (evil) websites</h2>
          </ListSubheader>
        }
      >
        {addictionList
          ? addictionList.map((item) => <ListItem addction={item} />)
          : null}
      </List>
    </div>
  );
}
