import React from 'react';
import { Box } from '@mui/material';

interface LogoProps {
  size?: number;
  variant?: 'default' | 'white' | 'gradient';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 100, 
  variant = 'default' 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        position: 'relative',
      }}
    >
      <Box
        component="img"
        src="/zdn-logo.png"
        alt="ZDN Logo"
        sx={{
          width: size,
          height: size,
          objectFit: 'contain',
          filter: variant === 'white' ? 'brightness(0) invert(1)' : 'none',
        }}
        onError={(e) => {
          // Fallback to a simple red circle if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.innerHTML = `
              <div style="
                width: ${size}px;
                height: ${size}px;
                background: linear-gradient(135deg, #e53e3e 0%, #c53030 50%, #9c2626 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: ${size * 0.4}px;
                font-family: Arial, sans-serif;
              ">Z</div>
            `;
          }
        }}
      />
    </Box>
  );
};

export default Logo;
