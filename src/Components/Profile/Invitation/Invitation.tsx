import { nanoid } from 'nanoid';
import React from 'react';
import { useGlobalContext } from '../../../context/ContextProvider';
import { EnumItemType } from '../../../Model/model';
import { InvitationItemBoard } from './InvitationItemBoard';
import { InvitationItemWorkspace } from './InvitationItemWorkspace';


type props = {
}

export const Invitation : React.FC<props> = ({}) => {
  const {user} = useGlobalContext();
  const userInvitations = user.userInvitation;

  return (
    <>
      invitation
      {
        userInvitations.map((invitation)=>{
          if(invitation.invitationType == EnumItemType.Workspace) 
            return (<InvitationItemWorkspace key={nanoid()} invitation={invitation} />);
          return (<InvitationItemBoard key={nanoid()} invitation={invitation} />);
        })
      }
    </>
  );
};
