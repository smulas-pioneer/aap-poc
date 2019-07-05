import * as React from 'react';
import Slider from 'react-slick';
import { Icon, List, Accordion } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import { parse } from '@babel/parser';

const parseName = (name: string) => {
  const nameWithoutExt = name.substring(0, name.length - 4)
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
      src: `${process.env.REACT_APP_ALTOSHOWPREFIX || ''}/altoshow/${groupId}/${s}`
    }))
  }
}

export const AltoShow = () => {
  const [list, setList] = useState<{ name: string, images: any[] }[]>([]);

  const [current, setCurrent] = useState<string | undefined>(undefined);

  useEffect(() => {
    Promise.all([
      getImagesByGroup('current'),
      getImagesByGroup('new'),
    ]).then(setList)
  }, [])

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    initialSlide: 0,
    prevArrow: <CustomArrowPrev />,
    nextArrow: <CustomArrowNext />,
  };

  //getImagesByGroup('new').then(console.log);
  //

  const panels = list.map(s => ({
    key: s.name,
    title: s.name,
    content: <Accordion.Content>
      <List style={{    overflowY: 'scroll', maxHeight:'400px'}}>
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
      <div>
        <img src={logo} style={{width:'250px'}} />
        <Accordion defaultActiveIndex={0} panels={panels} styled style={{ width: '250px' }} />
      </div>
      <div style={{ flex: '1',overflowY: 'scroll'}}>
        {current && <img width='100%' src={encodeURIComponent(current)} />}
      </div>
    </div>
  </div>
}

const CustomArrowPrev = (props: any) => (<div className={`custom-slick-arrow custom-slick-prev`}><Icon name='arrow left' onClick={props.onClick} link /></div>);
const CustomArrowNext = (props: any) => (<div className={`custom-slick-arrow custom-slick-next`}><Icon name='arrow right' onClick={props.onClick} link /></div>);
