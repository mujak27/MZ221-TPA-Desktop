import { IonText } from '@ionic/react';
import { collection, query, where } from 'firebase/firestore';
import React from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../context/ContextProvider';
import { KeyUser, Tables, TypeUser } from './model';

type props = {
  userUid : string
}

export const GetUserName : React.FC<props> = ({userUid}) => {
  const {firestore} = useGlobalContext();


  const refUser = collection(firestore, Tables.Users);
  const {status : statusUser, data : resUser} = useFirestoreCollectionData(query(refUser, where(KeyUser.userUid, '==', userUid)), {
    idField: 'uid'
  });

  if(statusUser === 'loading') return <>...</>

  
  const users = resUser as Array<TypeUser>;
  if(!users.length) return <>unkown_user</>

  return (
    <IonText color='primary'>{users[0].userName}</IonText>
  );
};
