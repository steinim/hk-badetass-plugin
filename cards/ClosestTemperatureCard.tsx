import React from 'react';
import { BadetassProvider } from '../BadetassProvider';
import ClosestTemperature from '../components/ClosestTemperature';

const ClosestTemperatureCard = (): JSX.Element => {
    return (
      <BadetassProvider>
        <ClosestTemperature />
      </BadetassProvider>
    );
};
export default ClosestTemperatureCard;
