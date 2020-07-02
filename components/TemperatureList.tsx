import React, { useState, useEffect } from 'react';
import { Text, ListItem } from 'native-base';
import { BadetassContext, useBadetass } from '../BadetassProvider';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { RefreshControl } from 'react-native';
import moment from 'moment';

export const TemperatureList = () => {
  const { authToken, temperatures, setTemperatures } = useBadetass();
  const [shouldRefresh, setShouldRefresh] = useState(0);

  const fetchTemperatures = async () => {
    let token = authToken();
    if (!token) {
      return;
    }

    axios
      .get('https://prdl-apimgmt.lyse.no/apis/t/prod.altibox.lyse.no/temp/1.0/api/location/', {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: `application/json`,
        },
      })
      .then((e) => {
        setTemperatures(e.data);
      })
      .catch((err) => {
        console.log('error fetching temperatures', err);
      });
  };
  useEffect(() => {
    if (!temperatures() || temperatures().length < 1) {
      fetchTemperatures();
    }
  }, [temperatures, authToken]);

  const onRefresh = () => {
    // Increment number just to trigger a refresh
    const increment = shouldRefresh + 1;
    setShouldRefresh(increment);
    fetchTemperatures();
  };

  return (
    <BadetassContext.Consumer>
    {() => (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
      >
        <Text>Badetemperaturer:</Text>
        {temperatures() &&
          temperatures().length > 2 &&
          temperatures().map((item, key) => (
            <ListItem key={key} accessibilityLabel={item.id + ' knapp'}>
              <Text refresh={shouldRefresh} {...item}></Text>
              <Text>{item.Name}: {item.lastTemperature} ({moment(item.lastReadingTime).format('DD.MMM HH:mm')})</Text>
            </ListItem>
          ))}
      </ScrollView>
    )}
  </BadetassContext.Consumer>
  );
};

export default TemperatureList;
