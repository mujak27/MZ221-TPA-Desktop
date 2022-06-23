import { IonCheckbox, IonIcon, IonItem, IonLabel } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { TypeCheckList } from '../../Model/model';

type props = {
  checklist : TypeCheckList,
  index : number,
  onChangeHandle : (index : number, done : boolean)=>void
  onRemoveHandle : (index : number)=>void
}

export const ChecklistItem : React.FC<props> = ({checklist, index, onChangeHandle, onRemoveHandle}) => {
  console.log('checklistitem');
  console.log(checklist);
  const [done] = useState(checklist.checklistDone);

  const onChange = ()=>{
    onChangeHandle(index, !done);
  };

  const onRemove = ()=>{
    onRemoveHandle(index);
  };

  return (
    <>
      <IonItem>
        <IonItem style={{width: '100%'}}>
          <IonCheckbox className='' checked={done} onIonChange={onChange} />
          <IonLabel className='ion-padding-horizontal'>{checklist.checklistName}</IonLabel>
        </IonItem>
        <IonIcon slot='end' onClick={onRemove} icon={trashOutline} />
      </IonItem>
    </>
  );
};
