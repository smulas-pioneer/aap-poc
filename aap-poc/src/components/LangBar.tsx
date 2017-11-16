import * as React from 'react';
import { appConnector } from 'app-support';
import { getLanguageFlag, getLanguageName } from '../reducers/index';
import { setLanguage } from '../actions/index';
import { Dropdown, Flag, Icon } from 'semantic-ui-react';
const conn = appConnector<{ style?: React.CSSProperties }>()(
    (s, p) => ({
        flag: getLanguageFlag(s),
        lang: getLanguageName(s)
    }),
    { setLanguage }
)

type AvailableLanguages = 'it' | 'gb' | 'de';

interface Opts {
    key: AvailableLanguages,
    value: AvailableLanguages,
    flag: AvailableLanguages,
    text: string
}
const opts: Opts[] = [
    { key: 'it', value: 'it', flag: 'it', text: 'Italiano' },
    { key: 'gb', value: 'gb', flag: 'gb', text: 'English' },
    { key: 'de', value: 'de', flag: 'de', text: 'Deutch' },
]
class LangBarCompo extends conn.StatefulCompo<{}> {

    render() {
        const { setLanguage, lang, style, flag } = this.props;
        return opts.map((val) => (
            <Dropdown.Item
                key={val.key}
                active={val.flag === flag}
                onClick={() => setLanguage(val.key)}>
                <Flag name={val.flag} /> {val.text}
            </Dropdown.Item>)
        );
    }

    /* <Dropdown.Item
        style={style}
        value={flag}
        placeholder='Language'
        size="tiny"
        options={opts}
        onChange={(e: any, d: any) => { setLanguage(d.value as 'it' | 'gb') }}
        trigger={<span><Flag name={flag} />{lang}</span>}
    /> */
}

export const LangBar = conn.connect(LangBarCompo);