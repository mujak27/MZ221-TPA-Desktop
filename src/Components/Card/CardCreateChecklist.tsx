import { IonButton, IonInput, IonItem } from '@ionic/react';
import React, { useState } from 'react';

type props = {
    onAddHandle : (checklistName : string)=>void
}

export const CardCreateChecklist : React.FC<props> = ({onAddHandle}) => {
  const [name, setName] = useState('');

  const onSubmitHandle = async () =>{
    onAddHandle(name);
    setName('');
  };

  return (
    <>
      <IonItem>
        <IonInput
          type='text'
          placeholder="Name"
          value={name}
          onIonChange={(e)=>setName(e.detail.value as string)}/>
        <IonButton onClick={onSubmitHandle}>create</IonButton>
      </IonItem>
    </>
  );
};
