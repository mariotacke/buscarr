import React from 'react';
import { makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import { theme } from '../../theme';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import OptionsForm from './OptionsForm';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
  },
  container: {
    padding: theme.spacing(1),
  },
}));

const Options: React.FC = () => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Container maxWidth="md" className={classes.root}>
          <Paper className={classes.container}>
            <Typography variant="h4" gutterBottom>¡Buscarr! Options</Typography>
            <Divider />
            <OptionsForm />
          </Paper>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
};

export default Options;