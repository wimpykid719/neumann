import type { Firestore, QueryDocumentSnapshot } from '@google-cloud/firestore'

export const query = (
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
