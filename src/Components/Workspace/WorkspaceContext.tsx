import { collection, doc, query } from 'firebase/firestore';
import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router';
import { useFirestoreCollectionData, useFirestoreDocData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeMember, TypeWorkspace, WorkspaceVisibility } from '../../Model/model';

type TypeWorkspaceContext = {
  workspace : TypeWorkspace,
  userWorkspace : TypeMember,
  workspaceMembers : Array<TypeMember>
}

let workspaceContext = createContext<TypeWorkspaceContext>({
  workspace: {
    workspaceName: '',
    workspaceDescription: '',
    workspaceMembers: [],
    workspaceVisibility: WorkspaceVisibility.Workspace,
    workspaceCreatedDate: 0,
    workspaceDeleteRequest: [],
    workspaceLogs: [],
  } as TypeWorkspace,
  userWorkspace: {
    isAdmin: false,
    isOwner: false,
    userUid: '',
  } as TypeMember,
  workspaceMembers : [],
});

export const useWorkspaceContext = ()=>{
  return useContext(workspaceContext);
};


type props = {
  children : React.ReactNode | React.ReactNode[]
}

export const WorkspaceContext : React.FC<props> = ({children}) => {
  const {firestore, user} = useGlobalContext();

  const {workspaceUid} = useParams() as {workspaceUid : string};

  const refWorkspace = doc(firestore, Tables.Workspaces, workspaceUid);
  const {status: statusWorkspace, data: resWorkspace} = useFirestoreDocData(refWorkspace, {
    idField: 'uid',
  });

  const refMember = collection(firestore, Tables.Workspaces, workspaceUid, Tables.Members);
  const {status: statusMember, data: resMembers} = useFirestoreCollectionData(query(
      refMember,
  ), {
    idField: 'uid'
  });


  if (statusWorkspace === 'loading' || statusMember === 'loading') {
    return <div>checking authorization...</div>;
  }

  if (!resWorkspace) {
    return <div>inalid url or you do not have access to the workspace</div>;
  }

  const workspace = resWorkspace as TypeWorkspace;
  const members = (resMembers as Array<TypeMember>);
  const userWorkspace = members.filter((member)=>{
    return member.userUid==(user.userUid as string)
  })[0];
  workspaceContext = createContext<TypeWorkspaceContext>({workspace, userWorkspace: userWorkspace, workspaceMembers: members });

  return (
    <>
      {children}
    </>
  );
};
