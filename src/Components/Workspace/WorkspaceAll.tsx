import { IonCol, IonGrid, IonRow, IonTitle } from '@ionic/react';
import { collection, query, where } from 'firebase/firestore';
import { union, uniqBy } from 'lodash';
import { nanoid } from 'nanoid';
import React from 'react';
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { KeyWorkspace, Tables, TypeWorkspace, WorkspaceVisibility } from '../../Model/model';
import './Workspace.css';
import { WorkspaceCreate } from './WorkspaceCreate';
import { WorkspaceItem } from './WorkspaceItem';


const WorkspaceAll = ()=>{
  const globalContext = useGlobalContext();
  const firestore = globalContext.firestore;
  const userUid = globalContext.user.userUid;


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

  const ItemInRow = 6;
  const workspacesJSX = workspaces.map((workspace)=>{
    return (
      <IonCol size={`${12/ItemInRow}`} key={nanoid()}>
        <WorkspaceItem  workspaceUid={workspace.uid as string} />
      </IonCol>
    );
  });

  console.info('========')
  const workspaceJsxChunkGenerator = ()=>{
    const source = workspacesJSX;
    const res : Array<JSX.Element> = [];
    console.info(source.length);
    for(let i=0; i < source.length; i+=ItemInRow){
      const chunk = source.slice(i, i+ItemInRow);
      res.push((
        <IonRow>
          {(chunk)}
        </IonRow>
      ))
    }
    return res;
  }
  const workspaceJsxChunk = workspaceJsxChunkGenerator();

  return (
    <>
      <IonTitle size='large'>Workspaces</IonTitle>
      <WorkspaceCreate />
      {/* <div className='flexContainer'> */}
        {/* {
          workspaces.map((workspace)=>{
            return (<WorkspaceItem key={nanoid()} workspaceUid={workspace.uid as string} />);
          })
        } */}
        <IonGrid>
          {workspaceJsxChunk}
        </IonGrid>
      {/* </div> */}
    </>
  );
};

export { WorkspaceAll };

