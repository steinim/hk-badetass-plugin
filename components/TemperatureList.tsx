import React, { useState, useEffect } from 'react';
import { Text, ListItem, Icon } from 'native-base';
import { BadetassContext, useBadetass } from '../BadetassProvider';
import { ScrollView } from 'react-native-gesture-handler';
import { RefreshControl, Linking } from 'react-native';
import axios from 'axios';
import moment from 'moment';

export const TemperatureList = () => {
  const { authToken, temperatures, setTemperatures, setPreviousArea, previousArea, setSelectedArea, selectedArea } = useBadetass();
  const [shouldRefresh, setShouldRefresh] = useState(0);

  const fetchTemperatures = async () => {
    let token = authToken();
    if (!token) {
      return;
    }
    let fetchUrl = 'https://prdl-apimgmt.lyse.no/apis/t/prod.altibox.lyse.no/temp/1.0/api/location/';
    if (selectedArea().label && selectedArea().label !== 'Vis alle') {
      console.log('Fetching temperatures from', selectedArea().label);
      fetchUrl = 'https://prdl-apimgmt.lyse.no/apis/t/prod.altibox.lyse.no/temp/1.0/api/area/' + selectedArea().label;
    } else {
      console.log('Fetching temperatures from all locations');
      setSelectedArea({ value: 9999, label: 'Vis alle'});
    }

    axios
      .get(fetchUrl, {
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
  const onRefresh = () => {
    // Increment number just to trigger a refresh
    const increment = shouldRefresh + 1;
    setShouldRefresh(increment);
  };

  useEffect(() => {
    if (previousArea().label !== selectedArea().label) {
      fetchTemperatures();
      setPreviousArea(selectedArea());
    } else if (selectedArea().label === undefined) {
      fetchTemperatures();
      return () => setSelectedArea({ value: 9999, label: 'Vis alle'});
    }
  }, [previousArea, selectedArea]);

  return (
    <BadetassContext.Consumer>
      {() => (
          <ScrollView contentContainerStyle={{paddingBottom: 160}}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={onRefresh} />
            }
          >
            {temperatures() &&
              temperatures().length > 0 &&
              temperatures()
                .map((item, key) => (
                  <ListItem key={key} accessibilityLabel={item.id + ' item'}>
                    <Text refresh={shouldRefresh} {...item}></Text>
                    <Text style={{ fontWeight: 'bold' }}>{item.Name}:&nbsp;
                      <Text style={{ color: 'red' }}>
                        {item.lastTemperature} °C{'\n'}
                        <Text style={{ fontWeight: 'normal' }}>Sist målt {moment(item.lastReadingTime).format('DD.MM.YYYY [kl.] HH:mm')}{'\n'}</Text>
                        <Icon name="pin" style={{ fontSize: 18 }} />
                        <Text style={{ color: 'blue', fontWeight: 'normal' }}
                          // tslint:disable-next-line: max-line-length
                          onPress={() => Linking.openURL('https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' + item.GPSLat + ',' + item.GPSLong)} >
                          &nbsp;Vis i kart
                      </Text>
                      </Text>
                    </Text>
                  </ListItem>
                ))}
          </ScrollView>
      )}
    </BadetassContext.Consumer>
  );
};

export default TemperatureList;
