import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { person, map, camera, settings, addCircle, images } from 'ionicons/icons';
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";


/* Main Pages */
import ARTab from './pages/ARTab';
import Collection from './pages/Collection';
import Profile from './pages/Profile';
import Map from './pages/Map';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import AddPost from './pages/AddPost';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

function PrivateRoutes() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path='/artab' exact>
          <ARTab />
        </Route>
        <Route path='/map' exact >
          <Map />
        </Route>
        <Route path='/profile'>
          <Profile />
        </Route>
        <Route path='/addpost' exact>
          <AddPost />
        </Route>
        <Route path='/collection' exact>
          <Collection />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="artab" href="/artab">
          <IonIcon icon={camera} />
          <IonLabel>AR camera</IonLabel>
        </IonTabButton>
        <IonTabButton tab="collection" href="/collection">
          <IonIcon icon={images} />
          <IonLabel>Collection</IonLabel>
        </IonTabButton>
        <IonTabButton tab="addpost" href="/addpost">
          <IonIcon class='addCircle' icon={addCircle} />
          <IonLabel>Add post</IonLabel>
        </IonTabButton>
        <IonTabButton tab="map" href="/map">
          <IonIcon icon={map} />
          <IonLabel>Map</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href='/profile/posts'>
          <IonIcon icon={person} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

function PublicRoutes() {
  return (
    <IonRouterOutlet>
      <Route exact path="/signin">
        <SignInPage />
      </Route>
      <Route exact path="/signup">
        <SignUpPage />
      </Route>
    </IonRouterOutlet>
  )
}

export default function App() {
  const [userIsAuthenticated, setUserIsAuthenticated] = useState<any>(localStorage.getItem("userIsAuthtenticated"));
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        console.log(user);
        // User is authenticated
        setUserIsAuthenticated(true);
        localStorage.setItem("userIsAuthenticated", "true");
      } else {
        // User is signed out
        setUserIsAuthenticated(false);
        localStorage.removeItem("userIsAuthenticated");
      }
    });
  }, [auth]);

  return (
    <IonApp>
      <IonReactRouter>
        {userIsAuthenticated ? <PrivateRoutes /> : <PublicRoutes />}
        <Route>{userIsAuthenticated ? <Redirect to="/map" /> : <Redirect to="/signin" />}</Route>
      </IonReactRouter>
    </IonApp>
  );
}

