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

export const generateDocRef = (firestore: Firestore, collectionPath: string, docId: string | undefined = undefined) => {
  return docId ? firestore.collection(collectionPath).doc(docId) : firestore.collection(collectionPath).doc()
}

export const storeObjOverWrite = async (
  docRef: DocumentReference<DocumentData, DocumentData>,
  obj: PartialWithFieldValue<DocumentData>,
) => {
  await docRef.set(obj, { merge: true })
}

export const notesErrorQuery = (firestore: Firestore, collectionName: string, hashtag: HashTags, limit: number) =>
  firestore.collection(collectionName).where('tag', '==', hashtag).limit(limit)

export const notScrapingQuery = (
  firestore: Firestore,
  collectionName: string,
  lastDocument: QueryDocumentSnapshot | undefined,
  limit: number,
) => {
  if (lastDocument) {
    return firestore.collection(collectionName).where('scraping', '==', false).limit(limit).startAfter(lastDocument)
  }

  return firestore.collection(collectionName).where('scraping', '==', false).limit(limit)
}
