/* eslint-disable no-unused-vars */
import { IonButton, IonInput, IonItem, IonItemDivider, IonTitle } from '@ionic/react';
import { doc } from 'firebase/firestore';
import React, { useState } from 'react';
import { useGlobalContext } from '../../../../context/ContextProvider';
import { EnumItemType, Tables } from '../../../../Model/model';
import { useWorkspaceContext } from '../../WorkspaceContext';
import { WorkspaceMemberGetEmail } from './WorkspaceMemberGetEmail';
import { WorkspaceMemberGetLink } from './WorkspaceMemberGetLink';

type props = {

}

export const WorkspaceMemberInvite : React.FC<props> = ({})=>{
  const {firestore} = useGlobalContext();
  const [email, setEmail] = useState('');
  const [submitEmail, setSubmitEmail] = useState(false);
  const {workspace} = useWorkspaceContext();
  // const [getLlink, setGetlink] = useState(false);

  const refWorkspace = doc(firestore, Tables.Workspaces, workspace.uid as string);

  const onSearchEmailHandle = ()=>{
    setSubmitEmail(true);
  };

  // input email,
  return (
    <>
      <IonTitle>
        Invite
      </IonTitle>
      <IonItemDivider>
        By Link : 
        <WorkspaceMemberGetLink itemType={EnumItemType.Workspace} itemRef={refWorkspace} />
      </IonItemDivider>
      <IonItem>
        <IonInput
          type='text'
          value={email}
          onIonChange={(e)=>setEmail(e.detail.value as string)}
          placeholder='email'
        />
        <IonButton onClick={onSearchEmailHandle}>search</IonButton>
      </IonItem>
      <IonItem>
        {
        submitEmail ?
          (<WorkspaceMemberGetEmail itemRef={refWorkspace} itemUid={workspace.uid as string} userEmail={email} />) :
          null
        }
      </IonItem>

    </>
  );
};
