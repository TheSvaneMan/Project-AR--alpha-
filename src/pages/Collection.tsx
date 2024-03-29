import { IonContent, IonHeader, IonList, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, useIonLoading, useIonViewWillEnter } from "@ionic/react";
import { useState, useEffect } from "react";
import PostListItem from "../components/Post";
import { postsRef, usersRef } from "../firebase-config";
import { onValue, get } from "firebase/database";
import './Collection.css';

const Collection = () => {
    const [posts, setPosts] = useState<any>([]);

    async function getUsers() {
        const snapshot = await get(usersRef);
        const usersArray: any[] = [];
        snapshot.forEach(postSnapshot => {
            const id = postSnapshot.key;
            const data = postSnapshot.val();
            const post = {
                id,
                ...data
            };
            usersArray.push(post);
        });
        return usersArray;
    }

    useEffect(() => {
        async function listenOnChange() {
            onValue(postsRef, async snapshot => {
                const users = await getUsers();
                const postsArray: any[] = [];
                snapshot.forEach(postSnapshot => {
                    const id = postSnapshot.key;
                    const data = postSnapshot.val();
                    const post = {
                        id,
                        ...data,
                        user: users.find(user => user.id == data.uid)
                    };
                    postsArray.push(post);
                });
                setPosts(postsArray.reverse());
            });
        }

        listenOnChange();
    }, []);

    return (
        <IonPage className="posts-page">
            <IonHeader className="collectionHeader">
                <IonToolbar className="collectionToolBar">
                    <IonTitle className="collectionHeader" size="large">My Collection</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonList>
                    {posts.map((post: { id: any; }) => (
                        <PostListItem post={post} key={post.id} />
                    ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
}

export default Collection;