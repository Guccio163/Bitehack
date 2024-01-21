import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react'
import { Addiction } from '../contexts/AddictionsContext';
import InstagramIcon from "@mui/icons-material/Instagram";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

interface Props{
    addction: Addiction;
}

export default function ListItem({addction}:Props) {

    const [open, setOpen] = React.useState(true);

    const handleClick = () => {
      setOpen(!open);
    };

  return (
    <>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <InstagramIcon sx={{ color: "grey" }} />
        </ListItemIcon>
        <ListItemText primary={addction.siteUrl} sx={{ color: "grey" }} />
        {open ? (
          <ExpandLess sx={{ color: "grey" }} />
        ) : (
          <ExpandMore sx={{ color: "grey" }} />
        )}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <InstagramIcon />
            </ListItemIcon>
            <ListItemText primary="Chuj" sx={{ color: "grey" }} />
          </ListItemButton>
        </List>
      </Collapse>
    </>
  );
}
