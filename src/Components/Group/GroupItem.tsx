import { IonCard, IonCardContent, IonCardTitle } from '@ionic/react';
import { doc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { useFirestoreDocData } from 'reactfire';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeGroup } from '../../Model/model';
import { useBoardContext } from '../Board/BoardContext';
import { CardItem } from '../Card/CardItem';
import '../style.css';
import { useWorkspaceContext } from '../Workspace/WorkspaceContext';
import { GroupCreateCard } from './GroupCreateCard';

type props = {
  groupUid : string
  groupIndex : number
}


const Container = styled.div`
`;
const TaskList = styled.div`
`;

export const GroupItem : React.FC<props> = ({groupUid, groupIndex: index}) => {
  const firestore = useGlobalContext().firestore;
  const {workspace} = useWorkspaceContext();
  const {board} = useBoardContext();
  const refGroup = doc(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Groups, groupUid);
  const {status: statusGroup, data: resGroup} = useFirestoreDocData(refGroup, {
    idField: 'uid',
  });

  if (statusGroup == 'loading') {
    return <IonCard><IonCardTitle>loading...</IonCardTitle></IonCard>;
  }

  const group = resGroup as TypeGroup;

  return (
    <Container>
      <IonCard className='ion-padding groupItem'>
        <IonCardTitle>
          {group.groupName}
        </IonCardTitle>
        <IonCardContent>
          {<GroupCreateCard group={group}/>}
          <Droppable droppableId={index as unknown as string}>
            { (provided) =>{
              return (
                <TaskList ref={provided.innerRef} {...provided.droppableProps}>
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
