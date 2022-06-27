import { collection } from 'firebase/firestore';
import moment from 'moment';
import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useFirestoreCollectionData } from 'reactfire';
import { useGlobalContext } from '../../../context/ContextProvider';
import { Tables, TypeCard } from '../../../Model/model';
import { useWorkspaceContext } from '../../Workspace/WorkspaceContext';
import { useBoardContext } from '../BoardContext';

const localizer = momentLocalizer(moment)

type props = {
}

export const BoardCalendar : React.FC<props> = ({}) => {
  const {firestore} = useGlobalContext();
  const {workspace} = useWorkspaceContext();
  const {board} = useBoardContext();


  const refCards = collection(firestore, Tables.Workspaces, workspace.uid as string, Tables.Boards, board.uid as string, Tables.Cards);
  const {status, data} = useFirestoreCollectionData(refCards, {
    idField: 'uid'
  });

  if(status === 'loading') {
    return <>'loading cards...'</>
  }

  const cards = data as Array<TypeCard>;
  const calendarCards = cards.map((card, index)=>{
    return {
      id: index,
      title: card.cardTitle,
      start: new Date(card.cardDate),
      end: new Date(card.cardDate),
    }
  })

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={calendarCards}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  )
}