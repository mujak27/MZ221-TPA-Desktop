import { IonTitle } from '@ionic/react';
import { collection, query, where } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import React from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { KeyWorkspace, Tables, TypeWorkspace } from '../../Model/model';
import './Workspace.css';
import { WorkspaceCreate } from './WorkspaceCreate';
import { WorkspaceItem } from './WorkspaceItem';


const WorkspaceAll = ()=>{
  const globalContext = useGlobalContext();
  const firestore = globalContext.firestore;
  const userUid = globalContext.user.userUid;


  const refWorkspace = collection(firestore, Tables.Workspaces);
  const {status: statusWorkspace, data: resWorkspaces} = useFirestoreCollectionData(query(refWorkspace,
      where(KeyWorkspace.workspaceMembers, 'array-contains', userUid),
  ), {
    idField: 'uid',
  });


  if (statusWorkspace === 'loading') {
    return <>loading workspace data...</>;
  }

  const workspaces = resWorkspaces as Array<TypeWorkspace>;

  return (
    <>
      <IonTitle size='large'>Workspaces</IonTitle>
      <WorkspaceCreate />
      <div className='flexContainer'>
        {
          workspaces.map((workspace)=>{
            return (<WorkspaceItem key={nanoid()} workspaceUid={workspace.uid as string} />);
          })
        }
      </div>
    </>
  );
};

export { WorkspaceAll };

