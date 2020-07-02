import React from 'react';
import { View, Container } from 'native-base';
import BadetassProvider, { useBadetass } from '../BadetassProvider';
import Badetemperaturer from '../components/Badetemperaturer';

export const Badetass = () => {
  return (
    <BadetassProvider>
      <Container style={{ padding: 20 }}>
        <View>
          <Badetemperaturer />
        </View>
      </Container>
    </BadetassProvider>
  );
};

export default Badetass;
