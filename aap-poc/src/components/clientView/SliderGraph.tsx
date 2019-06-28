import * as React from 'react';
import { LangDictionary } from '../../reducers/language/interfaces';
import { Grid, Segment, Statistic, Button, Icon, Tab, SemanticCOLORS, Menu, Modal, Loader, TabProps, Card } from 'semantic-ui-react';

import Slider from "react-slick";
import { useState } from 'react';
import { WidgetTitle } from '../shared/WidgetTitle';

interface SliderGraphProps {
  graphs: any[],
  lang: LangDictionary,
  defaultIndex: number,
  hideTitle?: boolean
}

export const SliderGraph = (props: SliderGraphProps) => {
  const [activeIndex, setActiveIndex] = useState(props.defaultIndex);

  const { graphs = [], lang } = props;
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    centerMode: true,
  };

  const getCharts = (item: any, slider: boolean) => {
    return item.charts && item.charts.map((v: any, j: number) => {
      return slider ? React.cloneElement(v.chart, { legend: false, caption: false }) : v.chart
    });
  }

  const sliderPanes = graphs.map((item, ix) => {
    return <Segment basic style={{ height: '100px' }}>
      <label>{item.title}</label>
      <div key={ix} className='bordered' style={{ height: '100%' }} onClick={() => setActiveIndex(ix)}>
        {getCharts(item, true)}
      </div>
    </Segment>
  });

  return <Grid>
    <Grid.Row>
      <Grid.Column style={{ height: '470px' }}>
        <WidgetTitle title={graphs[activeIndex].title} />
        {getCharts(graphs[activeIndex], false)}
      </Grid.Column>
    </Grid.Row>
    <Grid.Row style={{ height: '130px' }}>
      <Grid.Column>
        <Slider {...settings}>{sliderPanes}</Slider>
      </Grid.Column>
    </Grid.Row>
  </Grid>
}
