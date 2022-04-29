/**
 * Return list of available user workspaces
 *
 * @return {Array} arrray of spaces with name and id
 */

export const getSpaces = async () => {
  const res = await fetch('https://www.notion.so/api/v3/getSpaces', {
    method: 'POST',
    headers: {
      Cookie: `token_v2=${TOKEN_V2};`,
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  const userSpaces = data[Object.keys(data)[0]].space
  const userSpacesIds = Object.keys(userSpaces)
  return userSpacesIds.map(spaceId => ({
    id: userSpaces[spaceId].value.id,
    name: userSpaces[spaceId].value.name,
  }))
}
