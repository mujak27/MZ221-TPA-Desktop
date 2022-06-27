import { IonButton, IonContent, IonHeader, IonItem, IonText, IonTitle } from '@ionic/react';
import { doc, writeBatch } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Redirect } from 'react-router';
import { useGlobalContext } from '../../../context/ContextProvider';
import { Tables, TypeGroup } from '../../../Model/model';
import { GroupItem } from '../../Group/GroupItem';
import '../../style.css';
import { useWorkspaceContext } from '../../Workspace/WorkspaceContext';
import { useBoardContext } from '../BoardContext';
import { BoardCreateGroup } from '../BoardCreateGroup';
import { BoardCalendar } from './BoardCalendar';
import { BoardLeave } from './BoardLeave';
import { BoardLogs } from './BoardLogs';
import { BoardMember } from './BoardMember/BoardMember';
import { BoardSettings } from './BoardSettings';

type props = {
}

export const BoardDetail : React.FC<props> = ({}) => {
  const {firestore, history, setRefresh} = useGlobalContext();
  const {workspace} = useWorkspaceContext();
  const {board, userBoard} = useBoardContext();
  const {groups: groupContext } = useBoardContext();

  enum tabs {
    Kanban = 'Kanban',
    Calendar = 'Calendar',
  }

  const [tab, setTab] = useState(tabs.Kanban);
  const [showMember, setShowMember] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLeave, setShowLeave] = useState(false);
  const [boardGroupUidsOrder] = useState(board.boardGroupUids);
  const [groups, setGroups] = useState(boardGroupUidsOrder.map((groupUid)=>{
    const temp = groupContext.filter((_group)=>{
      return _group.uid == groupUid;
    });
    return temp[0];
  }));


  useEffect(()=>{
  }, [groups]);

  if(board == undefined){
    history.push('/workspace');
    setRefresh(true);
    return <Redirect to={'/workspace' + workspace.uid as string} />
  }

  const onDragEnd = async (result : DropResult)=>{
    const {destination, source, draggableId} = result;
    if (!destination) return;

    if (
      destination.droppableId == source.droppableId &&
      destination.index == source.index
    ) return;

    const card = draggableId;
    const sourceIndex = source.index;
    const sourceGroup = boardGroupUidsOrder[source.droppableId as unknown as number];
    const sourceGroupCards = groups[source.droppableId as unknown as number].groupCardUids;
    const destIndex = destination.index;
    const destGroup = boardGroupUidsOrder[destination.droppableId as unknown as number];
    const destGroupCards = groups[destination.droppableId as unknown as number].groupCardUids;

    if (destination.droppableId == source.droppableId) {
      const newDestGroupCards = Array.from(destGroupCards);
      newDestGroupCards.splice(destIndex, 0, card);
      const index = destIndex <= sourceIndex ? sourceIndex+1 : sourceIndex;
      newDestGroupCards.splice(index, 1);

      const newGroups = Array.from(groups);
      newGroups[destination.droppableId as unknown as number].groupCardUids = newDestGroupCards;
      setGroups(newGroups);

      try {
        const batch2 = writeBatch(firestore);
        const refDestGroup = doc(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Groups, destGroup);
        batch2.update(refDestGroup, {
          groupCardUids: newDestGroupCards,
        } as TypeGroup);
        await batch2.commit();
      } catch (e) {
        alert(e);
      }
    } else {
      const newDestGroupCards = Array.from(destGroupCards);
      newDestGroupCards.splice(destIndex, 0, card);
      const newSourceGroupCards = Array.from(sourceGroupCards);
      newSourceGroupCards.splice(sourceIndex, 1);

      const newGroups = Array.from(groups);
      newGroups[source.droppableId as unknown as number].groupCardUids = newSourceGroupCards;
      newGroups[destination.droppableId as unknown as number].groupCardUids = newDestGroupCards;
      setGroups(newGroups);

      try {
        const batch1 = writeBatch(firestore);
        const refSourceGroup = doc(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Groups, sourceGroup);
        batch1.update(refSourceGroup, {
          groupCardUids: newSourceGroupCards,
        } as TypeGroup);
        await batch1.commit();
        const batch2 = writeBatch(firestore);
        const refDestGroup = doc(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Groups, destGroup);
        batch2.update(refDestGroup, {
          groupCardUids: newDestGroupCards,
        } as TypeGroup);
        await batch2.commit();
      } catch (e) {
        alert(e);
      }
    }
  };

  return (
    <>
      <IonHeader>
        <IonItem>
          <IonTitle size='large'>
          <h1>{board.boardName}</h1>
          </IonTitle>
          <BoardLogs showModal={showLogs} setShowModal={setShowLogs} />
          {userBoard ? 
            <BoardLeave showModal={showLeave} setShowModal={setShowLeave} />:
            null
          }
          {userBoard && userBoard.isAdmin ?
            (
              <>
                <BoardMember showModal={showMember} setShowModal={setShowMember} />
                <BoardSettings showModal={showSettings} setShowModal={setShowSettings} />
              </>
            ):null
          }
        </IonItem>
      </IonHeader>
      <IonContent className='groupParentContainer'>
        <IonTitle><h3>Description</h3></IonTitle>
        <IonText className='ion-padding-start'>{board.boardDescription}</IonText>
        <IonItem>
          <IonTitle>View mode : </IonTitle>
          <IonButton onClick={()=>setTab(tabs.Kanban)}>kanban</IonButton>
          <IonButton onClick={()=>setTab(tabs.Calendar)}>calendar</IonButton>
        </IonItem>
        {
          tab == tabs.Kanban ?
          (
            <div className='groupContainer'>
              <DragDropContext onDragEnd={onDragEnd}>
                {
                  groups.map((group, groupIndex)=>{
                    return (
                      <GroupItem key={nanoid()} group={group} groupIndex={groupIndex.toString()} />
                    )
                  })
                }
              </DragDropContext>
              <BoardCreateGroup />
            </div>
          ) : (<BoardCalendar/>)
        }
      </IonContent>
    </>
  );
};
