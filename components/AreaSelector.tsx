import React, { useEffect } from 'react';
import { View } from 'native-base';
import { BadetassContext, useBadetass } from '../BadetassProvider';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';

export const AreaSelector = () => {
  const { authToken, areas, setAreas } = useBadetass();

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
        let areasArray = e.data.map(function(item) {
          return {value: item.id, label: item.Name};
        });
        setAreas(areasArray);
      })
      .catch((err) => {
        console.log('error fetching areas', err);
      });
  };
  useEffect(() => {
    if (areas().length < 1) {
      fetchAreas();
    } else {
      console.log(areas());
    }
  }, [areas, authToken]);

  return (
    <BadetassContext.Consumer>
    {() => (
      <View>
        <DropDownPicker
          items={areas()}
          searchable={true}
          searchablePlaceholder="Søk ..."
          searchableError="Ingen badeplasser eller kommuner"
          placeholder="Søk etter badeplass/kommune ..."
          containerStyle={{height: 40}}
          onChangeItem={(item: string) => console.log('selected ', item)}
        ></DropDownPicker>
      </View>
    )}
    </BadetassContext.Consumer>
  );
};

export default AreaSelector;
