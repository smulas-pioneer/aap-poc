//@ts-check

import React, { Component } from 'react';
import Card from './uicomponents/js/Card';
import  { homeConfiguration } from './constants/ApplicationStrings';
import List from './uicomponents/js/List';
import ListItem from './uicomponents/js/ListItem';
import { Link } from 'react-router-dom';
import { Fragment } from 'react';
import "./styles.scss";

export const Home = () => {
    return (
      <div className={"sq-home"}>
        <div className={"home"}>
          <div className='cards'>
            {
              homeConfiguration.map((conf, iConf) => {
                return <Fragment key={iConf}><Card
                  label={conf.title}
                  icon={<div className='icon' style={{ backgroundImage: 'url("' + conf.icon + '")' }} />}
                >
                  <List>
                    {
                      conf.sections.map((section, iSection) => {
                        const refPage = section.embed ? `sq/${section.title}` : section.url;
                        return <ListItem key={iSection} >
                          <Link to={refPage}>{section.title}</Link>
                        </ListItem>
                      })
                    }
                  </List>
                </Card>
                </Fragment>
              })
            }

          </div>
        </div>
      </div>
    );
  }
