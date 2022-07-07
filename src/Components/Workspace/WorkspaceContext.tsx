import { doc } from 'firebase/firestore';
import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router';
import { useFirestoreDocData } from 'reactfire';
import { useGlobalContext } from '../../context/ContextProvider';
import { Tables, TypeWorkspace, WorkspaceVisibility } from '../../Model/model';

type TypeWorkspaceContext = {
  workspace : TypeWorkspace,
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
    workspaceBoardUids: [], 
    workspaceAdmins: [],
  } as TypeWorkspace,
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
  // const refWorkspace = doc(firestore, ...[...workspacePath]);
  const {status: statusWorkspace, data: resWorkspace} = useFirestoreDocData(refWorkspace, {
    idField: 'uid',
  });

  if (statusWorkspace === 'loading' ) {
    return <div>checking authorization...</div>;
  }

  if (!resWorkspace) {
    return <div>inalid url or you do not have access to the workspace</div>;
  }


  const workspace = resWorkspace as TypeWorkspace;

  workspaceContext = createContext<TypeWorkspaceContext>({workspace});

  if(workspace.workspaceVisibility == WorkspaceVisibility.Workspace && !workspace.workspaceMembers.includes(user.userUid))
    return <>you do not have the access to this workspace..</>

  return (
    <>
      {children}
    </>
  );
};
