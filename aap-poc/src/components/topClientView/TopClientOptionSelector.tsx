import * as React from "react";
import { Dropdown, DropdownItemProps, Segment, } from "semantic-ui-react";
import { GroupTypes } from "./index";
import { IndicatorOptionsType } from "../../actions/model";
import { startCase } from "lodash";
import { Share } from "../Share";
import { arrayHasValue } from "../../commonUtils";
import { tsIndexedAccessType } from "@babel/types";

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
    <Segment basic>
      <h2 style={{ textAlign: 'center' }}>
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
    </Segment >
  );
}
