import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { collection, Firestore, getFirestore, query } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useFirestore, useFirestoreCollectionData, useStorage } from 'reactfire';
import { firebaseConfig } from '../Model/firebase';
import { enumNotifFreq, Tables, TypeNotification, TypeUser } from '../Model/model';

type typeGlobalContext = {
  auth : Auth,
  user : TypeUser,
  users : Array<TypeUser>,
  firestore : Firestore,
  refresh : boolean,
  setRefresh : React.Dispatch<React.SetStateAction<boolean>>,
  history: any,
  storage: FirebaseStorage,
  notifications : Array<TypeNotification>
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
  users : [],
  firestore: getFirestore(initializeApp(firebaseConfig)),
  refresh: false,
  setRefresh: '' as unknown as React.Dispatch<React.SetStateAction<boolean>>,
  history: null,
  storage: getStorage(initializeApp(firebaseConfig)),
  notifications : [],
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
  const [refresh, setRefresh] = useState(false);
  const history = useHistory();
  
  const userDataRef = collection(firestore, Tables.Users);
  const {status: statusUsers, data: resUsers} = useFirestoreCollectionData(query(userDataRef), {
    idField: 'uid'
  });

  const refNotifications = collection(firestore, Tables.Users, userUid, Tables.Notifications);
  const {status : statusNotifications, data : resNotifications} = useFirestoreCollectionData(refNotifications, {
    idField : 'uid'
  });

    useEffect(()=>{
    console.info('refreshed');
  }, [refresh]);

  if (statusUsers === 'loading' || statusNotifications === 'loading') {
    return <div>fetching user data...</div>;
  }



  const notifications = resNotifications as Array<TypeNotification>;
  console.info(notifications);

  const users = resUsers as Array<TypeUser>;
  const user = users.filter((user)=>{return user.userUid == userUid})[0];  
  console.info(users);
  console.info(userUid);
  console.info('useruid');
  console.info(user.userUid);
  globalContext = createContext<typeGlobalContext>({
    auth,
    user,
    users,
    firestore,
    refresh,
    setRefresh,
    history,
    storage,
    notifications
  });

  return (
    <globalContext.Provider value={{
      auth,
      user,
      users,
      firestore,
      refresh,
      setRefresh,
      history,
      storage,
      notifications
    } as typeGlobalContext}>
      {children}
    </globalContext.Provider>
  );
};
