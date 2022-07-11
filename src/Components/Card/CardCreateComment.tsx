import { IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';
import { addDoc, collection } from 'firebase/firestore';
import { union, uniq } from 'lodash';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeCard, TypeComment, TypeNotification } from '../../Model/model';
import { useBoardContext } from '../Board/BoardContext';
import { useWorkspaceContext } from '../Workspace/WorkspaceContext';

type props = {
  card : TypeCard
}

export const CardCreateComment : React.FC<props> = ({card}) => {
  const {firestore, user} = useGlobalContext();
  const {workspace} = useWorkspaceContext();
  const {board} = useBoardContext();

  const [value, setValue] = useState('');

  
  // const tags = boardMembers.map((boardMember, index)=>{
  //   return {
  //     id : index.toString(),
  //     display : boardMember.userName as string
  //   }
  // })
  
  const onSubmitHandle = async () =>{
    
    console.info(value);
  
    const refComments = collection(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Cards, card.uid as string, Tables.Comments);
    await addDoc(refComments, {
      userUids : [user.userUid],
      commentMentions : [],
      commentOwnerUid : user.userUid,
      commentReplies : [],
      commentValue : value,
    } as TypeComment)
    console.info(refComments);


    let userGetNotif = uniq(union(card.cardWatchers));
    console.info(userGetNotif);
    userGetNotif.forEach((user_uid)=>{
      if(user_uid == user.userUid) return;
      const refUser = collection(firestore, Tables.Users, user_uid, Tables.Notifications);
      addDoc(refUser, {
        notificationValue : `${user.userName} has commented to card ${card.cardTitle} with '${value}'`
      } as TypeNotification)
    });
  };

  return (
    <>
      <IonItem>
        <IonLabel>input comment:</IonLabel>
        <IonInput
          type='text'
          placeholder="Name"
          value={value}
          onIonChange={(e)=>setValue(e.detail.value as string)}/>
        {/* <MentionsInput
          style={{width : '60%', border : '0', outline:'0'}}
          singleLine={false}
          value={value}
          onChange={e=>setValue(e.target.value)}
        >
          <Mention trigger="@" data={tags}  />
        </MentionsInput> */}
        <IonButton onClick={onSubmitHandle}>create</IonButton>
      </IonItem>
    </>
  );
};
