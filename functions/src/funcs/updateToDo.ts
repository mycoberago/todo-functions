import {onRequest} from "firebase-functions/v2/https";
import admin = require("firebase-admin");
import {getFirestore} from "firebase-admin/firestore";

try {
  admin.initializeApp();
} catch (error) {
  console.log(error);
}

export const updateToDo = onRequest({cors: true}, async (req: any, res: any) => {
  let {userUid, todoID, todo, complete} = req.query;
  if (!userUid || !todoID || !todo || !complete) {
    return res.status(400).send("Bad Request");
  }

  // CONVERT COMPLETE VALUE TO A BOOLEAN
  // BEFORE SAVING TO DATABASE
  complete = complete === "true" ? true : false;

  const db = getFirestore();
  const docRef = db.collection("users").doc(userUid)
    .collection("todos").doc(todoID);

  try {
    await docRef.update({
      todo: todo,
      complete: complete,
    });

    return res.status(200).send({status: "success", data: null});
  } catch (error: any) {
    return res.status(500)
      .send({status: "error", errorMessage: error.message, data: null});
  }
});

