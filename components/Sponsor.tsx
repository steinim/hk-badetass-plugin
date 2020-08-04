import React, { useState, useEffect } from 'react';
import { Text, View } from 'native-base';
import { Image, StyleSheet } from 'react-native';
import { BadetassContext, useBadetass } from '../BadetassProvider';
import axios from 'axios';

export const Sponsor = () => {
  const { authToken, selectedArea, setPartnerLogo, partnerLogo } = useBadetass();
  const [fetching] = useState();

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

  useEffect(() => {
    if (selectedArea().label && selectedArea().label !== 'Vis alle') {
      fetchPartnerLogo(selectedArea().partnerId);
    } else {
      setPartnerLogo('https://www.altibox.no/wp-content/uploads/2016/06/altibox_bokslogo_rgb.png');
    }
  }, [selectedArea]);

  const styles = StyleSheet.create({
    center: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 240,
      height: 64,
      resizeMode: 'contain',
    },
    space: {
      padding: 20,
    },
  });

  return (
    <BadetassContext.Consumer>
      {() => (
        <View style={styles.space}>
          {partnerLogo()[0] && !fetching ? (
          <View style={styles.center}>
            {selectedArea().label && selectedArea().label !== 'Vis alle' ? (
            <Text >Badetemperaturer i {selectedArea().label}</Text>
            ) : <Text >Badetemperaturer</Text>}
            <Text>sponses av</Text>
            <View style={styles.space}>
              <Image source={{uri: partnerLogo()}} style={styles.logo} />
            </View>
          </View>
          ) : null}
        </View>
      )}
    </BadetassContext.Consumer>
  );
};

export default Sponsor;
