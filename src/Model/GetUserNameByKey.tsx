import { IonText } from '@ionic/react';
import { doc } from 'firebase/firestore';
import React from 'react';
import { useFirestoreDocData } from 'reactfire';
import { useGlobalContext } from '../context/ContextProvider';
import { Tables, TypeUser } from './model';

type props = {
  userUid : string
}

export const GetUserNameByKey : React.FC<props> = ({userUid}) => {
  const {firestore} = useGlobalContext();


  const refUser = doc(firestore, Tables.Users, userUid);
  const {status : statusUser, data : resUser} = useFirestoreDocData(refUser, {
    idField: 'uid'
  });

  if(statusUser === 'loading') return <>...</>

  
  const users = resUser as TypeUser;
  if(!users) return <>unkown_user</>

  return (
    <IonText color='primary'>{users.userName}</IonText>
  );
};
