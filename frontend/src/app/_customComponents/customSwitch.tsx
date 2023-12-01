import { Box, Switch, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';

type CustomSwitchProps = {
  edit: boolean;
  falseText: string;
  trueText: string;
  value: boolean;
  displayTrueValue?: boolean;
  displayFalseValue?: boolean;
  paramkey?: string;
  id?: number;
  onChangeValue?: () => void;
};

const CustomSwitch: React.FC<CustomSwitchProps> = (props) => {
  const {
    edit,
    falseText,
    trueText,
    value,
    paramkey,
    id,
    onChangeValue,
    displayTrueValue = true,
    displayFalseValue = true,
  } = props;
  const [swichBoolean, setSwichBoolean] = useState<boolean>(false);

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSwichBoolean(e.target.checked);
  };

  useEffect(() => {
    setSwichBoolean(value);
  }, [value]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {displayFalseValue ? <Typography>{falseText}</Typography> : <></>}
      <Switch
        sx={{
          width: '68px',
          height: '45px',
          '& .MuiSwitch-switchBase': {
            width: 48,
          },
          '& .MuiSwitch-thumb': {
            width: 22,
            height: 22,
            marginTop: 0.45,
          },
          '& .MuiSwitch-track': {
            borderRadius: 16,
            height: 24,
          },
        }}
        color="primary"
        disabled={!edit}
        onChange={(e) => handleChangeValue(e)}
        checked={swichBoolean}
      />
      {displayTrueValue ? <Typography>{trueText}</Typography> : <></>}
    </Box>
  );
};

export default React.memo(CustomSwitch);
