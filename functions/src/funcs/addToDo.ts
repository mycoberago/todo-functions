import {onRequest} from "firebase-functions/v2/https";
import admin = require("firebase-admin");
import {getFirestore} from "firebase-admin/firestore";

try {
  admin.initializeApp();
} catch (error) {
  console.log(error);
}

export const addToDo = onRequest({cors: true}, async (req: any, res: any) => {
  const {userUid, todo} = req.query;
  if (!userUid || !todo) return res.status(400).send("Bad Request");

  let isAuthorized = await userIsAuthorized(userUid);
  if (!isAuthorized) return res.status(401).send("Unauthorized");

  const db = getFirestore();
  const collectionRef = db.collection("users").doc(userUid).collection("todos");

  try {
    const docRef: any = await collectionRef.add({
      todo: todo,
      timestamp: new Date().getTime(),
      complete: false,
    });

    return res.status(200).send({status: "success", data: docRef.id});
  } catch (error: any) {
    return res.status(500)
      .send({status: "error", errorMessage: error.message, data: null});
  }
});

function userIsAuthorized (uid: string) {
  return new Promise((resolve, reject) => {
    admin.auth().getUser(uid).then(user => {
      if(user.uid === uid) return resolve(true);
      resolve(false);
    }).catch(error => {
      resolve(false);
    })
  })
}

