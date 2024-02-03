export default function ErrorMessage(error) {
  return error.response
    ? `${error.code}, ${JSON.stringify(error.response)}`
    : `${error.code}, ${error.message}`
}
