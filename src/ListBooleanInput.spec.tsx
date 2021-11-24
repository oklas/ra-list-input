import { act, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/styles';
import { createTheme } from '@material-ui/core/styles';
import { DataProviderContext, ResourceContextProvider } from 'ra-core';
import { List, SingleFieldList } from 'react-admin';
import { renderWithRedux } from 'ra-test';
import ListBooleanInput from './ListBooleanInput';

const theme = createTheme();

describe('<SimpleList />', () => {
  const defaultProps = {
    hasCreate: true,
    hasEdit: true,
    hasList: true,
    hasShow: true,
    resource: 'posts',
    basePath: '/posts',
    history: {} as any,
    location: {} as any,
    match: (() => {}) as any,
    syncWithLocation: true,
  };

  const defaultStateForList = {
    admin: {
      resources: {
        posts: {
          list: {
            ids: [],
            params: {},
            selectedIds: [],
            total: 0,
            cachedRequests: {},
          },
        },
      },
    },
  };

  it('should render state according to data', async () => {
    const dataProvider: any = {
      getList: () =>
        Promise.resolve({
          data: [{ id: 1, text: 'the text', state: true }],
          total: 2,
        }),
      update: jest.fn(() =>
        Promise.resolve({
          data: { id: 1, state: false },
        } as any)
      ),
    };
    let container: HTMLElement | undefined;

    await act(async () => {
      const res = renderWithRedux(
        <ThemeProvider theme={theme}>
          <ResourceContextProvider value="posts">
            <DataProviderContext.Provider value={dataProvider}>
              <List {...defaultProps} empty={false}>
                <SingleFieldList>
                  <ListBooleanInput source="state" />
                </SingleFieldList>
              </List>
            </DataProviderContext.Provider>
          </ResourceContextProvider>
        </ThemeProvider>,
        defaultStateForList
      );
      container = res.container;
    });

    const first = container?.querySelector('[href="/posts/1"]') as HTMLInputElement;

    const input = first.querySelector('input') as HTMLInputElement;

    expect(input.checked).toBe(true);
    await act(async () => {
      fireEvent.click(input);
    });
    expect(input.checked).toBe(false);
  });
});
