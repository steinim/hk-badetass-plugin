import React from 'react';
import { View, Container } from 'native-base';
import BadetassProvider from '../BadetassProvider';
import TemperatureList from '../components/TemperatureList';
import AreaSelector from '../components/AreaSelector';
import Sponsor from '../components/Sponsor';

export const Badetass = () => {
  return (
    <BadetassProvider>
      <Container style={{ padding: 20 }}>
        <AreaSelector />
        <Sponsor />
        <TemperatureList />
      </Container>
    </BadetassProvider>
  );
};

export default Badetass;
