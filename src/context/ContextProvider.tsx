import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { collection, Firestore, getFirestore, query, where } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useFirestore, useFirestoreCollectionData, useStorage } from 'reactfire';
import { firebaseConfig } from '../Model/firebase';
import { enumNotifFreq, KeyUser, Tables, TypeUser } from '../Model/model';

type typeGlobalContext = {
  auth : Auth,
  user : TypeUser,
  firestore : Firestore,
  refresh : boolean,
  setRefresh : React.Dispatch<React.SetStateAction<boolean>>,
  history: any,
  storage: FirebaseStorage
}

let globalContext = createContext<typeGlobalContext>({
  auth: getAuth(),
  user: {
    userUid: '',
    userEmail: '',
    userBio: '',
    userInvitation: [],
    userName: '',
    userNotifFreq: enumNotifFreq.Instant,
    userNotifications: [],
    userImageLink: '',
  },
  firestore: getFirestore(initializeApp(firebaseConfig)),
  refresh: false,
  setRefresh: '' as unknown as React.Dispatch<React.SetStateAction<boolean>>,
  history: null,
  storage: getStorage(initializeApp(firebaseConfig)),
});

export const useGlobalContext = ()=>useContext(globalContext);

type props = {
  children: JSX.Element | JSX.Element[]
}

export const ContextProvider = ({children }: props)=>{
  const firestore = useFirestore();
  const storage = useStorage();
  const auth = getAuth();
  const userUid = auth.currentUser?.uid as string;
  const userDataRef = collection(firestore, Tables.Users);
  const [refresh, setRefresh] = useState(false);
  const history = useHistory();
  const {status: statusUser, data: resUser} = useFirestoreCollectionData(query(userDataRef,
      where(KeyUser.userUid, '==', userUid),
  ), {
    idField: 'uid'
  });

  useEffect(()=>{
    console.info('refreshed');
  }, [refresh]);

  if (statusUser === 'loading') {
    return <div>fetching user data...</div>;
  }

  
  const user = resUser[0] as TypeUser;
  console.info('useruid');
  console.info(user.userUid);
  globalContext = createContext<typeGlobalContext>({
    auth,
    user,
    firestore,
    refresh,
    setRefresh,
    history,
    storage
  });

  return (
    <globalContext.Provider value={{
      auth,
      user,
      firestore,
      refresh,
      setRefresh,
      history,
      storage
    } as typeGlobalContext}>
      {children}
    </globalContext.Provider>
  );
};
