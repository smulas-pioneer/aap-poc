import * as React from 'react';
import Slider from 'react-slick';
import { Icon } from 'semantic-ui-react';


const getImagesByGroup = (groupId: string) => {


}


export const AltoShow = () => {

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow : 3,
    slidesToScroll: 3,
    initialSlide: 0,
    prevArrow: <CustomArrowPrev />,
    nextArrow: <CustomArrowNext />,
  };

  return <div style={{ height: '100vh', width: '100%', background: 'red' }} >
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: '1' }}>

      </div>
      <div className='sliderGraph' style={{ height: '130px', marginTop: '10px' }}>
        <Slider {...settings} ></Slider>
      </div>
    </div>
  </div>
}

const CustomArrowPrev = (props: any) => (<div className={`custom-slick-arrow custom-slick-prev`}><Icon name='arrow left' onClick={props.onClick} link /></div>);
const CustomArrowNext = (props: any) => (<div className={`custom-slick-arrow custom-slick-next`}><Icon name='arrow right' onClick={props.onClick} link /></div>);
