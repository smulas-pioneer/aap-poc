import React, {Component} from 'react';
import PropTypes from 'prop-types';

class ListItem extends Component {

  constructor(props){
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  onClick(event){
    if (this.props.onClick) {
      this.props.onClick(event, this.props.data);
    }
    if (this.props.onSelect) {
      this.props.onSelect(event, this.props.data);
    }
  }

  onDoubleClick(event){
    if (this.props.onDoubleClick) {
      this.props.onDoubleClick(event, this.props.data);
    }
  }

  onMouseOver(event){
    if (this.props.onMouseOver) {
      this.props.onMouseOver(event, this.props.data);
    }
  }

  onMouseLeave(event){
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(event, this.props.data);
    }
  }

  onMouseDown(event){
    if (this.props.onMouseDown) {
      this.props.onMouseDown(event, this.props.data);
    }
  }

  onMouseUp(event){
    if (this.props.onMouseUp) {
      this.props.onMouseUp(event, this.props.data);
    }
  }

  onTouchStart(event){
    if (this.props.onTouchStart) {
      this.props.onTouchStart(event, this.props.data);
    }
  }

  onTouchEnd(event){
    if (this.props.onTouchEnd) {
      this.props.onTouchEnd(event, this.props.data);
    }
  }

  onKeyDown(event){
    if (this.props.onKeyDown) {

        this.props.onKeyDown(event, this.props.data);

    }
    if (this.props.onSelect) {
      if(event.keyCode == 13 || event.keyCode == 32) {
        this.props.onSelect(event, this.props.data);
      }
    }
  }

  onKeyUp(event){
    if (this.props.onKeyUp) {
      this.props.onKeyUp(event, this.props.data);
    }
  }

  onKeyPress(event){
    if (this.props.onKeyPress) {
      this.props.onKeyPress(event, this.props.data);
    }
  }

  getCSSClass(className, selected, disabled){
    let basisClassName = 'list-item';
    if(className && className != ''){
      basisClassName += ' '+className;
    }
    if(basisClassName.indexOf('disabled')>=0){
      basisClassName = basisClassName.replace(' disabled', '');
    }else{
      if(basisClassName.indexOf('selected')>=0){
        basisClassName = basisClassName.replace(' selected', '');
      }
    }
    return disabled ? basisClassName +' disabled' : (selected ? basisClassName +' selected' : basisClassName);
  }

  render(){
    let {id, name, tabIndex, className, style, children, selected, disabled} = this.props;
    return (
      <li
        onClick={this.onClick}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onKeyPress={this.onKeyPress}
        onDoubleClick={this.onDoubleClick}
        disabled={disabled}
        id={id}
        name={name}
        tabIndex={tabIndex}
        className={this.getCSSClass(className, selected, disabled)}
        style={style}>
        {children}
      </li>
    );
  }
}

ListItem.propTypes= {
  id: PropTypes.string,
  name: PropTypes.string,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.bool]),
  className: PropTypes.string,
  selected: PropTypes.bool,
  children: PropTypes.node,
  style: PropTypes.object,
  tabIndex: PropTypes.number,
  disabled: PropTypes.bool,
  onSelect: PropTypes.func,
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onTouchStart: PropTypes.func,
  onTouchEnd: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onKeyPress: PropTypes.func,
  onDoubleClick: PropTypes.func,
};

ListItem.defaultProps= {
  id: '',
  name: '',
  data: null,
  className: '',
  selected: false,
  style: {},
  tabIndex: 0,
  disabled: false
};

export default ListItem;