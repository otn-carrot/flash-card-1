import faunadb from 'faunadb'
import getId from './utils/getId'

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
})

exports.handler = (event, context, callback) => {
  if (!context.clientContext.user) {
    return callback(null, {
      statusCode: 400,
      body: "Unauthorized"
    })
  }
  const data = JSON.parse(event.body)
  const id = getId(event.path)
  console.log(`Function 'cards-update' invoked. update id: ${id}`)
  return client.query(q.Update(q.Ref(`classes/card/${id}`), {data}))
  .then((response) => {
    console.log("success", response)
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify(response)
    })
  }).catch((error) => {
    console.log("error", error)
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify(error)
    })
  })
}