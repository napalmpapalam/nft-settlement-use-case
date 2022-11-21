import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import MuiSelect from "@mui/material/Select";
import React, { useState } from "react";

type SelectOption = {
  value: string | number | undefined;
  label: string | JSX.Element | JSX.Element[];
};

export default function Select({
  label,
  options = [],
  onChange,
}: {
  label?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <FormControl fullWidth>
      <InputLabel id={`rarimo-select-label-${label}`}>{label}</InputLabel>
      <MuiSelect
        labelId={`rarimo-select-label-${label}`}
        label={label}
        onChange={(event) => {
          setValue(event.target.value as string);
          if (onChange) onChange(event.target.value as string);
        }}
        value={value}
        inputProps={{
          id: "rarimo-select",
          "data-testid": "rarimo-select",
        }}
      >
        {!!options.length &&
          options.map((option, index) => (
            <MenuItem key={index} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
      </MuiSelect>
    </FormControl>
  );
}
