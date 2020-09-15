import React, { useState, useEffect } from 'react';
import { Text, ListItem, Icon, View } from 'native-base';
import { BadetassContext, useBadetass } from '../BadetassProvider';
import { ScrollView } from 'react-native-gesture-handler';
import { Platform, ActivityIndicator, RefreshControl, Linking, StyleSheet } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { PERMISSIONS, request } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import { orderByDistance } from 'geolib';
import variable from '../../../native-base-theme/variables/material';
import { typography } from 'styles';

export const TemperatureList = (): JSX.Element => {
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
      fetchUrl = 'https://prdl-apimgmt.lyse.no/apis/t/prod.altibox.lyse.no/temp/1.0/api/area/' + selectedArea().label;
    } else {
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
        let locations = e.data.map((item) => {
          return {
            id: item.id,
            areaId: item.Area_id,
            name: item.Name,
            latitude: item.GPSLat,
            longitude: item.GPSLong,
            pictureURL: item.PictureURL,
            lastTemperature: item.lastTemperature,
            lastReadingTime: item.lastReadingTime,
          };
        });
        try {
          request(
              Platform.select({
                android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
              })
            ).then(res => {
              if (res === 'granted') {
                Geolocation.getCurrentPosition(info => {
                  let currentPosition = { latitude: info.coords.latitude, longitude: info.coords.longitude };
                  let orderedByDistanceLocations = orderByDistance(currentPosition, locations);
                  setTemperatures(orderedByDistanceLocations);
                });
              } else {
                console.log('Location is not enabled');
                setTemperatures(locations);
              }
            });
          } catch (error) {
            console.log('location set error:', error);
          }
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
    scrollview: {
      paddingBottom: 250,
    },
    icon: {
      color: variable.kraftCyan,
      fontSize: 16,
    },
    lastReadingTime: {
      color: 'grey',
      opacity: 0.75,
      fontSize: 12,
    },
    temperatureUnit: {
      fontSize: 14,
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
                    <Text style={[typography.textBold, styles.textLarge]}>{item.name}:&nbsp;
                      <Text style={[typography.textBold, styles.textLarge, styles.textTemperature]}>
                        {item.lastTemperature}
                      </Text>
                      <Text style={[styles.temperatureUnit, typography.textMedium]}> °C{'\n'}</Text>
                      <Text style={[styles.lastReadingTime, typography.textMedium]}>
                          Sist målt {moment(item.lastReadingTime).format('DD.MM.YYYY [kl.] HH:mm')}{'\n'}
                      </Text>
                      <Icon name="pin" style={styles.icon} />
                      <Text style={[typography.textLight, styles.textSmall, styles.textLink]}
                        // tslint:disable-next-line: max-line-length
                        onPress={() => Linking.openURL('https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' + item.latitude + ',' + item.longitude)} >
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
