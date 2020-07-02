import React from 'react';
import { View, Container } from 'native-base';
import BadetassProvider from '../BadetassProvider';
import { StyleSheet } from 'react-native';
import { typography } from 'styles';
import BadetassLogo from '../assets/BadetassLogo';
import Badetemperaturer from '../components/TemperatureList';

const styles = StyleSheet.create({
  title: {
    ...typography.textLight,
    marginBottom: 20,
  },
});

export const Badetass = () => {
  return (
    <BadetassProvider>
      <Container style={{ padding: 20 }}>
      <View style={{ marginBottom: 20 }}>
        <BadetassLogo />
      </View>
      <Badetemperaturer />
      </Container>
    </BadetassProvider>
  );
};

export default Badetass;
