import * as React from 'react';
import Slider from 'react-slick';
import { Icon, List, Accordion, Segment } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import { parse } from '@babel/parser';
import { ClientsViewFilterText } from './clientsView/ClientsViewParms';

const parseName = (name: string) => {
  const nameWithoutExt = name.substring(0, name.length - 4);
  const ix = nameWithoutExt.indexOf('.');
  if (ix > -1) {
    return {
      name: nameWithoutExt.substr(ix + 1),
      id: parseInt(nameWithoutExt.substr(0, ix))
    }
  } else {
    return {
      name: nameWithoutExt,
      id: 0
    }
  }
}
const logo = require('./alto-logo.png');

const getImagesByGroup = async (groupId: string) => {
  const man = await fetch(`altoshow/${groupId}/manifest.json`)
  const json = await man.json();
  return {
    name: groupId,
    images: json.files.map((s: string) => ({
      ...parseName(s),
      src: `${process.env.REACT_APP_ALTOSHOWPREFIX || ''}/altoshow/${groupId}/${encodeURIComponent(s)}`
    }))
  }
}

export const AltoShow = () => {
  const [list, setList] = useState<{ name: string, images: any[] }[]>([]);

  const [activeIndex, setactiveIndex] = useState<number>(0);
  const [current, setCurrent] = useState<string | undefined>(undefined);
  const [currentGroup, setCurrentGroup] = useState<any | undefined>(undefined);

  useEffect(() => {
    Promise.all([
      getImagesByGroup('current'),
      getImagesByGroup('new'),
    ]).then(setList)
  }, [])

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 2,
    initialSlide: 0,
    prevArrow: <CustomArrowPrev />,
    nextArrow: <CustomArrowNext />,
  };

  const handleTitleClick = (e: any, itemProps: any) => {
    const { index } = itemProps
    setactiveIndex(index);
  }

  //getImagesByGroup('new').then(console.log);
  //

  const sliderPanes = list.length && list[activeIndex].images.map((img: any, ix: number) => {
    return <div className="sliderGraphItem" key={ix} style={{ height: '110px', marginTop: '3px' }}>
      <div style={{ border: '1px solid grey', margin: '0 3px' }} onClick={() => setCurrent(img.src)} >
        <img src={img.src} height='100%' width='100%'/>
      </div>
    </div>
  });

  const panels = list.map(s => ({
    key: s.name,
    title: s.name,
    content: <Accordion.Content>
      <List style={{ overflowY: 'scroll', maxHeight: '400px' }}>
        {s.images.map((img, ix) =>
          <List.Item as="a" key={ix} onClick={() => setCurrent(img.src)} >
            <List.Icon name='marker' color={img.src === current ? 'yellow' : 'grey'} />
            <List.Content>
              {img.name}
            </List.Content>
          </List.Item>)}
      </List>
    </Accordion.Content>
  }))

  return <div style={{ height: '100vh', width: '100%' }} >
    <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <img src={logo} style={{ width: '250px' }} />
        <Accordion activeIndex={activeIndex} panels={panels} onTitleClick={handleTitleClick} styled style={{ width: '250px', flex: 1 }} />
      </div>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', width: '85%' }}>
        <Segment style={{ flex: '1', overflowY: 'scroll', marginBottom: '2px'  }}>
          {current && <img width='100%' src={(current)} />}
        </Segment>
        <Segment style={{ marginTop: '2px', padding:'0.1em 1em' }}>
          <div style={{ margin: '2px auto', height: '120px' }}>
            <Slider  {...settings} >{sliderPanes}</Slider>
          </div>
        </Segment>
      </div>
    </div>
  </div>
}

const CustomArrowPrev = (props: any) => (<div className={`custom-slick-arrow custom-slick-prev`}><Icon name='arrow left' onClick={props.onClick} link /></div>);
const CustomArrowNext = (props: any) => (<div className={`custom-slick-arrow custom-slick-next`}><Icon name='arrow right' onClick={props.onClick} link /></div>);
