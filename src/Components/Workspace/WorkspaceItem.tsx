import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import { doc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import React from 'react';
import { useFirestoreDocData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeWorkspace } from '../../Model/model';

type props = {
  workspaceUid : string
}

export const WorkspaceItem : React.FC<props> = ({workspaceUid}) => {
  const { firestore, history, setRefresh }= useGlobalContext();

  const refWorkspace = doc(firestore, Tables.Workspaces, workspaceUid);
  const {status: statusWorkspace, data: resWorkspace} = useFirestoreDocData(refWorkspace, {
    idField: 'uid',
  });

  if (statusWorkspace === 'loading') {
    return <div>Loading workspace data..</div>;
  }

  if (!resWorkspace) return null;
  const workspace = resWorkspace as TypeWorkspace;

  const onClickHandle = ()=>{
    console.log('clicked');
    const url = `/workspace/${workspace.uid}`;
    setRefresh(true);
    history.push(url);
  };


  return (
    <IonCard key={nanoid()} onClick={onClickHandle}>
      <IonCardHeader>
        <IonCardTitle>{workspace.workspaceName}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {workspace.workspaceDescription}
      </IonCardContent>
    </IonCard>
  );
};
