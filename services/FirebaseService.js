import { Expo } from "expo-server-sdk";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "lumsapp.firebaseapp.com",
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: "lumsapp",
    storageBucket: "lumsapp.appspot.com",
    messagingSenderId: process.env.FIREBASE_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBEASE_MEASUREMENT_ID,
};

const expo = new Expo();

export const _ = initializeApp(firebaseConfig);
const db = getDatabase();
const dbRef = ref(db);

export const saveToken = async (userId, token) => {
    const values =
        (await get(child(dbRef, `userTokens/${userId}/`))).val() ?? {};
    const payload = { ...values, token };
    set(ref(db, `userTokens/${userId}/`), payload);
};

export const getToken = async (userId) => {
    const values = (await get(child(dbRef, `userTokens/${userId}/`))).val();
    return values ?? {};
};

export const sendNotification = async (userId, message) => {
    const { token } = await getToken(userId);
    if (token) {
        expo.sendPushNotificationsAsync([
            { to: token, title: message.title, body: message.body },
        ]);
    } else {
        console.log("No PushToken found for user: ", userId);
    }
};
