type AccountName = string

export const xTwitterAccountURL = (accountName: AccountName) => {
  return `https://twitter.com/${accountName}`
}

export const instagramAccountURL = (accountName: AccountName) => {
  return `https://www.instagram.com/${accountName}/`
}

export const facebookAccountURL = (accountName: AccountName) => {
  return `https://www.facebook.com/${accountName}/`
}

export const linkedinAccountURL = (accountName: AccountName) => {
  return `https://jp.linkedin.com/in/${accountName}/`
}

export const tiktokAccountURL = (accountName: AccountName) => {
  return `https://www.tiktok.com/@${accountName}/`
}

export const youtubeAccountURL = (accountName: AccountName) => {
  return `https://www.youtube.com/@${accountName}/`
}
