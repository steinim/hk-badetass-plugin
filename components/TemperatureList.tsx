import React, { useState, useEffect } from 'react';
import { Text, ListItem, Icon, View } from 'native-base';
import { BadetassContext, useBadetass } from '../BadetassProvider';
import { ScrollView } from 'react-native-gesture-handler';
import { ActivityIndicator, RefreshControl, Linking, StyleSheet } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import variable from '../../../native-base-theme/variables/material';
import { typography } from '../../../src/styles';

export const TemperatureList = () => {
  const { authToken, temperatures, setTemperatures, setPreviousArea, previousArea, setSelectedArea, selectedArea } = useBadetass();
  const [shouldRefresh, setShouldRefresh] = useState(0);
  const [fetching, setShouldFetch] = useState(false);

  const fetchTemperatures = async () => {
    let token = authToken();
    if (!token) {
      return;
    }
    setShouldFetch(true);
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
        setShouldFetch(false);
      })
      .catch((err) => {
        console.log('error fetching temperatures', err);
      });
  };
  const onRefresh = () => {
    // Increment number just to trigger a refresh
    const increment = shouldRefresh + 1;
    setShouldRefresh(increment);
    fetchTemperatures();
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

  const styles = StyleSheet.create({
    loading: {
      justifyContent: 'center',
      alignSelf: 'center',
    },
    textLarge: {
      fontSize: 18,
    },
    textSmall: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    textTemperature: {
      color: 'red',
    },
    textLink: {
      color: 'blue',
    },
    textGrey: {
      color: 'grey',
    },
    scrollview: {
      paddingBottom: 250,
    },
    icon: {
      color: variable.kraftCyan,
      fontSize: 16,
    },
  });

  return (
    <BadetassContext.Consumer>
      {() => (
        <View>
          {fetching &&
          <View style={styles.loading}>
            <Text>{'\n'}</Text>
            <ActivityIndicator size = "large" color = {variable.kraftCyan}/>
            <Text style={[typography.textLight, styles.textLarge]}>{'\n'}Sjekker tempen...</Text>
          </View>
          }
          {!fetching &&
          <ScrollView contentContainerStyle={styles.scrollview}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={onRefresh} tintColor="transparent" colors={[ 'transparent' ]}/>
            }
          >
            {temperatures() &&
              temperatures().length > 0 &&
              temperatures()
                .map((item, key) => (
                  <ListItem key={key} accessibilityLabel={item.id + ' item'}>
                    <Text refresh={shouldRefresh} {...item}></Text>
                    <Text style={[typography.textBold, styles.textLarge]}>{item.Name}:&nbsp;
                      <Text style={[typography.textBold, styles.textLarge, styles.textTemperature]}>
                        {item.lastTemperature} °C{'\n'}</Text>
                        <Text style={[typography.textLight, styles.textSmall, styles.textGrey]}>
                          Sist målt {moment(item.lastReadingTime).format('DD.MM.YYYY [kl.] HH:mm')}{'\n'}
                        </Text>
                        <Icon name="pin" style={styles.icon} />
                        <Text style={[typography.textLight, styles.textSmall, styles.textLink]}
                          // tslint:disable-next-line: max-line-length
                          onPress={() => Linking.openURL('https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' + item.GPSLat + ',' + item.GPSLong)} >
                          &nbsp;Vis i kart
                      </Text>
                    </Text>
                  </ListItem>
                ))}
          </ScrollView>
        }
        </View>
      )}
    </BadetassContext.Consumer>
  );
};

export default TemperatureList;
