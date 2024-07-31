import app from '@/text/app.json'

export const failedPageMetadata = () => {
  return {
    title: app.title,
    robots: {
      index: false,
    },
  }
}
