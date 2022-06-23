import { serverTimestamp } from 'firebase/firestore';
import React, { createContext, useContext } from 'react';
import { TypeGroup } from '../../Model/model';

type TypeGroupContext = {
  group : TypeGroup
}

let groupContext = createContext<TypeGroupContext>({
  group: {
    groupName: '',
    groupCreatedDate: serverTimestamp(),
    groupCardUids: [],
  },
});

export const useGroupContext = ()=>{
  return useContext(groupContext);
};


type props = {
  group : TypeGroup,
  children : React.ReactNode | React.ReactNode[]
}

export const GroupContext : React.FC<props> = ({group, children}) => {
  groupContext = createContext<TypeGroupContext>({group});
  return (
    <>
      {children}
    </>
  );
};
