/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { LangDictionary } from '../../reducers/language/interfaces';
import { Divider, Icon } from 'semantic-ui-react';

import Slider from "react-slick";
import { useState } from 'react';
import { WidgetTitle } from '../shared/WidgetTitle';

interface SliderGraphProps {
  graphs: any[],
  lang: LangDictionary,
  defaultIndex?: number,
  height?: number,
  bordered?: boolean;
  slidesToShow?: number
}


const getCharts = (item: any, slider: boolean) => {
  return item.charts && item.charts.map((v: any, j: number) => {
    return slider
      ? React.cloneElement(v.chart, { legend: false, caption: false, key: j })
      : React.cloneElement(v.chart, { key: 'current-graph' })
  });
}


export const SliderGraphWrapper = (props: SliderGraphProps & { mode?: 'sliderThumb' | 'slider' }) => {
  const { mode = 'slider', ...others } = props;
  switch (mode) {
    case 'sliderThumb':
      return <SliderGraphThumb {...others} />
    default:
      return <SliderGraph {...others} />
  }
}

export const SliderGraph = (props: SliderGraphProps) => {
  const { graphs = [], bordered, defaultIndex = 0, slidesToShow = 1, height = 600 } = props;

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: slidesToShow,
    initialSlide: defaultIndex,
    lazyLoad: true,
    prevArrow: <CustomArrowPrev />,
    nextArrow: <CustomArrowNext />
  };

  const sliderPanes = graphs.map((item, ix) => {
    return <div className="sliderGraphItem" key={ix} style={{ height: `${height}px` }}>
      <WidgetTitle size="mini" title={item.title} />
      <div className={`${bordered ? 'bordered' : ''}`} style={{ height: item.icon === 'pie chart' ? `95%` : '100%' }} >
        {getCharts(item, false)}
      </div>
    </div>
  });

  return <div className='sliderGraph' ><Slider {...settings} >{sliderPanes}</Slider></div>
}

export const SliderGraphThumb = (props: SliderGraphProps) => {
  const { graphs = [], bordered = true, defaultIndex = 0, slidesToShow = 1, height = 600 } = props;

  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: slidesToShow,
    initialSlide: defaultIndex,
    prevArrow: <CustomArrowPrev />,
    nextArrow: <CustomArrowNext />,
  };

  const sliderPanes = graphs.map((item, ix) => {
    return <div className="sliderGraphItem" key={ix} style={{ height: '100px', padding: '2px' }}>
      <label>{item.title}</label>
      <div className={`${bordered ? 'bordered' : ''}`} style={{ height: '80%' }} onClick={() => setActiveIndex(ix)}>
        {getCharts(item, true)}
      </div>
    </div>
  });

  return <div style={{ display: 'flex', flexDirection: 'column', height }}>
    <WidgetTitle size='small' title={graphs[activeIndex].title} />
    <div style={{ flex: '1' }}>
      {getCharts(graphs[activeIndex], false)}
    </div>
    <div className='sliderGraph' style={{ height: '130px' }}>
      <Divider />
      <Slider {...settings} >{sliderPanes}</Slider>
    </div>
  </div>
}

const CustomArrowPrev = (props: any) => (<div className={`custom-slick-arrow custom-slick-prev`}><Icon name='arrow left' onClick={props.onClick} link /></div>);
const CustomArrowNext = (props: any) => (<div className={`custom-slick-arrow custom-slick-next`}><Icon name='arrow right' onClick={props.onClick} link /></div>);