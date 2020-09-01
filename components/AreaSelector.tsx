import React, { useEffect } from 'react';
import { View, Text } from 'native-base';
import { Platform } from 'react-native';
import { BadetassContext, useBadetass } from '../BadetassProvider';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';

export const AreaSelector = (): JSX.Element => {
  const { authToken, areas, setAreas, setSelectedArea } = useBadetass();

  const fetchAreas = async () => {
    let token = authToken();
    if (!token) {
      return;
    }
    axios
      .get('https://prdl-apimgmt.lyse.no/apis/t/prod.altibox.lyse.no/temp/1.0/api/area/', {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: `application/json`,
        },
      })
      .then((e) => {
        let areasArray = e.data.map(function (item) {
          return { value: item.id, label: item.Name, partnerId: item.Partner_id };
        });
        areasArray.unshift({ value: 9999, label: 'Vis alle'});
        setAreas(areasArray);
      })
      .catch((err) => {
        console.log('error fetching areas', err);
      });
  };

  useEffect(() => {
    if (!areas() || areas().length < 1) {
      fetchAreas();
    }
  }, [areas, authToken]);
  return (
    <BadetassContext.Consumer>
      {() => (
        <View style={{
                  ...(Platform.OS !== 'android' && {
                    zIndex: 10,
                  }),
                }}>
          <DropDownPicker
              items={areas()}
              dropDownMaxHeight={300}
              searchable={true}
              searchablePlaceholder="Søk ..."
              searchableError={() => <Text>Finner ikke kommunen</Text>}
              placeholder="Søk etter kommune ..."
              containerStyle={{ height: 40 }}
              onChangeItem={item => setSelectedArea(item)}
              itemStyle={{justifyContent: 'flex-start'}}
          ></DropDownPicker>
        </View>
      )}
    </BadetassContext.Consumer>
  );
};

export default AreaSelector;
