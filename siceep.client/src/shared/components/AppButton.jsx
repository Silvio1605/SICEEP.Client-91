import React from 'react';
import Button from '@mui/material/Button';

function AppButton({ colorBtn, iconBtn, isfullWidth, content, ...props }) {
  return (
      <Button
          fullWidth={isfullWidth}
          variant="contained"
          startIcon={iconBtn}
          sx={{
              mb: 2,
              mt: 2,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: 'none',
              fontSize: '0.95rem',
              boxShadow: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4
              }
          }}
          color={colorBtn}
          startIcon={iconBtn}
          {...props }
      >
          {content}
      </Button>
  );
}

export default AppButton;