import React from 'react';
import { Container } from 'native-base';
import BadetassProvider from '../BadetassProvider';
import TemperatureList from '../components/TemperatureList';
import AreaSelector from '../components/AreaSelector';
import Sponsor from '../components/Sponsor';
import ClosestTemperature from '../components/ClosestTemperature';

export const Badetass = (): JSX.Element => {
  return (
    <BadetassProvider>
      <Container style={{ padding: 20 }}>
        <ClosestTemperature />
        <AreaSelector />
        <Sponsor />
        <TemperatureList />
      </Container>
    </BadetassProvider>
  );
};

export default Badetass;
