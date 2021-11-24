import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Switch from '@material-ui/core/Switch'
import {
  useRecordContext,
  useResourceContext,
  useNotify,
  useRefresh,
  useMutation
} from 'react-admin'

const ListBooleanInput = (props) => {
  const record = useRecordContext(props)
  const resource = useResourceContext(props);
  if(!record) return null
  const refresh = useRefresh()
  const notify = useNotify()
  const {source} = props
  const {id, [source]: value} = record
  const [save, {loading}] = useMutation(
    {
        type: 'update',
        resource,
        payload: {data: { id, [source]: !value } },
    },
    {
      mutationMode: 'undoable',
      onSuccess: refresh,
      onFailure: error => notify(`Error: ${error.message}`, 'warning'),
    }
  ) 

  if(loading) return <CircularProgress />

  return (
    <Switch
      checked={value}
      onChange={save}
    />
  )
}

export default ListBooleanInput