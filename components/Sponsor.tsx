import React, { useState, useEffect } from 'react';
import { Text, ListItem, Icon, View } from 'native-base';
import { BadetassContext, useBadetass } from '../BadetassProvider';
import { ScrollView } from 'react-native-gesture-handler';
import { RefreshControl, Linking, Image } from 'react-native';
import axios from 'axios';
import moment from 'moment';

export const Sponsor = () => {
  const { authToken, setSelectedArea, selectedArea, setPartnerLogo, partnerLogo } = useBadetass();

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
  }, [selectedArea, authToken]);

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
        </View>
      )}
    </BadetassContext.Consumer>
  );
};

export default Sponsor;
