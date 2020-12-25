import React from "react";
import "./events.css";

import tickMark from "../../assets/images/tick.svg";

const Events = (props) => {
  const datePrettier = (date) => {
    date = new Date(date);
    return date.getFullYear() + "/" +
      ("00" + (date.getMonth() + 1)).slice(-2) + "/" +
      ("00" + date.getDate()).slice(-2) + " " +
      ("00" + date.getHours()).slice(-2) + ":" +
      ("00" + date.getMinutes()).slice(-2) + ":" +
      ("00" + date.getSeconds()).slice(-2);
  }
  return (
    <div className="tableContainer">
      <table>
        <thead>
          <tr>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.events.map((event) => (
            <tr key={event.anonymousId + event.userId + event.messageId + event.sentAt}>
              <td>
                <div className="roundedCheck flex">
                  <img className="tick-Img" src={tickMark} alt="Tick mark" />
                </div>
              </td>
              <td>{event.type ? event.type : ""}</td>
              <td>{event.event ? event.event : ""}</td>
              <td>{event.traits ? (event.traits.email ? event.traits.email : "") : ""}</td>
              <td>{event.receivedAt ? datePrettier(event.receivedAt) : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Events;
