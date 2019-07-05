import * as React from 'react';
import Slider from 'react-slick';
import { Icon, List, Accordion, Segment } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import { capitalize } from 'lodash';

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
const home = require('./home.png');

const getImagesByGroup = async (groupId: string, showThumbnails = true) => {
  const man = await fetch(`altoshow/${groupId}/manifest.json`)
  const json = await man.json();
  return {
    name: groupId,
    showThumbnails,
    images: json.files.map((s: string) => ({
      ...parseName(s),
      src: `${process.env.REACT_APP_ALTOSHOWPREFIX || ''}/altoshow/${groupId}/${encodeURIComponent(s)}`
    }))
  }
}


export const AltoShow = () => {
  const [list, setList] = useState<{ name: string, images: any[], showThumbnails: boolean }[]>([]);

  const [activeIndex, setactiveIndex] = useState<number>(0);
  const [current, setCurrent] = useState<string | undefined>(undefined);
  const [currentGroup, setCurrentGroup] = useState<any | undefined>(undefined);
  const [showSilder, setShowSlider] = useState(true);
  const mainContent = React.useRef<any>(null);

  useEffect(() => {
    Promise.all([
      getImagesByGroup('alto-win'),
      getImagesByGroup('alto-web'),
      getImagesByGroup('reporting', false)
    ]).then(setList)
  }, [])

  useEffect(() => {
    if (mainContent.current) {
      mainContent.current.scrollTo({ top: 0 });
    }

  }, [current]);

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
    const { index } = itemProps;
    setactiveIndex(index);
  }

  const sliderPanes = list.length && list[activeIndex] && list[activeIndex].images.map((img: any, ix: number) => {
    return <div className="sliderGraphItem" key={ix} style={{ height: '110px', marginTop: '3px' }}>
      <div style={{ border: '1px solid grey', margin: '0 3px' }} onClick={() => setCurrent(img.src)} >
        {image(img.src)}
      </div>
    </div>
  });

  const panels = list.map(s => ({
    key: s.name,
    title: capitalize(s.name),
    content: <Accordion.Content>
      <List className="altoshow-groups-explorer" style={{ overflowY: 'scroll', maxHeight: '400px' }}>
        {s.images.map((img, ix) =>
          <List.Item as="a" key={ix} onClick={() => setCurrent(img.src)} >
            <List.Icon name='marker' color={img.src === current ? 'yellow' : 'grey'} />
            <List.Content className='color-blue'>
              {img.name}
            </List.Content>
          </List.Item>)}
      </List>
    </Accordion.Content>
  }))

  return <div style={{ height: '100vh', width: '100%' }} >
    <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <img src={logo} style={{ width: '250px', cursor: 'pointer' }} onClick={() => setCurrent(undefined)} />
        <Accordion activeIndex={activeIndex} panels={panels} onTitleClick={handleTitleClick} styled style={{ width: '250px', flex: 1 }} />
        {current && list[activeIndex].showThumbnails && <Segment>
          <List.Item onClick={() => setShowSlider(!showSilder)} >
            <List.Content>
              {`${showSilder ? 'Hide' : 'Show'} Thumbnails`}
            </List.Content>
          </List.Item>
        </Segment>}
      </div>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', width: showSilder ? '85%' : '100%' }}>
        <div ref={mainContent} style={{ flex: '1', overflowY: 'scroll', marginBottom: '2px' }}>
          <Segment>
            {current
              ? image(current)
              : <img width='100%' src={home} />
            }
          </Segment>
        </div>
        {showSilder && current && list[activeIndex].showThumbnails &&
          <Segment style={{ marginTop: '2px', padding: '0.1em 1em' }}>
            <div style={{ background: 'black', margin: '2px auto', height: '120px', paddingLeft: '10%', paddingRight: '10%' }}>
              <Slider  {...settings} >{sliderPanes}</Slider>
            </div>
          </Segment>
        }
      </div>
    </div>
  </div>
}

const CustomArrowPrev = (props: any) => (<div className={`custom-slick-arrow custom-slick-prev`}><Icon name='arrow left' onClick={props.onClick} link /></div>);
const CustomArrowNext = (props: any) => (<div className={`custom-slick-arrow custom-slick-next`}><Icon name='arrow right' onClick={props.onClick} link /></div>);

const image = (src?: string) => {
  if (!src) return null;
  const isPdf = src.endsWith('.pdf');
  return isPdf
    ? <div style={{ width: '100%', height: '100%' }}><object data={src} type="application/pdf" style={{ minHeight: '100vh', height: '100%', width: '100%' }}>
      <p>It appears you don't have a PDF plugin for this browser.
No biggie... you can <a href={src}>click here to
download the PDF file.</a></p>
    </object></div>
    : <img src={src} height='100%' width='100%' />
}
