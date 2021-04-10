import React from 'react';
import { makeStyles, Theme, } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: 300,
    height: 400,
  },
  container: {

  },
}));

const InvalidOptionsMessage = () => {
  const classes = useStyles();

  function handleClick() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  }

  return (
    <div className={classes.root}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">
              It looks like you have not configured your connection to Ombi yet. To load proper media information and provide other functionality, Buscarr needs to be configured for Ombi. Go to options to configure it now.
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={handleClick}
        >
          Open Options
        </Button>
      </DialogActions>
    </div>
  );
};

export default InvalidOptionsMessage;