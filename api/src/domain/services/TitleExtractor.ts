export const extractTitle = (body: string): string => {
  const firstLine = body.split('\n')[0]
  return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine
}
