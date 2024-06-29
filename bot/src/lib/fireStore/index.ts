import type { QueryDocumentSnapshot } from '@google-cloud/firestore'

export const deleteDocument = async (docment: QueryDocumentSnapshot) => {
  await docment.ref.delete()
}
