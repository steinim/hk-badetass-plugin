import React, { useContext, useMemo, useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import axios from 'axios';

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
  const [areasState, setAreasState] = useState([]);
  const [selectedAreaState, setSelectedAreaState] = useState([]);
  const [previousAreaState, setPreviousAreaState] = useState([]);

  const getToken = async () => {

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', '<secret>');
    params.append('client_secret', '<secret>');

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

  const areas = () => {
    return areasState;
  };

  const setAreas = (as) => {
    const _storeData = async (c) => {
      try {
        await AsyncStorage.setItem('areasState', JSON.stringify(c));
      } catch (error) {
        console.log('save error', error);
      }
    };
    _storeData(as);
    setAreasState(as);
  };

  const previousArea = () => {
    return previousAreaState;
  };

  const setPreviousArea = (pa) => {
    const _storeData = async (c) => {
      try {
        let thePreviousArea = '[' + JSON.stringify(c) + ']';
        await AsyncStorage.setItem('previousAreaState', thePreviousArea);
      } catch (error) {
        console.log('save error', error);
      }
    };
    _storeData(pa);
    setPreviousAreaState(pa);
  };

  const selectedArea = () => {
    return selectedAreaState;
  };

  const setSelectedArea = (sa) => {
    const _storeData = async (c) => {
      try {
        let theArea = '[' + JSON.stringify(c) + ']';
        await AsyncStorage.setItem('selectedAreaState', theArea);
      } catch (error) {
        console.log('save error', error);
      }
    };
    _storeData(sa);
    setSelectedAreaState(sa);
  };

  const temperatures = () => {
    return temperatureState;
  };

  const setTemperatures = (temps) => {
    const _storeData = async (c) => {
      try {
        await AsyncStorage.setItem('temperatureState', JSON.stringify(c));
      } catch (error) {
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
        const tkn = JSON.parse(data) as Token;
        setToken(tkn);
      }
    };
    loadToken();

    const loadAreas = async () => {
      const data = await AsyncStorage.getItem('areasState');
      if (!!data) {
        const ars = JSON.parse(data);
        setAreas(ars);
      }
    };
    loadAreas();

    const loadPreviousArea = async () => {
      const data = await AsyncStorage.getItem('previousAreaState');
      if (!!data) {
        const pas = JSON.parse(data);
        setPreviousArea(pas);
      }
    };
    loadPreviousArea();

    const loadSelectedArea = async () => {
      const data = await AsyncStorage.getItem('selectedAreaState');
      if (!!data) {
        const sars = JSON.parse(data);
        setSelectedArea(sars);
      }
    };
    loadSelectedArea();

    const loadTemperatures = async () => {
      const data = await AsyncStorage.getItem('temperatureState');
      if (!!data) {
        const tmps = JSON.parse(data);
        setTemperatures(tmps);
      }
    };
    loadTemperatures();

  }, []);

  const value = useMemo(() => {
    return {
      authToken,
      temperatures,
      setTemperatures,
      areas,
      setAreas,
      previousArea,
      setPreviousArea,
      selectedArea,
      setSelectedArea,
    };
  }, [token, temperatureState, areasState, previousAreaState, selectedAreaState]);

  return (
    <BadetassContext.Provider value={value}>
      {props.children}
    </BadetassContext.Provider>
  );
};

const useBadetass: any = () => useContext(BadetassContext);
export { BadetassContext, useBadetass };
export default BadetassProvider;
