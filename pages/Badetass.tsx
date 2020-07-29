import React from 'react';
import { View, Container } from 'native-base';
import BadetassProvider from '../BadetassProvider';
import TemperatureList from '../components/TemperatureList';
import AreaSelector from '../components/AreaSelector';

export const Badetass = () => {
  return (
    <BadetassProvider>
      <Container style={{ padding: 20 }}>
        <AreaSelector />
        <TemperatureList />
      </Container>
    </BadetassProvider>
  );
};

export default Badetass;
