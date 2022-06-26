import { IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React from 'react';
import { Route } from 'react-router';
import { BoardContext } from '../Board/BoardContext';
import { BoardDetail } from '../Board/BoardDetail/BoardDetail';
import { WorkspaceDetail } from './WorkspaceDetail/WorkspaceDetail';


type props = {

}

export const WorkspaceRoute : React.FC<props> = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet id='main'>
        <Route path='/workspace/:workspaceUid/board/:boardUid'>
          <BoardContext>
            <BoardDetail />
          </BoardContext>
        </Route>
        <Route path='/workspace/:workspaceUid'>
          <WorkspaceDetail/>
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
    // <div>
    // </div>
  );
};
