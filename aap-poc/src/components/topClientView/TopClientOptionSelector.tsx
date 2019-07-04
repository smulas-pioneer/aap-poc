import * as React from "react";
import { Dropdown, DropdownItemProps, Button, Menu, } from "semantic-ui-react";
import { GroupTypes } from "./index";
import { IndicatorOptionsType } from "../../actions/model";
import { startCase } from "lodash";
import { Share } from "../Share";
import { arrayHasValue } from "../../commonUtils";

export interface TopClientOptionSelection {
  Group?: GroupTypes;
  Indicator?: IndicatorOptionsType;
}

export interface TopClientOptionSelectorProps {
  group: GroupTypes;
  indicator: IndicatorOptionsType;
  onChange: (e: TopClientOptionSelection) => void;
}

export const TopClientOptionSelector = ({ group, indicator, onChange }: TopClientOptionSelectorProps) => {

  const curGroup = GroupTypes[group];
  const curIndicator = IndicatorOptionsType[indicator];

  const renderOptions = (active: string, enumType: any, onClick: (e: any, d: DropdownItemProps) => void, exclusions?: any[]) => {
    let items = [];
    for (let val in enumType) {
      if (isNaN(parseInt(val)) && !arrayHasValue(exclusions || [], val)) {
        items.push(<Dropdown.Item
          key={val}
          selected={val === active}
          active={val === active}
          value={val}
          text={startCase(val)}
          onClick={onClick}
        />);
      }
    }
    return items;
  }

  const onGroupChange = (e: any, d: DropdownItemProps) => {
    if (d.value) {
      const newGroup = GroupTypes[d.value.toString()];
      let newIndicator: IndicatorOptionsType | undefined = undefined;
      if (d.value === GroupTypes[GroupTypes.Client] &&
        curIndicator === IndicatorOptionsType[IndicatorOptionsType.clients]) {
        newIndicator = IndicatorOptionsType.aua;
      }
      onChange(({ Group: newGroup, Indicator: newIndicator }));
    }
  }


  const onIndicatorChange = (e: any, d: DropdownItemProps) => {
    if (d.value) onChange(({ Indicator: IndicatorOptionsType[d.value.toString()] }));
  }

  return (
    <div>

      <div className='topClientOptionSelector' >
        <h2  >
          Top
          &nbsp;
      <Dropdown className="topClientDropOption" icon={false} compact text={startCase(curGroup)} as='a' >
            <Dropdown.Menu >
              {renderOptions(curGroup, GroupTypes, onGroupChange)}
            </Dropdown.Menu>
          </Dropdown>
          &nbsp;
          Performers by
          &nbsp;
      <Dropdown className="topClientDropOption" icon={false} compact text={startCase(curIndicator)} as='a'>
            <Dropdown.Menu>
              {renderOptions(
                curIndicator,
                IndicatorOptionsType,
                onIndicatorChange,
                curGroup === GroupTypes[GroupTypes.Client] ? [IndicatorOptionsType[IndicatorOptionsType.clients]] : undefined)
              }
            </Dropdown.Menu>
          </Dropdown>
          <Share buttons={['Excel', 'Pdf', 'Copy']} />
        </h2>
      </div >
      <div className="btnProposals" >
        <Menu secondary>
          <Menu.Item>
            <Button size="small" basic content="Generate Proposals" icon="lightning" />
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
}
