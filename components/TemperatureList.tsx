import React, { useState, useEffect } from 'react';
import { Text, ListItem, Icon, View } from 'native-base';
import { BadetassContext, useBadetass } from '../BadetassProvider';
import { ScrollView } from 'react-native-gesture-handler';
import { RefreshControl, Linking, Image } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import BadetassLogo from '../assets/BadetassLogo';

export const TemperatureList = () => {
  const { authToken, temperatures, setTemperatures, setPreviousArea, previousArea, selectedArea, setPartnerLogo, partnerLogo } = useBadetass();
  const [shouldRefresh, setShouldRefresh] = useState(0);

  const fetchPartnerLogo = async (partnerId) => {
    let token = authToken();
    if (!token) {
      return;
    }
    let fetchUrl = 'https://prdl-apimgmt.lyse.no/apis/t/prod.altibox.lyse.no/temp/1.0/api/partner/';

    axios
      .get(fetchUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: `application/json`,
        },
      })
      .then((e) => {
        let partner = e.data.find(item => item.id === partnerId);
        setPartnerLogo(partner.Logo);
      })
      .catch((err) => {
        console.log('error fetching partner logo', err);
      });
  };

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
      console.log(selectedArea());
      fetchTemperatures();
      setPreviousArea(selectedArea());
    }
    if (selectedArea().label && selectedArea().label !== 'Vis alle') {
      fetchPartnerLogo(selectedArea().partnerId);
    } else {
      setPartnerLogo('https://www.altibox.no/wp-content/uploads/2016/06/altibox_bokslogo_rgb.png');
    }
  }, [temperatures, previousArea, selectedArea, authToken]);

  return (
    <BadetassContext.Consumer>
      {() => (
        <View style={{ padding: 20 }}>
          {partnerLogo()[0] ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            {selectedArea().label && selectedArea().label !== 'Vis alle' ? (
            <Text >Badetemperaturer i {selectedArea().label}</Text>
            ) : <Text >Badetemperaturer</Text>}
            <Text>sponses av</Text>
            <View style={{ padding: 20 }}>
            <Image source={{uri: partnerLogo()}} style={{width: 240, height: 64, resizeMode: 'contain'}} />
            </View>
          </View>
          ) : null}
          <ScrollView
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
        </View>
      )}
    </BadetassContext.Consumer>
  );
};

export default TemperatureList;
