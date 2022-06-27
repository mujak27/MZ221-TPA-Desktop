import { doc } from 'firebase/firestore';
import React from 'react';
import { useParams } from 'react-router';
import { useFirestoreDocData } from 'reactfire';
import { JoinBoard } from '../Components/join/JoinBoard';
import { JoinWorkspace } from '../Components/join/JoinWorkspace';
import { useGlobalContext } from '../context/ContextProvider';
import { EnumItemType, Tables, TypeInvitationLink } from '../Model/model';

export const Join = () => {
  const {firestore} = useGlobalContext();
  const joinUid = (useParams() as any).joinId;

  const refInvitationLink = doc(firestore, Tables.InvitationLink, joinUid);
  const {status: statusInvitationLink, data: resInvitationLink} = useFirestoreDocData(refInvitationLink, {
    idField: 'uid',
  });

  if (statusInvitationLink === 'loading') {
    return <>fetching data...</>;
  }

  if (!resInvitationLink) return <>invalid link</>;


  const invitationLink = resInvitationLink as TypeInvitationLink;

  const date = new Date;
  date.setDate(date.getDate()+7);

  if ((new Date).getTime() > invitationLink.InvitationExpired) return <>this link is expired</>;

  if (invitationLink.InvitationType == EnumItemType.Workspace) {
    return (<JoinWorkspace refWorkspace={invitationLink.refItem}/>);
  }
  return (<JoinBoard refBoard={invitationLink.refItem}/>);
};

