import { IonContent, IonHeader, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React, { useEffect } from 'react';
import { Redirect, Route, useLocation } from 'react-router';
import { useSigninCheck } from 'reactfire';
import { Navbar } from '../Components/Navigations/Navbar';
import { SideNav } from '../Components/Navigations/SideNav';
import { ContextProvider } from '../context/ContextProvider';
import { Home } from './Home';
import { Profile } from './Profile';
import { Workspace } from './Workspace';


const Main = () => {
  const {status, data: useSigninCheckResult} = useSigninCheck();

  useEffect(()=>{
    ('MAIN CHANGE DETECTED');
  }, [useLocation()]);

  if (status=='loading') {
    return (
      <div>checking authentication...</div>
    );
  }

  if (useSigninCheckResult.signedIn !== true) {
    return (
      <Redirect to="/Login" />
    );
  }

  return (
    <ContextProvider>
      <IonHeader>
        <Navbar />
      </IonHeader>
      <IonContent>
        <IonSplitPane contentId='main'>
          <SideNav />
          <IonReactRouter>
            <IonRouterOutlet id='main' className='ion-margin ion-padding'>
              <Route path='/profile/:profileId' component={Profile} exact={true} />
              <Route path='/workspace' component={Workspace} />
              <Route path='/home' component={Home} exact={true} />
              <Redirect exact from='/' to='/home' />
            </IonRouterOutlet>
          </IonReactRouter>
        </IonSplitPane>
      </IonContent>
    </ContextProvider>
  );
};

export { Main };

