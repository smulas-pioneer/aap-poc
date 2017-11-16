import * as React from 'react';
import { LangDictionary } from '../../reducers/language/interfaces';
import { Button } from 'semantic-ui-react';
import { IndicatorOptionsType } from '../../actions/model';

export interface MapOptionsProps {
    lang: LangDictionary,
    onChange: (type: IndicatorOptionsType) => void;
}

export interface MapOptionsState {
    activeOption: IndicatorOptionsType;
}

export class MapOptions extends React.Component<MapOptionsProps, MapOptionsState> {

    constructor(props: MapOptionsProps) {
        super(props);
        this.state = {
            activeOption: IndicatorOptionsType.clients
        }
        this.setOption = this.setOption.bind(this);
        this.renderButton = this.renderButton.bind(this);
    }

    setOption(type: IndicatorOptionsType) {
        if (type === this.state.activeOption) return;

        this.setState(prev => (
            { activeOption: type }
        ),
            () => this.props.onChange && this.props.onChange(type)
        );
    }

    renderButton(type: IndicatorOptionsType, caption: string) {
        const isActive = this.state.activeOption === type;
        return (
            <Button
                key={type}
                size="tiny"
                active={isActive}
                color={isActive ? 'green' : undefined}
                onClick={() => this.setOption(type)} >{caption}
            </Button>
        );
    }

    render() {
        const { activeOption } = this.state;
        const { lang } = this.props;

        const buttons = [
            [IndicatorOptionsType.clients, lang.MAP_OPTS_CLIENTS],
            [IndicatorOptionsType.aum, lang.MAP_OPTS_AUM],
            [IndicatorOptionsType.interviews, lang.MAP_OPTS_INTERVIEWS],
            [IndicatorOptionsType.acceptedProposals, lang.MAP_OPTS_PROPOSAL],
            [IndicatorOptionsType.alerts, lang.MAP_OPTS_ALERTS]
        ] as [[IndicatorOptionsType, string]];

        return (
            <div>
                <Button.Group fluid>
                    {buttons.map(b => this.renderButton(b[0], b[1]))}
                </Button.Group>
            </div>
        )
    }
}