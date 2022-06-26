import { IonButton, IonCard, IonCardContent, IonCardTitle, IonIcon } from '@ionic/react';
import { deleteDoc, doc } from 'firebase/firestore';
import { close } from 'ionicons/icons';
import { nanoid } from 'nanoid';
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeGroup } from '../../Model/model';
import { useBoardContext } from '../Board/BoardContext';
import { CardItem } from '../Card/CardItem';
import '../style.css';
import { useWorkspaceContext } from '../Workspace/WorkspaceContext';
import { GroupCreateCard } from './GroupCreateCard';

type props = {
  group : TypeGroup
  groupIndex : string
}


const Container = styled.div`
`;
const TaskList = styled.div`
`;

export const GroupItem : React.FC<props> = ({group, groupIndex: index}) => {
  const {firestore, setRefresh} = useGlobalContext();
  const {workspace} = useWorkspaceContext();
  const {board} = useBoardContext();


  const onDelete = async ()=>{
    const refGroup = doc(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Groups, group.uid as string);
    await deleteDoc(refGroup);
    setRefresh(true);
  }

  if(!group) return null;

  return (
    <Container>
      <IonCard className='ion-padding groupItem'>
        <IonCardTitle>
          <IonButton onClick={onDelete}>
            <IonIcon icon={close}  style={{padding:'0 !important'}}/>
          </IonButton>
          {group.groupName}
        </IonCardTitle>
        <IonCardContent>
          {<GroupCreateCard group={group}/>}
          <Droppable droppableId={index}>
            { (provided) =>{
              return (
                <TaskList ref={provided.innerRef} {...provided.droppableProps} >
                  {group.groupCardUids.map((cardUid, cardIndex)=>{
                    return (
                      <CardItem key={nanoid()} cardUid={cardUid} index={cardIndex}/>
                    );
                  })}
                </TaskList>
              );
            }}
          </Droppable>
        </IonCardContent>
      </IonCard>
    </Container>
  );
};
