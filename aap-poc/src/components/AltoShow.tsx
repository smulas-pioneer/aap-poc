import * as React from 'react';
import Slider from 'react-slick';
import { Icon, List } from 'semantic-ui-react';
import { useState, useEffect } from 'react';



const getImagesByGroup = async (groupId: string) => {
  const man = await fetch(`altoshow/${groupId}/manifest.json`)
  const json = await man.json();
  return {
    name: groupId,
    images: json.files.map((s: string) => ({ name: s, src: `/altoshow/${groupId}/${s}`}) )
  }
}


export const AltoShow = () => {
  const [list, setList] = useState<{ name: string, images: any[] }[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);

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
  //<img width='100%' height='100%' src={`/altoshow/${groupId}/${s}`} />

  const sliderPanes = list.map((item, ix) => {
    return <div className="sliderGraphItem" key={ix} style={{ height: '100px', padding: '2px' }}>
      <div className="bordered" style={{ height: '80%' }} onClick={() => setActiveIndex(ix)}>
        {item}
      </div>
    </div>
  });

  return <List>{
    list.map(s =>
      <List.Item>
        <List.Icon name='folder' />
        <List.Content>
          <List.Header>{s.name}</List.Header>
          <List.List>
              {s.images.map(img => <List.Item>{img.name}</List.Item>)  }
          </List.List>
        </List.Content>
      </List.Item>
    )}
  </List>



  return <div style={{ height: '100vh', width: '100%' }} >
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: '1' }}>
        {list[activeIndex]}
      </div>
      <div className='sliderGraph' style={{ height: '130px', marginTop: '10px' }}>
        <Slider {...settings} >{sliderPanes}</Slider>
      </div>
    </div>
  </div>
}

const CustomArrowPrev = (props: any) => (<div className={`custom-slick-arrow custom-slick-prev`}><Icon name='arrow left' onClick={props.onClick} link /></div>);
const CustomArrowNext = (props: any) => (<div className={`custom-slick-arrow custom-slick-next`}><Icon name='arrow right' onClick={props.onClick} link /></div>);
