import { initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { collection, Firestore, getFirestore, query, where } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { union, uniqBy } from 'lodash';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useFirestore, useFirestoreCollectionData, useStorage } from 'reactfire';
import { firebaseConfig } from '../Model/firebase';
import { enumNotifFreq, KeyWorkspace, Tables, TypeNotification, TypeUser, TypeWorkspace, WorkspaceVisibility } from '../Model/model';

type typeGlobalContext = {
  auth : Auth,
  user : TypeUser,
  users : Array<TypeUser>,
  firestore : Firestore,
  refresh : boolean,
  setRefresh : React.Dispatch<React.SetStateAction<boolean>>,
  history: any,
  storage: FirebaseStorage,
  notifications : Array<TypeNotification>,
  workspaces : Array<TypeWorkspace>
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
  workspaces: [],
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
  
  const doRefresh = (x : boolean)=>{
    setRefresh(x);
    setRefresh(!x);
  }

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
    // if(refresh) setRefresh(false);
  }, [refresh]);




  const refWorkspace = collection(firestore, Tables.Workspaces);
  const {status: statusPrivateWorkspace, data: resPrivateWorkspaces} = useFirestoreCollectionData(query(refWorkspace,
      where(KeyWorkspace.workspaceMembers, 'array-contains', userUid),
  ), {
    idField: 'uid',
  });

  const {status: statusPublicWorkspace, data: resPublicWorkspaces} = useFirestoreCollectionData(query(refWorkspace,
      where(KeyWorkspace.workspaceVisibility, '==', WorkspaceVisibility.Public),
  ), {
    idField: 'uid',
  });


  if (statusPrivateWorkspace === 'loading' || statusPublicWorkspace === 'loading') {
    return <>loading workspace data...</>;
  }
  
  const workspaces = uniqBy(union((resPrivateWorkspaces as Array<TypeWorkspace>), (resPublicWorkspaces as Array<TypeWorkspace>)), 'uid')


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
    notifications,
    workspaces
  });

  return (
    <globalContext.Provider value={{
      auth,
      user,
      users,
      firestore,
      refresh,
      setRefresh: doRefresh,
      history,
      storage,
      notifications,
      workspaces,
    } as typeGlobalContext}>
      {children}
    </globalContext.Provider>
  );
};
