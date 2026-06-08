import React from 'react';
import TextField from '@mui/material/TextField';

function AppInput({ id, value, isReadOnly,  label, ...props }) {
  return (
      <TextField
          fullWidth
          id={id}
          label={label} 
          value={value ?? ''}
          InputProps={{
              readOnly: isReadOnly,
          }}
          variant="outlined"
          sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'grey.50',
              },
              '& .MuiInputBase-input': {
                  fontWeight: 500,
              },
              '& .MuiInputLabel-root': {
                  fontWeight: 600,
              }
          }}
          // pasamos el resto de las props para permitir personalización adicional
          {...props }
      />
  );
}

export default AppInput;