import React from 'react';
import { View, Container, Text } from 'native-base';
import BadetassProvider from '../BadetassProvider';
import BadetassLogo from '../assets/BadetassLogo';
import TemperatureList from '../components/TemperatureList';
import AreaSelector from '../components/AreaSelector';

export const Badetass = () => {
  return (
    <BadetassProvider>
      <Container style={{ padding: 20 }}>
      <View style={{ marginBottom: 20 }}>
        <BadetassLogo />
      </View>
      <View
          style={{
              ...(Platform.OS !== 'android' && {
                zIndex: 10,
              }),
            }}>
        <AreaSelector />
      </View>
      <View>
        <TemperatureList />
      </View>
      </Container>
    </BadetassProvider>
  );
};

export default Badetass;
