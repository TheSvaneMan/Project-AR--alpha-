import { getAuth } from '@firebase/auth';
import { equalTo, get, onValue, orderByChild, query } from 'firebase/database';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonContent, IonHeader, IonImg, IonLabel, IonList, IonListHeader, IonPage, IonTitle, IonToolbar, useIonLoading } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getUserRef, postsRef } from '../../firebase-config';
import './PostsContainer.css';
import ProfileInfo from './ProfileInfo';
import ProfileCardItem from './ProfilePostCard';


const PostsContainer = () => {
	const currentUserId = getAuth().currentUser!.uid;
	const [user, setUser] = useState({});
	const [posts, setPosts] = useState([]);
	const userId = currentUserId;

	useEffect(() => {
		async function getUserDataOnce() {
			const snapshot = await get(getUserRef(userId));
			const userData = snapshot.val();
			setUser({
				id: userId,
				...userData
			});
			return userData;
		}

		async function listenOnChange() {
			const postsByUserId = query(postsRef, orderByChild("uid"), equalTo(userId));
			const userData = await getUserDataOnce();

			onValue(postsByUserId, async snapshot => {
				const postsArray: any = [];
				snapshot.forEach(postSnapshot => {
					const id = postSnapshot.key;
					const data = postSnapshot.val();
					const post = {
						id,
						...data,
						user: userData
					};
					postsArray.push(post);
				});
				setPosts(postsArray.reverse());
			});
		}
		listenOnChange();
		
	}, [userId]);


	return (
		<IonContent className='profilePostsContent'>
			<IonHeader>
                    <IonToolbar>
                        <IonTitle size="large">Profile</IonTitle>
                    </IonToolbar>
            </IonHeader>
			<ProfileInfo />
			<IonListHeader >
				<IonTitle className='profileTitle'>{posts.length ? "My Posts" : "No posts yet"}</IonTitle>
			</IonListHeader>
			<IonList className="postList">
				{posts.map((post: any) => {
					return (
						<ProfileCardItem key={post.id} post={post} userPost={true} />
					);
				})}
			</IonList>
		</IonContent>
	);
};

export default PostsContainer;
