import { AppBar, Typography, Tabs, Box, Tab, makeStyles, Theme, Paper, Link, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import { maxHeight, sizing } from "@material-ui/system";
import { useState } from "react";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface TabLinkProps {
  label?: string;
  href?: string;
}

function TabPanel (props: TabPanelProps) {
  const { children, index, value, ..._props } = props;
  return (
    <div
      role="tabpanel"
      hidden={index!==value}
      id={`tab_panel_${index}`}
      aria-labelledby={`tab_panel_${index}`}
      { ..._props }
    >
      { value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function TabLink (props: TabLinkProps) {
  const { label, href } = props;

  const NavButton = withStyles((theme: Theme) => ({
    root: {
      backgroundColor: 'red',
      fontSize: '5vh'
    }
  }))(Button);

  return(
    <Tab 
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault();
      }}
      component={() => (
        <Box width="100%" height="200px">
          <Paper elevation={3}>
            <Link
              onClick={() => console.log(href)}
              component={() => (
                <NavButton>
                  {label}
                </NavButton>
              )}
            />
          </Paper>
        </Box>
      )}
      { ...props }
    />
  )
}

function a11yProps (index: any) {
  return {
    id: `tab_panel_${index}`,
    'aria-controls': `tabl_panel_${index}`
  };
}

const useStyle = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
}))

const NavTab = () => {

  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  }

  const classes = useStyle();

  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="nav bar"
          variant="fullWidth"
        >
          <TabLink label="Home Page" href="/" {...a11yProps(0)} />
          <TabLink label="Second Page" href="/" {...a11yProps(1)}/>
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
      </TabPanel>
      <TabPanel value={value} index={1}>
      </TabPanel>
    </div>
  )
}

export default NavTab;