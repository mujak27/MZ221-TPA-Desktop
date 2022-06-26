import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { collection, Firestore, getFirestore, query, where } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import { firebaseConfig } from '../Model/firebase';
import { KeyUser, Tables, TypeUser, enumNotifFreq } from '../Model/model';

type typeGlobalContext = {
  auth : Auth,
  user : TypeUser,
  firestore : Firestore,
  refresh : boolean,
  setRefresh : React.Dispatch<React.SetStateAction<boolean>>,
  history: any
}

let globalContext = createContext<typeGlobalContext>({
  auth: getAuth(),
  user: {
    userUid: '',
    userEmail: '',
    userInvitation: [],
    userName: '',
    userNotifFreq: enumNotifFreq.Instant,
    userNotifications: [],
  },
  firestore: getFirestore(initializeApp(firebaseConfig)),
  refresh: false,
  setRefresh: '' as unknown as React.Dispatch<React.SetStateAction<boolean>>,
  history: null,
});

export const useGlobalContext = ()=>useContext(globalContext);

type props = {
  children: JSX.Element | JSX.Element[]
}

export const ContextProvider = ({children }: props)=>{
  const firestore = useFirestore();
  const auth = getAuth();
  const userUid = auth.currentUser?.uid as string;
  const userDataRef = collection(firestore, Tables.Users);
  const [refresh, setRefresh] = useState(false);
  const history = useHistory();
  const {status: statusUser, data: resUser} = useFirestoreCollectionData(query(userDataRef,
      where(KeyUser.userUid, '==', userUid),
  ));

  useEffect(()=>{
    console.info('refreshed');
  }, [refresh]);

  if (statusUser === 'loading') {
    return <div>fetching user data...</div>;
  }

  console.info(resUser);
  const user = resUser[0] as TypeUser;
  console.info(user);
  globalContext = createContext<typeGlobalContext>({
    auth,
    user,
    firestore,
    refresh,
    setRefresh,
    history,
  });

  return (
    <globalContext.Provider value={{
      auth,
      user,
      firestore,
      refresh,
      setRefresh,
      history,
    } as typeGlobalContext}>
      {children}
    </globalContext.Provider>
  );
};
