import React, { useContext, useMemo, useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import axios from 'axios';
import { CLIENT_ID, CLIENT_SECRET } from 'react-native-dotenv';

const BadetassContext = React.createContext({ });

interface Props {
  children?: any;
}

export interface Token {
  access_token?: string;
  scope?: string;
  token_type?: string;
  expires_in?: number;
}

export const BadetassProvider = (props: Props) => {
  const [token, setToken] = useState({} as Token);
  const [temperatureState, setTemperatureState] = useState([]);

  const getToken = async () => {

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);

    return await axios
      .post(`https://prdl-apimgmt.lyse.no/apis/token`, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((e) => {
        setToken(e.data);
        AsyncStorage.setItem('badetass-token', JSON.stringify(e.data));
        return e.data;
      })
      .catch((err) => console.log('error', err));
  };

  const temperatures = () => {
    return temperatureState;
  };

  const setTemperatures = (temps) => {
    const _storeData = async (c) => {
      try {
        await AsyncStorage.setItem('temperatureState', JSON.stringify(c));
      } catch (error) {
        // Error saving data
        console.log('save error', error);
      }
    };
    _storeData(temps);
    setTemperatureState(temps);
  };

  const authToken = () => {
    return token.access_token;
  };

  useEffect(() => {
    getToken();
    const loadToken = async () => {
      const data = await AsyncStorage.getItem('badetass-token');
      if (!!data) {
        const t = JSON.parse(data) as Token;
        setToken(t);
      }
    };
    loadToken();

    const loadTemperatures = async () => {
      const data = await AsyncStorage.getItem('temperatureState');
      if (!!data) {
        const t = JSON.parse(data);
        setTemperatures(t);
      }
    };
    loadTemperatures();
  }, []);

  const value = useMemo(() => {
    return {
      authToken,
      temperatures,
      setTemperatures,
    };
  }, [token, temperatureState]);

  return (
    <BadetassContext.Provider value={value}>
      {props.children}
    </BadetassContext.Provider>
  );
};

const useBadetass: any = () => useContext(BadetassContext);
export { BadetassContext, useBadetass };
export default BadetassProvider;
