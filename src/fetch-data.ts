import {FeedMap} from './types'
import {HttpClient} from '@actions/http-client'

interface ProductHuntResponse {
  posts: {
    votes_count: number
    id: number
    name: string
    tagline: string
    discussion_url: string
  }[]
}

interface Input {
  minVotes: number

  client_id: string
  client_secret: string
}

const getAccessToken = async ({
  client_id,
  client_secret
}: Input): Promise<string> => {
  const client = new HttpClient()
  const result = await client.postJson<{access_token: string}>(
    'https://api.producthunt.com/v1/oauth/token',
    {
      client_id,
      client_secret,
      grant_type: 'client_credentials'
    },
    {
      Host: 'api.producthunt.com'
    }
  )
  if (!result.result) {
    throw new Error('missing access token')
  }
  return result.result?.access_token
}

export const fetchData = async (input: Input): Promise<FeedMap> => {
  const accessToken = await getAccessToken(input)

  const client = new HttpClient()
  const response = await client.getJson<ProductHuntResponse>(
    'https://api.producthunt.com/v1/posts',
    {
      Host: 'api.producthunt.com',
      Authorization: `Bearer ${accessToken}`
    }
  )
  const posts = response.result?.posts ?? []

  return Object.fromEntries(
    posts
      .filter(({votes_count}) => votes_count > input.minVotes)
      .map(({id, name, tagline, votes_count, discussion_url}) => [
        id,
        {
          id: `${id}`,
          url: discussion_url,
          created: new Date().getTime(),
          title: `${name} (${votes_count})`,
          content_text: `${tagline}`
        }
      ])
  )
}
