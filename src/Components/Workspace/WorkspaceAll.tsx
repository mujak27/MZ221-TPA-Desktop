import { IonCol, IonGrid, IonRow, IonTitle } from '@ionic/react';
import { nanoid } from 'nanoid';
import React from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import './Workspace.css';
import { WorkspaceCreate } from './WorkspaceCreate';
import { WorkspaceItem } from './WorkspaceItem';


const WorkspaceAll = ()=>{
  const {workspaces} = useGlobalContext();

  const ItemInRow = 6;
  const workspacesJSX = workspaces.map((workspace)=>{
    return (
      <IonCol size={`${12/ItemInRow}`} key={nanoid()}>
        <WorkspaceItem  workspaceUid={workspace.uid as string} />
      </IonCol>
    );
  });

  const workspaceJsxChunkGenerator = ()=>{
    const source = workspacesJSX;
    const res : Array<JSX.Element> = [];
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

