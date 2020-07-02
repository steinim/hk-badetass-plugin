import React, { useContext } from 'react';
import { NavigationStackProp } from 'react-navigation-stack';

const BadetassContext = React.createContext({});

interface Props {
  navigation?: NavigationStackProp;
  children?: any;
}

export interface Token {
  accessToken?: string;
  expiresIn?: number;
  tokenType?: string;
}

export const BadetassProvider = (props: Props) => {
  return (
    <BadetassContext.Provider value="">
      Hello Swimmer!
    </BadetassContext.Provider>
  );
};

const useBadetass: any = () => useContext(BadetassContext);
export { BadetassContext, useBadetass };
export default BadetassProvider;
