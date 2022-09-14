import { createTheme } from '@mui/material/styles';
import blueGrey from '@mui/material/colors/blueGrey';

export const theme = createTheme({
  palette: {
    primary: blueGrey,
    secondary: blueGrey,
    tonalOffset: 0.2,
  },
});