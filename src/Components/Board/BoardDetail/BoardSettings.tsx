import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonSelect, IonSelectOption, IonTitle } from '@ionic/react';
import { deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { checkmarkCircle, closeCircle, settings } from 'ionicons/icons';
import { uniq } from 'lodash';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { useGlobalContext } from '../../../context/ContextProvider';
import { BoardVisibility, Tables, TypeBoard, WorkspaceVisibility } from '../../../Model/model';
import { useWorkspaceContext } from '../../Workspace/WorkspaceContext';
import { useBoardContext } from '../BoardContext';

type props = {
  showModal : boolean,
  setShowModal : React.Dispatch<React.SetStateAction<boolean>>,
}

export const BoardSettings : React.FC<props> = ({showModal, setShowModal}) => {
  const {firestore, user, setRefresh, history}= useGlobalContext();
  const {workspace} = useWorkspaceContext();
  const {board, boardMembers} = useBoardContext();

  const [name, setName] = useState(board.boardName);
  const [description, setDescription] = useState(board.boardDescription);
  const [visibility, setVisibility] = useState(board.boardVisibility);

  const refBoard = doc(firestore, Tables.Boards, board.uid as string);
  const boardAdmins = boardMembers.filter((boardMember)=>{
    if(boardMember.isAdmin) return true;
    return false;
  });
  const boardAdminUids = boardAdmins.map((boardAdmin)=>{
    return boardAdmin.userUid
  })


  const onDelete = async ()=>{
    let deleteRequest = [...board.boardDeleteRequest, user.userUid];
    deleteRequest = uniq(deleteRequest);
    const adminNotApproved = boardAdminUids.filter((adminUids)=>{
      if(deleteRequest.includes(adminUids)) return false;
      return true;
    })
    if(adminNotApproved.length == 0){
      deleteDoc(refBoard);
      alert('board deleted!');
      setRefresh(true);
      history.push('/workspace' + workspace.uid as string);
    }else{
      if(board.boardDeleteRequest.includes(user.userUid)) return;
      const batch = writeBatch(firestore);
      batch.update(refBoard, {
        boardDeleteRequest: deleteRequest,
        boardLogs:[
          ...board.boardLogs,
          `admin ${user.userName} has requested to delete board!`
        ]
      } as TypeBoard);
      await batch.commit();
      alert('announcement made');
    }
  };

  const onSave = async ()=>{
    try {
      const batch = writeBatch(firestore);
      const refBoard = doc(firestore, Tables.Boards, board.uid as string);
      batch.update(refBoard, {
        boardName: name,
        boardDescription: description,
        boardVisibility: visibility,
      } as TypeBoard);
      await batch.commit();
      setRefresh(true);
      alert('new settings saved');
    } catch (e) {
      alert('failed updating');
    }
  };

  return (
    <>
      <IonButton color="primary" onClick={()=>setShowModal(true)}>
        <IonIcon slot="icon-only" icon={settings} />
      </IonButton>
      <IonModal isOpen={showModal} onDidDismiss={()=>setShowModal(false)}>
        <IonItem>
          <IonButton onClick={()=>setShowModal(false)}>
            <IonIcon icon={closeCircle} />
          </IonButton>
          <IonTitle size='large'>settings for {board.boardName}</IonTitle>
        </IonItem>
        <IonContent>
          <IonItem>
            <IonLabel position='fixed'>Name</IonLabel>
            <IonInput
              type='text'
              value={name}
              onIonChange={((e)=>{
                setName(e.detail.value as string);
              })}
            />
          </IonItem>
          <IonItem>
            <IonLabel position='fixed'>
              Visibility
            </IonLabel>
            <IonSelect
              interface='popover'
              value={visibility}
              onIonChange={(e)=>{
                setVisibility(e.detail.value);
              }}
            >
              {
                Object.keys(BoardVisibility).map((visibility)=>{
                  if(workspace.workspaceVisibility == WorkspaceVisibility.Workspace && visibility==BoardVisibility.Public) return null;
                  return (
                    <IonSelectOption
                      key={nanoid()}
                      value={visibility}
                    >{visibility}</IonSelectOption>);
                })
              }
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position='fixed'>Description</IonLabel>
            <IonInput
              type='text'
              value={description}
              onIonChange={((e)=>{
                setDescription(e.detail.value as string);
              })}
            />
          </IonItem>
          <IonButton onClick={onSave}>
            save
          </IonButton>
          <IonItem>
            <IonTitle className='ion-text-center'>
            Delete Board {board.boardName}?
            </IonTitle>
            <IonItem style={{width: '100%'}}>
              <IonButton color='primary' onClick={()=>setShowModal(false)}>
                <IonIcon icon={closeCircle} />
              </IonButton>
              <IonButton color='danger' onClick={onDelete}>
                <IonIcon icon={checkmarkCircle} />
              </IonButton>
            </IonItem>
          </IonItem>
        </IonContent>
      </IonModal>
    </>
  );
};
