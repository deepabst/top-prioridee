import React from "react";

export default function InfoDialog() {
    return (
      <div id='info-panel' className='info'>
        <h3 id='summary'>Summary of task</h3>
        <p>Importance: <span id="importance">5</span></p>
        <p>Urgency: <span id="urgency">5</span></p>
      </div>
    );
  }