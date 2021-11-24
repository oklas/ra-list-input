import * as React from 'react';
import { default as CircularProgress } from '@material-ui/core/CircularProgress';
import { default as Switch } from '@material-ui/core/Switch';
import {
  useRecordContext,
  Record,
  useResourceContext,
  useNotify,
  useRefresh,
  useMutation,
  BooleanFieldProps,
} from 'react-admin';

const ListBooleanInput: React.FC<BooleanFieldProps> = (props) => {
  const record = useRecordContext(props);
  const resource = useResourceContext(props);
  if (!record) return null;
  const refresh = useRefresh();
  const notify = useNotify();
  const { source }: { source?: string } = props;
  const { id, [source || '']: value }: Record = record;
  const [save, { loading }] = useMutation(
    {
      type: 'update',
      resource,
      payload: { data: { id, [source || '']: !value } },
    },
    {
      mutationMode: 'undoable',
      onSuccess: refresh,
      onFailure: (error) => notify(`Error: ${error.message}`, 'warning'),
    }
  );

  if (loading) return <CircularProgress />;

  return <Switch checked={value} onChange={(...a: any) => save(...a)} />;
};

export default ListBooleanInput;
