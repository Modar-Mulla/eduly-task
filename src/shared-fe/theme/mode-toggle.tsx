import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import React from "react";
import { ColorModeContext } from "./theme-provider";

export default function ModeToggle() {
  const ctx = React.useContext(ColorModeContext);
  return (
    <Tooltip title="Toggle theme">
      <IconButton onClick={ctx.toggle} aria-label="toggle theme" size="small">
        {ctx.mode === "dark" ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
}
