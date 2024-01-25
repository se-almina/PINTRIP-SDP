import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './TripForm.css';

const UpdateTrip = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedTrip, setLoadedTrip] = useState();
  const tripId = useParams().tripId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:4000/api/trips/${tripId}`);
        setLoadedTrip(responseData.trip);
        setFormData(
          {
            title: {
              value: responseData.trip.title,
              isValid: true,
            },
            description: {
              value: responseData.trip.description,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchTrip();
  }, [sendRequest, tripId, setFormData]);

  const tripUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        `http://localhost:4000/api/trips/${tripId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
      history.push('/' + auth.userId + '/trips');
    } catch (err) {}
  };

  if (isLoading) {
    return (
      <div className='center'>
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedTrip && !error) {
    return (
      <div className='center'>
        <Card>
          <h2>Could not find trip!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedTrip && (
        <form className='trip-form' onSubmit={tripUpdateSubmitHandler}>
          <Input
            id='title'
            element='input'
            type='text'
            label='Title'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid title.'
            onInput={inputHandler}
            initialValue={loadedTrip.title}
            initialValid={true}
          />
          <Input
            id='description'
            element='textarea'
            label='Description'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Please enter a valid description (min. 5 characters).'
            onInput={inputHandler}
            initialValue={loadedTrip.description}
            initialValid={true}
          />
          <Button type='submit' disabled={!formState.isValid}>
            UPDATE TRIP
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdateTrip;
