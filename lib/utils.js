require('dotenv').config();

const { getFirestore } = require("firebase/firestore");
const { initializeApp } = require("firebase/app");
const { doc, setDoc, updateDoc, addDoc, collection, query, where, getDocs,} = require("firebase/firestore");

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBA8lgGtRSa88KEc1X_0BhHm0Xfeh4eOfg",
    authDomain: "djowyett.firebaseapp.com",
    projectId: "djowyett",
    storageBucket: "djowyett.appspot.com",
    messagingSenderId: "478289729883",
    appId: "1:478289729883:web:5ddcc13846b3074db2627e",
    databaseURL: "https://djowyett-default-rtdb.europe-west1.firebasedatabase.app/",
  };

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
console.log(accountSid + "\n" + authToken)
const client = require('twilio')(accountSid, authToken);

const TOKEN_SMS_FACTOR ='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI5NjMyMCIsImlhdCI6MTcxODY3MDI2MS44Mzc2MTMsImV4cCI6MTcxODY3MTI2MS44Mzc3MTR9.3klhy-rCRYRNB3riKJTzDiJOZ7DUJ0B0E8Lvp_yk9sk'
const smsFactor = "https://api.smsfactor.com"

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function sendSMS(telephone, message){
    //console.log(`Cher ${telephone} : ${message}`)
    await client.messages
    .create({
        body: message,
        //from: '+12696681550',
        messagingServiceSid: 'MGf5bfd90e546e665dd4939817a450dc72',
        to: telephone //"+213795595056"
    })
    .then(message => console.log(message));
}


exports.alerter = async function (link){
    const usersRef = await collection(db,'users');
    const queryRef = await query(usersRef, where('motifs', 'array-contains', link), where("credits", '>', 1));

    const querySnapshot = await getDocs(queryRef);
    let users_notified = []

    querySnapshot.forEach(async (_doc) => {
        users_notified.push(_doc.data())
        //console.log(_doc.id, ' => ', _doc.data());
        const telephone = _doc.data()["phone_number"]
        const token_mobile = _doc.data()["token_mobile"]
        const credits = _doc.data()["credits"]
        const plan = _doc.data()["plan"]
        //const date_alerte = _doc.data()["date_alerte"]
        var date_atuelle = Date.now();
        var user_nom = _doc.id

        let date_alerte;
        let difference;
        let differenceEnMinutes;
        var date_atuelle = new Date();
        try {
        date_alerte = user["date_alerte"] != undefined ? user["date_alerte"] : 0

        // Calculez la différence en millisecondes entre les deux dates
        difference = Math.abs(date_atuelle - new Date(date_alerte));

        // Convertissez la différence en minutes
        differenceEnMinutes = difference / (1000 * 60);
        } catch (error) {
        differenceEnMinutes = 0
        }
    
    // Vérifiez si la différence est supérieure à 2 minutes : differenceEnMinutes > 2 || date_alerte == undefined
    if (differenceEnMinutes > 2) {
      const message = `Créneau disponible\n ${prefecture} : ${motif}`
      if(plan == "STARTER") {
        //await notif_client()
      }
      else if(plan == "PRO" || plan == "PREMIUM") {
        let val_sms
        if(telephone.startsWith("+")){
          console.log(telephone)
          val_sms = await sendSMS(telephone, message)
        }
        const val_update = await updateCredits(_doc.id, plan, credits)
        //const val_notif = await notif_client()
      }
      
    } else {
        console.log("Traitement bloqué");
    }

    });

    return users_notified
}

async function updateCredits(id, plan, credits) {
    const userRef = doc(db, "users", id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(userRed, {
        credits: credits - 1,
        plan : credits - 1== 0 ? "FREE" : plan,
        date_alerte : new Date()
    });
}