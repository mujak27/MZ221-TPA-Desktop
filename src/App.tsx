import {
  IonApp, IonRouterOutlet,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
// import Tab1 from './pages/Tab1';
// import Tab2 from './pages/Tab2';
// import Tab3 from './pages/Tab3';
// import Details from './pages/Details';
// IONIC AND STYLING
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/typography.css';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import React from 'react';
import {
  Route,
} from 'react-router-dom';
import { AuthProvider, FirestoreProvider, useFirebaseApp } from 'reactfire';
/* Global CSS */
import './global.css';
import { Login } from './Pages/Login';
import { Main } from './Pages/Main';
import { Register } from './Pages/Register';
import './style/style.css';
/* Theme variables */
import './theme/variables.css';

const App = () => {
  return (
    <FirestoreProvider sdk={getFirestore(useFirebaseApp())}>
      <AuthProvider sdk={getAuth(useFirebaseApp())}>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route path="/login" component={Login} exact={true} />
              <Route path="/register" component={Register} exact={true}/>
              <Route component={Main} />
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </AuthProvider >
    </FirestoreProvider>
  );
};

export default App;
