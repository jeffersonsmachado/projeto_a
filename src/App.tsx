import * as config from './common/config.json'
import { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme, Grid, Paper } from '@material-ui/core';
import NavTab from './components/ui/nav_tab';
import { GuildInit } from './components/guild/init';

const useStyle = makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  

}));

const App = () => {

  let [token, setToken] = useState(null);
  let [guild, setGuild] = useState(GuildInit);
  let [emblem, setEmblem] = useState('');
  
  const { r, g, b, a } = guild.crest.background.color.rgba;
  const background_colour = `rgba(${r},${g},${b},${a})`;
  
  const classes = useStyle();


  const loading = () => {
    return(
      <div className="loading_container">
        <div className="loading">
          ...
        </div>
      </div>
    )
  }

  const main = () => {

    return (
      <div className={classes.root}>
       <NavTab></NavTab>
      </div>
    )
  }
  
  useEffect(() => {

    const fetchToken = async() => {
      const oAuthURL = 'https://us.battle.net/oauth/token';
      const response = await fetch(oAuthURL, {
        body: "grant_type=client_credentials",
        headers: {
          'Authorization': 'Basic ' + btoa(config.Client_Id + ':' + config.Client_Secret),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: "POST"
      });
      const { access_token } = await response.json();
      setToken(access_token);
    }
  
    const fetchGuild = async() => {
      const getGuildURL = `${config.api_URL}/guild/${config.Realm_Slug}/${config.Guild_Slug}?namespace=profile-us&locale=en_US&access_token=${token}`;
      const guildResponse = await fetch(getGuildURL);
      const guild = await guildResponse.json();
      console.log(guild);
      setGuild({...guild, loaded: true});

      const emblemResponse = await fetch(guild?.crest?.emblem?.media?.key?.href + `&access_token=${token}`);
      const emblem = await emblemResponse.json();
      setEmblem(emblem.assets[0].value);
    }

    if (token === null) {
      fetchToken();
    }

    if (!guild.loaded && token !== null) {
      fetchGuild();
    }

    return () => {}

  }, [token, guild, emblem])

  return !guild.loaded ? loading() : main();
}

export default App;
