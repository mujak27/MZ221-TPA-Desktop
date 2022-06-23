import { IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React from 'react';
import { Route } from 'react-router';
import { WorkspaceAll } from '../Components/Workspace/WorkspaceAll';
import { WorkspaceContext } from '../Components/Workspace/WorkspaceContext';
import { WorkspaceRoute } from '../Components/Workspace/WorkspaceRoute';

const Workspace = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path='/workspace/:workspaceUid'>
          <WorkspaceContext>
            <WorkspaceRoute/>
          </WorkspaceContext>
        </Route>
        <Route path='/workspace' component={WorkspaceAll} exact={true}/>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export { Workspace };
