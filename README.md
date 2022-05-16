# ProductHunt to RSS Action
<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

> Transformed ProductHunt to a RSS Feed
Example

```yaml
# get the state from the previous run
  - id: previous
    run: echo ::set-output name=state::$(cat state.json)



  - uses: ste-xx/producthunt-to-rss-action@main
    with:
      state: ${{ steps.previous.outputs.state }}
      feedUrl: https://raw.githubusercontent.com/ste-xx/rss-watch/main/feed.json
      client_id: ${{secrets.PH_CLIENT_ID}}
      client_secret: ${{secrets.PH_CLIENT_SECRET}}
    id: rss


# write feed to file
  - run: | 
      cat <<EOF > feed.json
      ${{ steps.rss.outputs.jsonFeed }}
      EOF
  
# write state for the next run
  - run: | 
     cat <<EOF > state.json
     ${{ steps.rss.outputs.state }}
     EOF
``` 

A running workflow can be found [here](https://github.com/ste-xx/rss-watch/blob/main/.github/workflows/ph.yml)


## Options
| Name  | Description | Type | DefaultValue | Mandatory |
| ----- | ----------- | ---- | ------------ | --------- | 
| minVotes  | Min votes to fetch entry | 'Number' | '350' |
| title | Title for the Rss feed | String | 'ProductHunt' |
| feedUrl | Url where the generated feed is reachable. | URL |  | ✅ 
| state | Hold the state from the previous run. If not set a flickering rss feed could occur, because entries could match the criteria and the next run the criteria is not met.  | Stringified Object | '{}' | 
| retention | How long an entry will be preserved, even if the criteria is not met. | 'Number' | '10' |
| client_id | Client Id which you get from ProductHunt | String | | ✅ 
| client_secret | Client Secret which you get from ProductHunt | String | |  ✅ 



## Output
| Name     | Description |
| -------- | ----------- | 
| state    | State for the action. Needs to be added in the next run |
| jsonFeed | Created json feed |

