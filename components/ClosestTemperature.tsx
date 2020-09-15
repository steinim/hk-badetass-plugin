import React, { useEffect } from 'react';
import { Linking, StyleSheet } from 'react-native';
import { Text, View, Icon, Spinner } from 'native-base';
import { BadetassContext, useBadetass } from '../BadetassProvider';
import { typography } from 'styles';
import material from '../../../native-base-theme/variables/material';
import moment from 'moment';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import { findNearest } from 'geolib';

const ClosestTemperature = (): JSX.Element => {
  const { authToken, setClosestTemperature, closestTemperature } = useBadetass();

  let token = authToken();
  if (!token) {
    return null;
  }

  const fetchClosestTemperature = async () => {
    axios
      .get('https://prdl-apimgmt.lyse.no/apis/t/prod.altibox.lyse.no/temp/1.0/api/location/', {
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
        Geolocation.getCurrentPosition(info => {
          let currentPosition = { latitude: info.coords.latitude, longitude: info.coords.longitude };
          let nearest = findNearest(currentPosition, locations);
          setClosestTemperature(nearest);
        });
      })
      .catch((err) => {
        console.log('error fetching closest temperature', err);
      });
  };

  useEffect(() => {
      fetchClosestTemperature();
  }, []);

  const styles = StyleSheet.create({
    textSmall: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    icon: {
      fontSize: 16,
    },
    lastReadingTime: {
      opacity: 0.75,
      fontSize: 12,
    },
    temperatureContainer: {
      backgroundColor: material.brandPrimary,
      paddingBottom: 20,
    },
    temperature: {
      fontSize: 26,
    },
    temperatureUnit: {
      fontSize: 18,
    },
  });

    return (
      <BadetassContext.Consumer>
        {() => (
            <View style={styles.temperatureContainer} accessibilityLabel="badetemperatur">
              {closestTemperature() &&
              <Text style={[typography.textBold, typography.textWhite, typography.textCenter]}>{closestTemperature().name}{'\n'}
                <Text style={[typography.textWhite, typography.textMedium, styles.lastReadingTime]}>
                  Sist målt {moment(closestTemperature().lastReadingTime).format('DD.MM.YYYY [kl.] HH:mm')}{'\n'}
                </Text>
                <Text style={[typography.textWhite, typography.textMedium, styles.temperature]}>{closestTemperature().lastTemperature}</Text>
                <Text style={[typography.textWhite, typography.textMedium, styles.temperatureUnit]}> °C{'\n'}</Text>
                <Icon name="pin" style={[styles.icon, typography.textLight, typography.textWhite]} />
                <Text style={[typography.textLight, styles.textSmall, typography.textWhiteCenter]}onPress={() => Linking.openURL('https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=' + closestTemperature().longitude + ',' + closestTemperature().latitude)} >&nbsp;Vis i kart</Text>
              </Text>
              }
              {!closestTemperature() &&
              <View>
                <Spinner color="white" />
              </View>
              }
            </View>
        )}
      </BadetassContext.Consumer>
    );
};

export default ClosestTemperature;