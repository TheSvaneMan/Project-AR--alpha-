import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
} from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function SignInPage() {
    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    const auth = getAuth();

    function handleSubmit(event: any) {
        event.preventDefault();
        signInWithEmailAndPassword(auth, mail, password)
            .then(userCredential => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
            })
            .catch(error => {
                console.log(error);
            });
    }

    // --------- Handle OnChangeEvents ------------- //
    function handleSetMail(event: any) {
        setMail(event.currentTarget.value);
    }

    function handleSetPassword(event: any) {
        setPassword(event.currentTarget.value);
    }

    return (
        <IonPage className="posts-page">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Sign In</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <form onSubmit={handleSubmit}>
                    <IonItem>
                        <IonLabel position="stacked">Mail</IonLabel>
                        <IonInput
                            value={mail}
                            type="email"
                            placeholder="Type your mail"
                            onIonChange={e => handleSetMail(e)}
                        />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Password</IonLabel>
                        <IonInput
                            value={password}
                            type="password"
                            placeholder="Type your password"
                            onIonChange={e => handleSetPassword(e)}
                        />
                    </IonItem>
                    <div className="ion-padding">
                        <IonButton type="submit" expand="block">
                            Sign in
                        </IonButton>
                    </div>
                    <div className="ion-text-center">
                        <IonButton size="small" fill="clear" onClick={() => history.replace("/signup")}>
                            Sign Up
                        </IonButton>
                    </div>
                </form>
            </IonContent>
        </IonPage>
    );
}