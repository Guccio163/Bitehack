import {
  Button,
  Collapse,
  Hidden,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { Addiction } from "../contexts/AddictionsContext";
import InstagramIcon from "@mui/icons-material/Instagram";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

interface Props {
  addiction: Addiction;
}

function getName(url: string) {
  return url;
}

export default function ListItem({ addiction }: Props) {
  const [open, setOpen] = React.useState(true);
  const [newDaily, setNewDaily] = useState(0);
  const [changesDone, setChangesDone] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <LanguageRoundedIcon sx={{ color: "grey" }} />
        </ListItemIcon>
        <ListItemText
          primary={getName(addiction.siteUrl)}
          sx={{ color: "grey", marginRight: "400px" }}
        />
        {open ? (
          <ExpandLess sx={{ color: "grey" }} />
        ) : (
          <ExpandMore sx={{ color: "grey" }} />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{ display: "flex", flexDirection: "row", alignContent: "center" , width:"550px", alignSelf:"center"}}
        >
          <ListItemButton
          
            sx={{
              pl: 4,
              // backgroundColor: "red",
              display: "flex",
              flexDirection: "row",
              alignContent: "center",
              alignSelf:"center",
              width: 50
            }}
      
          >
            url: {addiction.siteUrl} restriction:{" "}
            <TextField
              id="outlined-basic"
              label={addiction.dailyUsage}
              variant="outlined"
              size="small"
              sx={{
                width: 80,
                margin: "10px",
              }}
              placeholder={`${addiction.dailyUsage}`}
              onChange={(e) => {
                setNewDaily(parseInt(e.target.value));
                setChangesDone(true);
              }}
            />
            <Button
              variant="contained"
              disabled={!changesDone}
              sx={{ margin: "10px" }}
            >
              accept changes
            </Button>
            <Button variant="text">
              {" "}
              <DeleteForeverIcon sx={{ color: "red" }} />
            </Button>
          </ListItemButton>
        </List>
      </Collapse>
    </div>
  );
}
