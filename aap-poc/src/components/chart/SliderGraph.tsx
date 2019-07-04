/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { useState } from 'react';
import { LangDictionary } from '../../reducers/language/interfaces';
import { Divider, Icon, Segment } from 'semantic-ui-react';
import Slider from "react-slick";
import { WidgetTitle } from '../shared/WidgetTitle';
import { numArray } from '../../_db/common/radarUtils';


interface SliderGraphBaseProps {
  graphs: any[],
  height?: number,
  lang: LangDictionary,
}

interface SliderGraphMultiViewProps extends SliderGraphBaseProps {
  defaultMode?: 'tumblr' | 'single' | 'multi',
  config?: {
    multiSegment?: number
    tumblrSlidesToShow?: number,
    singleSlidesToShow?: number,
    multiSlidesToShow?: number,
  }

}

interface SliderGraphProps extends SliderGraphBaseProps {
  defaultIndex?: number,
  slidesToShow?: number
}

const getCharts = (item: any, slider: boolean) => {
  return item.charts && item.charts.map((v: any, j: number) => {
    return slider
      ? React.cloneElement(v.chart, { key: j, legend: false, caption: false, actions: false })
      : React.cloneElement(v.chart, { key: 'current-graph' })
  });
}

export const SliderGrapMultiView = (props: SliderGraphMultiViewProps) => {
  const { config = {}, defaultMode = 'tumblr', height = 600, ...otherProps } = props

  const [mode, setMode] = useState(defaultMode);

  const changeMode = () => {
    switch (mode) {
      case 'tumblr':
        setMode('single');
        break;
      case 'single':
        setMode('multi');
        break;
      default:
        setMode('tumblr');
        break;
    }
  }

  const settings = {
    multiSegment: 2,
    tumblrSlidesToShow: 3,
    singleSlidesToShow: 1,
    multiSlidesToShow: 2,
    ...config
  }

  const graphProps = {
    ...otherProps,
    height: mode === 'multi' ? (height / settings.multiSegment) - 20 : height
  }

  const Wrapper = (props: { children: any }) => <Segment style={{ marginBottom: 0 }}>{props.children}</Segment>

  return <div style={{ position: 'relative' }}>
    {mode === 'tumblr'
      ? <Wrapper><SliderGraphTumblr {...graphProps} defaultIndex={0} slidesToShow={settings.tumblrSlidesToShow} /></Wrapper>
      : mode === 'single'
        ? <Wrapper><SliderGraph {...graphProps} defaultIndex={0} slidesToShow={settings.singleSlidesToShow}  /></Wrapper>
        : mode === 'multi'
          ? <div className='ui-flex ui-flex-col'>
            {numArray(settings.multiSegment).map((i) => (
              <Wrapper key={i}><SliderGraph {...graphProps} defaultIndex={i} slidesToShow={settings.multiSlidesToShow}/></Wrapper>
            ))}
          </div>
          : null
    }
    <Icon link name='th' size='large' style={{ position: 'absolute', top: '8px', right: '8px' }} onClick={changeMode} />
  </div>
}

export const SliderGraph = (props: SliderGraphProps) => {
  const { graphs = [], defaultIndex = 0, slidesToShow = 1, height = 600 } = props;

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
      <WidgetTitle size="small" title={item.title} />
      <div style={{ textAlign: slidesToShow> 1 ? 'center' :'left',  height: item.icon === 'chart bar' ? `${height}px` : `${height - 32}px` }} >
        {getCharts(item, false)}
      </div>
    </div>
  });

  return <div className='sliderGraph' ><Slider {...settings} >{sliderPanes}</Slider></div>
}

export const SliderGraphTumblr = (props: SliderGraphProps) => {
  const { graphs = [], defaultIndex = 0, slidesToShow = 1, height = 600 } = props;

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
      <div className="bordered" style={{ height: '80%' }} onClick={() => setActiveIndex(ix)}>
        {getCharts(item, true)}
      </div>
    </div>
  });

  return <div style={{ display: 'flex', flexDirection: 'column', height }}>
    <WidgetTitle size='small' title={graphs[activeIndex].title} />
    <div style={{ flex: '1' }}>
      {getCharts(graphs[activeIndex], false)}
    </div>
    <div className='sliderGraph' style={{ height: '130px', marginTop:'10px' }}>
      <Divider/>
      <Slider {...settings} >{sliderPanes}</Slider>
    </div>
  </div>
}

const CustomArrowPrev = (props: any) => (<div className={`custom-slick-arrow custom-slick-prev`}><Icon name='arrow left' onClick={props.onClick} link /></div>);
const CustomArrowNext = (props: any) => (<div className={`custom-slick-arrow custom-slick-next`}><Icon name='arrow right' onClick={props.onClick} link /></div>);

