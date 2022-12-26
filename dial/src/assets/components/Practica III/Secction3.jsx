import React from 'react';

import Card from './card';
import Img from './Img';

export default function Secction3(props) {
    return(
    <div className="row d-flex justify-content-between">
        {props.cards.map((card)=>{
            return  <div className="col m-4 border border-secondary">
            <Card name={card.name} content={card.content}/>
            </div>
        })}
    </div>
    )
  }