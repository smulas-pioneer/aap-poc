import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import '../css/list.css';

class List extends Component {

  constructor(props){
    super(props);
  }

  getBoundingClientRect(){
    return this.refs.list.getBoundingClientRect();
  }

  onKeyDown(event){
    if(event.keyCode == 40 || event.keyCode == 38 || event.keyCode == 32) {
      event.preventDefault();
    }
    if(event.keyCode == 40){
      if(document.activeElement.nextElementSibling) {
        document.activeElement.nextElementSibling.focus();
      }
    }else if(event.keyCode == 38){
      if(document.activeElement.previousElementSibling) {
        document.activeElement.previousElementSibling.focus();
      }
    }
  }

  getCSSClass(className, disabled){
    let basisClassName = 'list';
    if(className && className != ''){
      basisClassName += ' '+className;
    }
    if(basisClassName.indexOf('disabled')>=0){
      basisClassName = basisClassName.replace(' disabled', '');
    }
    return disabled ? basisClassName +' disabled' : basisClassName;
  }

  render(){
    let{id, name, className, style, children, disabled} = this.props;
    return (
      <ul ref='list' id={id} name={name} className={this.getCSSClass(className, disabled)} style={style} onKeyDown={this.onKeyDown}>
        {children}
      </ul>
    );
  }
}

List.propTypes= {
  id: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
  disabled: PropTypes.bool,
};

List.defaultProps= {
  id: '',
  name: '',
  className: '',
  style: {},
  disabled: false,
};

export default List;