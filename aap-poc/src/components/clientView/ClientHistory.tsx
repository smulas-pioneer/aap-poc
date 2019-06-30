import { LangDictionary } from '../../reducers/language/interfaces';
import * as React from 'react';
import { InterviewResult } from '../../_db/interfaces';
import { Tab, Menu } from 'semantic-ui-react';
import { OverflowItem } from '../shared/GridOverflow';
import { HistoryViewTimelineEvent } from './HistoryView';
export const ClientHistory = (props: {
  history: InterviewResult[];
  lang: LangDictionary;
}) => {
  const { history, lang } = props;
  const listOfHistory = {
    clientEventHistory: true,
    transactions: true,
    proposals: true,
    interviews: true
  };
  const panes = Object.keys(listOfHistory).reduce((memo, key, i) => {
    const allow = listOfHistory[key];
    if (allow) {
      memo.push({
        menuItem: <Menu.Item key={i}>{lang.HISTORY[key]}</Menu.Item>,
        render: () => <Tab.Pane as={OverflowItem} style={{ padding: '5px 8px' }} content={<HistoryViewTimelineEvent lang={lang} history={history} height={580} />} />
      });
    }
    return memo;
  }, [] as any);
  return <Tab menu={{ pointing: true, secondary: true }} panes={panes} style={{ height: '95%' }} />;
};
