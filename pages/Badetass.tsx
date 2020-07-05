import React from 'react';
import { View, Container, Text } from 'native-base';
import BadetassProvider from '../BadetassProvider';
import { StyleSheet } from 'react-native';
import { typography } from 'styles';
import BadetassLogo from '../assets/BadetassLogo';
import TemperatureList from '../components/TemperatureList';
import AreaSelector from '../components/AreaSelector';

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
      <View>
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
