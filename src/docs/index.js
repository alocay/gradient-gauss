import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import CanvasSandbox from './canvas-sandbox.jsx';

const createStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        paddingTop: '20px'    
    },

    title: {
        padding: '10px',
        borderBottom: `1px solid ${theme.palette.divider}`,
        marginBottom: '25px'
    },

    link: {
        textAlign: 'right'
    },

    paper: {
        backgroundColor: theme.palette.type === 'dark' ? theme.palette.grey[700] : theme.palette.grey[200],  
        padding: theme.spacing(2),
        textAlign: 'left',
        color: theme.palette.text.secondary,
        marginBottom: '20px',
   },
}));

export default function Demo() {
    const classes = createStyles();
    
    return (
        <Container maxWidth="md" className={classes.root}>
            <Paper className={classes.paper}>
                <Grid container spacing={3} className={classes.title}>
                    <Grid item xs={10}>
                        <Typography variant='h5'>gradient gauss</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Link href="https://github.com/alocay/gradient-gauss" variant='body2' className={classes.link}>github</Link>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography variant='subtitle2'>A JavaScript library to convert a number range to a set of colors using Gaussian function</Typography>
                    </Grid>
                </Grid>
                <CanvasSandbox />
            </Paper>
        </Container>
    );
}

ReactDOM.render(<Demo />, document.getElementById('root'));
