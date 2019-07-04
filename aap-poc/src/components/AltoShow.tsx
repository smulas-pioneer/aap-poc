import * as React from 'react';
import Slider from 'react-slick';
import { Icon, List, Accordion } from 'semantic-ui-react';
import { useState, useEffect } from 'react';



const getImagesByGroup = async (groupId: string) => {
  const man = await fetch(`altoshow/${groupId}/manifest.json`)
  const json = await man.json();
  return {
    name: groupId,
    images: json.files.map((s: string) => ({ name: s, src: `/altoshow/${groupId}/${s}` }))
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
    content: <div><List>
      {s.images.map(img => <List.Item onClick={() => setCurrent(img.src)}>{img.name}</List.Item>)}
    </List></div>
  }))

  return <div style={{ height: '100vh', width: '100%' }} >
    <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
      <Accordion defaultActiveIndex={0} panels={panels} styled style={{ width: '200px' }} />
      <div style={{ flex: '1' }}>
        {current && <img width='100%' src={current} />}
      </div>
    </div>
  </div>
}

const CustomArrowPrev = (props: any) => (<div className={`custom-slick-arrow custom-slick-prev`}><Icon name='arrow left' onClick={props.onClick} link /></div>);
const CustomArrowNext = (props: any) => (<div className={`custom-slick-arrow custom-slick-next`}><Icon name='arrow right' onClick={props.onClick} link /></div>);
