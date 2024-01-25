import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import TripItem from './TripItem';
import Button from '../../shared/components/FormElements/Button';
import './TripList.css';

const TripList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className='trip-list center'>
        <Card>
          <h2>No trips found. Maybe create one?</h2>
          <Button to='/trips/new'>Share Trip</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className='trip-list'>
      {props.items.map((trip) => (
        <TripItem
          key={trip.id}
          id={trip.id}
          image={trip.image}
          title={trip.title}
          description={trip.description}
          location={trip.location}
          creatorId={trip.creator}
          onDelete={props.onDeleteTrip}
        />
      ))}
    </ul>
  );
};

export default TripList;
