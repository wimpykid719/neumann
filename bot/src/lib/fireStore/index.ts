import type { HashTags } from '@/utils/hashTags'
import type {
  DocumentData,
  DocumentReference,
  Firestore,
  PartialWithFieldValue,
  QueryDocumentSnapshot,
} from '@google-cloud/firestore'

export const deleteDocument = async (docment: QueryDocumentSnapshot) => {
  await docment.ref.delete()
}

export const generateDocRef = (firestore: Firestore, collectionPath: string, docId: string) => {
  return firestore.collection(collectionPath).doc(docId)
}

export const storeObjOverWrite = async (
  docRef: DocumentReference<DocumentData, DocumentData>,
  obj: PartialWithFieldValue<DocumentData>,
) => {
  await docRef.set(obj, { merge: true })
}

export const notesErrorQuery = (firestore: Firestore, collectionName: string, hashtag: HashTags, limit: number) =>
  firestore.collection(collectionName).where('tag', '==', hashtag).limit(limit)
