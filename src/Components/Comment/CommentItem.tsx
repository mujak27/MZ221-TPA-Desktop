import { IonButton, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonListHeader, IonText } from '@ionic/react';
import { addDoc, collection, doc, writeBatch } from 'firebase/firestore';
import { union, uniq } from 'lodash';
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { useGlobalContext } from '../../context/ContextProvider';
import { GetUserName } from '../../Model/GetUserName';
import { GetUserNameByKey } from '../../Model/GetUserNameByKey';
import { Tables, TypeCard, TypeComment, TypeCommentReply, TypeNotification } from '../../Model/model';
import { useBoardContext } from '../Board/BoardContext';
import { useWorkspaceContext } from '../Workspace/WorkspaceContext';

type props = {
  card : TypeCard
  comment : TypeComment
}

export const CommentItem : React.FC<props> = ({comment, card}) => {
  const {firestore, user} = useGlobalContext();
  const {workspace} = useWorkspaceContext();
  const {board } = useBoardContext();
  
  const [replies, setReplies] = useState<Array<TypeCommentReply>>(comment.commentReplies);
  const [reply, setReply] = useState('');

  const onSubmitReply = async ()=>{

    const newReplies = ([
      ...replies,
      {
        replyValue : reply,
        userUid : user.uid as string
      } as TypeCommentReply
    ])
    setReplies(newReplies);
    
    const newUserUids = uniq(union(comment.userUids, user.uid as string))

    const refComment = doc(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Cards, card.uid as string, Tables.Comments, comment.uid as string);

    const batch = writeBatch(firestore);
    batch.update(refComment, {
      userUids : newUserUids,
      commentReplies : newReplies,
    } as TypeComment);
    await batch.commit();

    let userGetNotif = uniq(union(card.cardWatchers, comment.commentMentions, comment.userUids))
    console.info('notified');
    console.info(userGetNotif);
    userGetNotif.forEach((user_uid)=>{
      if(user_uid == user.userUid) return;
      const refUser = collection(firestore, Tables.Users, user_uid, Tables.Notifications);
      addDoc(refUser, {
        notificationValue : `${user.userName} has replied to card ${card.cardTitle} with '${reply}'`
      } as TypeNotification)
    })
    setReply('');
  }

  return (
    <>
      <IonItemDivider />
        <IonText>
          <GetUserName userUid={comment.commentOwnerUid} /> :
          {
            comment.commentMentions.map((mention)=>{
              return (<>
                @<GetUserName userUid={mention} />,
              </>)
            })
          }
          {comment.commentValue};
        </IonText>
        <IonList>
          <IonListHeader>replies:</IonListHeader>
          {
            comment.commentReplies.map((reply)=>{
              return (
                <IonItem key={nanoid()}>
                  <GetUserNameByKey userUid={reply.userUid} /> : <IonText>{reply.replyValue}</IonText>
                </IonItem>
              )
            })
          }
        </IonList>
        <IonItem>
          <IonLabel>reply this comment:</IonLabel>
          <IonInput
            value={reply}
            onIonChange={e=>setReply(e.detail.value as string)}
          />
          <IonButton onClick={onSubmitReply}>
              submit
          </IonButton>
        </IonItem>
    </>
  );
};
