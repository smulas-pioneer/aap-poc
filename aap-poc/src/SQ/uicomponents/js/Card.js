import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/card.css';

class Card extends Component{
  
  constructor(props){
    super(props);
    this.onClick = this.onClick.bind(this);
  }
  
  onClick(event){
    if(this.props.onClick){
      this.props.onClick(event, this.props.data);
    }
  }
  
  getCSSClass(className, disabled){
    let basisClassName = 'card';
    if(className && className !== ''){
      basisClassName += ' ' + className;
    }
    if(basisClassName.indexOf('disabled') >= 0){
      basisClassName = basisClassName.replace(' disabled', '');
    }
    return disabled ? basisClassName + ' disabled' : basisClassName;
  }
  
  render(){
    let {label, className, style, children, data, icon} = this.props;
    return (
      <div className={this.getCSSClass(className)} style={style} onClick={this.onClick}>
        <div className='label-container'>{label}</div>
        {icon ? <div className='icon-container'>{icon}</div> : null}
        <div className='content-container'>
          {children}
        </div>
      </div>
    );
  }
}

Card.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  icon: PropTypes.node,
  className: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
  disabled: PropTypes.bool,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.bool]),
  onClick: PropTypes.func,
};

Card.defaultProps = {
  label: '',
  icon: null,
  className: '',
  disabled: false,
  style: {},
  children: null,
  data: null
};

export default Card;
